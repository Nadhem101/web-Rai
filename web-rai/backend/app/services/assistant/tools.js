const { Op } = require('sequelize');
const {
  CurativeMaintenanceRecord,
  Equipement, Zone, Fabricant, MaintenanceEvent,
  Pince, PincePreventiveRecord,
  Applicateur, ApplicateurPreventiveRecord,
  EcmeEtat, EcmeIntervention,
  Outillage,
  Flowchart,
  Chiffrage, ChiffrageLigne,
  Gamme, ProcessusFab, EtapeFab, GammeOutillage,
  ArticleTest, DetailArticle,
} = require('../../models');
const { canAny } = require('./permissions');
const { resolveEquipement, getCurrentWeek, getTasksForWeek, getOverdueTasks } = require('./scheduleMath');

const PDR_LOW_STOCK_THRESHOLD = 1;
const OUTILLAGE_LOW_STOCK_THRESHOLD = 1;

const parseQuantity = (value) => {
  const n = String(value ?? '').replace(',', '.').trim();
  if (!n) return null;
  const p = Number(n);
  return Number.isFinite(p) ? p : null;
};

const normalizeProgramme = (v = '') =>
  String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Case-insensitive exact match, falling back to a substring match — local
// models are more likely than Claude to get padding/casing slightly wrong
// (e.g. "P1" vs "P01"), so give lookups one forgiving retry before failing.
async function findOneForgiving(model, field, rawValue, options = {}) {
  const value = String(rawValue).trim();
  let row = await model.findOne({ ...options, where: { ...(options.where || {}), [field]: { [Op.iLike]: value } } });
  if (!row) {
    row = await model.findOne({ ...options, where: { ...(options.where || {}), [field]: { [Op.iLike]: `%${value}%` } } });
  }
  return row;
}

// Tool registry — single source of truth. Model tool defs, role filtering, and
// dispatch all derive from this one list. Each tool:
//   name, description, input_schema (Claude tool schema)
//   kind: 'read' | 'write' — write tools are not executed yet (M0 is read-only)
//   sections: app sections (see permissions.js) required to call this tool
//   handler(input) -> plain JSON-serializable result. A result with a `link`
//     field (or a `matches[]` array whose entries have `link`) gets promoted
//     to a navigable "Ouvrir →" button in the chat UI — see extractReferences.
const TOOLS = [
  {
    name: 'getIncidentStats',
    description:
      "Curative maintenance incident stats — incident count, average downtime, MTBF — over a date range, " +
      'optionally for one équipement. Use for questions about breakdowns, incidents, MTTR/MTBF, downtime.',
    input_schema: {
      type: 'object',
      properties: {
        from: { type: 'string', description: 'ISO date (YYYY-MM-DD), inclusive lower bound. Omit for no lower bound.' },
        to: { type: 'string', description: 'ISO date (YYYY-MM-DD), inclusive upper bound. Omit for no upper bound.' },
        equipementCode: { type: 'string', description: 'Filter to one équipement by its code_rai (e.g. EQUIP347). Omit for all équipements.' },
      },
      required: [],
    },
    kind: 'read',
    sections: ['curatif'],
    handler: async (input = {}) => {
      const where = {};
      if (input.from || input.to) {
        where.incident_date = {};
        if (input.from) where.incident_date[Op.gte] = input.from;
        if (input.to) where.incident_date[Op.lte] = input.to;
      }
      if (input.equipementCode) where.equipement_code = input.equipementCode;

      const records = await CurativeMaintenanceRecord.findAll({ where });

      const downtimes = records.map((r) => Number(r.downtime_minutes)).filter(Number.isFinite);
      const bonFonctionnement = records.map((r) => Number(r.bon_fonctionnement_minutes)).filter(Number.isFinite);
      const avg = (arr) => (arr.length ? Number((arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(2)) : null);

      return {
        incidentCount: records.length,
        avgDowntimeMinutes: avg(downtimes),
        mtbfMinutes: avg(bonFonctionnement),
        filters: { from: input.from ?? null, to: input.to ?? null, equipementCode: input.equipementCode ?? null },
      };
    },
  },

  {
    name: 'getOverdueMaintenance',
    description:
      'Préventive maintenance items that are overdue (scheduled in a past week this year, not marked done or rescheduled), ' +
      'optionally filtered by zone. Use for "what maintenance is overdue / late / behind schedule" questions.',
    input_schema: {
      type: 'object',
      properties: {
        zone: { type: 'string', description: 'Filter to one zone (e.g. Cablage, Electronique). Omit for all zones.' },
      },
      required: [],
    },
    kind: 'read',
    sections: ['maintenance'],
    handler: async (input = {}) => {
      const include = [{ model: Zone, required: !!input.zone }];
      if (input.zone) include[0].where = { nom_zone: { [Op.iLike]: `%${input.zone}%` } };

      const equipements = await Equipement.findAll({ where: { categorie: 'equipement' }, include });
      const resolved = equipements.map(resolveEquipement);
      const currentWeek = getCurrentWeek();
      const currentYear = new Date().getFullYear();
      const overdue = getOverdueTasks(resolved, currentWeek);

      const events = await MaintenanceEvent.findAll({ where: { year: currentYear } });
      const settled = new Set(events.map((e) => `${e.equip_code}__${e.interval_type}__${e.week}`));
      const stillOverdue = overdue.filter((t) => !settled.has(t.key));

      return {
        overdueCount: stillOverdue.length,
        currentWeek,
        sample: stillOverdue.slice(0, 20).map((t) => ({
          code: t.equip.code, designation: t.equip.designation, zone: t.equip.zone,
          intervalType: t.intType, week: t.week,
        })),
      };
    },
  },

  {
    name: 'getEquipmentDetails',
    description:
      'Full details for one équipement by its code_rai — status, zone, category, PDR/fer-et-bain specifics, and its ' +
      'préventive maintenance schedule (this week\'s tasks, done/pending/rescheduled, overdue count). ' +
      'Use for "tell me about EQUIP347" / "what\'s the status and maintenance schedule of X" questions.',
    input_schema: {
      type: 'object',
      properties: { codeRai: { type: 'string', description: 'The équipement code, e.g. EQUIP347.' } },
      required: ['codeRai'],
    },
    kind: 'read',
    sections: ['inventaire'],
    handler: async (input = {}) => {
      if (!input.codeRai) return { error: 'codeRai is required' };
      const equip = await findOneForgiving(Equipement, 'code_rai', input.codeRai, { include: [Zone, Fabricant] });
      if (!equip) return { found: false, message: `Aucun équipement avec le code ${input.codeRai}.` };

      const resolved = resolveEquipement(equip);
      const currentWeek = getCurrentWeek();
      const currentYear = new Date().getFullYear();
      const thisWeekTasks = getTasksForWeek([resolved], currentWeek);
      const overdueTasks = getOverdueTasks([resolved], currentWeek);

      const events = await MaintenanceEvent.findAll({ where: { equip_code: resolved.code, year: currentYear } });
      const eventFor = (key) => events.find((e) => `${e.equip_code}__${e.interval_type}__${e.week}` === key);
      const settled = new Set(events.map((e) => `${e.equip_code}__${e.interval_type}__${e.week}`));

      return {
        codeRai: equip.code_rai,
        designation: equip.designation,
        statut: equip.statut,
        categorie: equip.categorie,
        zone: equip.Zone?.nom_zone ?? null,
        fabricant: equip.Fabricant?.nom ?? null,
        numeroSerie: equip.numero_serie,
        dateAcquisition: equip.date_acquisition,
        remarque: equip.remarque,
        pdrDetails: equip.categorie === 'pdr' ? equip.pdr_details : undefined,
        ferBainSeuil: equip.fer_bain_seuil ?? undefined,
        maintenanceIntervals: resolved.intervals,
        thisWeekTasks: thisWeekTasks.map((t) => ({
          intervalType: t.intType, week: t.week,
          status: eventFor(t.key)?.status ?? 'pending',
        })),
        overdueCount: overdueTasks.filter((t) => !settled.has(t.key)).length,
        link: `/inventaire${equip.categorie && equip.categorie !== 'equipement' ? `?categorie=${equip.categorie}` : ''}`,
        linkLabel: `Ouvrir ${equip.code_rai} dans l'inventaire`,
      };
    },
  },

  {
    name: 'getPinceDetails',
    description:
      'Full details for one pince by its numero_pince — status, latest calibration control dates, and per-position ' +
      'traction test history. Use for "details/status/maintenance dates of pince PXX" questions.',
    input_schema: {
      type: 'object',
      properties: { numeroPince: { type: 'string', description: 'The pince number, e.g. P12.' } },
      required: ['numeroPince'],
    },
    kind: 'read',
    sections: ['maintenance'],
    handler: async (input = {}) => {
      if (!input.numeroPince) return { error: 'numeroPince is required' };
      const pince = await findOneForgiving(Pince, 'numero_pince', input.numeroPince, { include: [Fabricant] });
      if (!pince) return { found: false, message: `Aucune pince numéro ${input.numeroPince}.` };

      const records = await PincePreventiveRecord.findAll({
        where: { numero_pince: pince.numero_pince, is_historique: false },
        order: [['date_controle', 'DESC']],
      });

      const nextDate = records.find((r) => r.date_prochaine)?.date_prochaine ?? null;
      const scheduleStatus = !nextDate ? 'non initié' : (new Date(nextDate) < new Date() ? 'en retard' : 'à jour');

      return {
        numeroPince: pince.numero_pince,
        referencePince: pince.reference_pince,
        statut: pince.statut,
        fabricant: pince.Fabricant?.nom ?? null,
        remarque: pince.remarque,
        scheduleStatus,
        nextControlDate: nextDate,
        positions: records.map((r) => ({
          position: r.position, cosse: r.cosse, fil: r.fil, moyenne: r.moyenne,
          dateControle: r.date_controle, dateProchaine: r.date_prochaine, statutVerification: r.statut_verification,
        })),
        link: '/preventif/suivi-pinces',
        linkLabel: 'Voir le suivi des pinces',
      };
    },
  },

  {
    name: 'getApplicateurDetails',
    description:
      'Full details for one applicateur by its numero_outil — status, latest calibration control dates, and per-section ' +
      'crimp test history. Use for "details/status/maintenance dates of applicateur AXX" questions.',
    input_schema: {
      type: 'object',
      properties: { numeroOutil: { type: 'string', description: 'The applicateur number, e.g. A1.' } },
      required: ['numeroOutil'],
    },
    kind: 'read',
    sections: ['maintenance'],
    handler: async (input = {}) => {
      if (!input.numeroOutil) return { error: 'numeroOutil is required' };
      const applicateur = await findOneForgiving(Applicateur, 'numero_outil', input.numeroOutil);
      if (!applicateur) return { found: false, message: `Aucun applicateur numéro ${input.numeroOutil}.` };

      const records = await ApplicateurPreventiveRecord.findAll({
        where: { numero_outil: applicateur.numero_outil, is_historique: false },
        order: [['date_controle', 'DESC']],
      });

      const nextDate = records.find((r) => r.date_prochaine)?.date_prochaine ?? null;
      const scheduleStatus = !nextDate ? 'non initié' : (new Date(nextDate) < new Date() ? 'en retard' : 'à jour');

      return {
        numeroOutil: applicateur.numero_outil,
        designation: applicateur.designation,
        constructeur: applicateur.constructeur_outil,
        statut: applicateur.statut,
        remarque: applicateur.remarque,
        scheduleStatus,
        nextControlDate: nextDate,
        sections: records.map((r) => ({
          sectionMm2: r.section_mm2, seuilN: r.seuil_n, moyenne: r.moyenne,
          dateControle: r.date_controle, dateProchaine: r.date_prochaine,
        })),
        link: '/preventif/suivi-applicateurs',
        linkLabel: 'Voir le suivi des applicateurs',
      };
    },
  },

  {
    name: 'getEcmeStatus',
    description:
      'ECME (measurement/test equipment) status — a single ECME\'s full details by code, or aggregate counts by ' +
      'verification status/affectation when no code is given. Use for ECME verification questions.',
    input_schema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'One ECME code, e.g. ECME088. Omit for an aggregate summary.' },
        affectation: { type: 'string', description: 'Filter the aggregate summary to one affectation zone.' },
        alerte: { type: 'string', description: 'Filter the aggregate summary to one status: VALABLE, VERIFICATION, EXEMPTE, DECLASSE, INCONNU.' },
      },
      required: [],
    },
    kind: 'read',
    sections: ['ecme'],
    handler: async (input = {}) => {
      if (input.code) {
        const ecme = await findOneForgiving(EcmeEtat, 'code', input.code, {
          include: [{ model: EcmeIntervention, as: 'interventions' }],
        });
        if (!ecme) return { found: false, message: `Aucun ECME avec le code ${input.code}.` };
        return {
          code: ecme.code, designation: ecme.designation, marque: ecme.marque, numeroSerie: ecme.n_serie,
          affectation: ecme.affectation, necessiteVerification: ecme.necessite_verification, alerte: ecme.alerte,
          dateDerniereVerification: ecme.date_derniere_verification,
          dateProchaineVerification: ecme.date_prochaine_verification,
          remarques: ecme.remarques,
          interventionCount: ecme.interventions?.length ?? 0,
          link: `/ecme/${ecme.code}`,
          linkLabel: `Ouvrir la fiche de vie ${ecme.code}`,
        };
      }

      const where = {};
      if (input.affectation) where.affectation = { [Op.iLike]: `%${input.affectation}%` };
      if (input.alerte) where.alerte = String(input.alerte).toUpperCase();
      const list = await EcmeEtat.findAll({ where });

      const byAlerte = {};
      list.forEach((e) => { byAlerte[e.alerte] = (byAlerte[e.alerte] || 0) + 1; });
      const today = new Date();
      const overdue = list.filter(
        (e) => e.date_prochaine_verification && new Date(e.date_prochaine_verification) < today && !['EXEMPTE', 'DECLASSE'].includes(e.alerte)
      ).length;

      return { total: list.length, byAlerte, overdue };
    },
  },

  {
    name: 'getStockAlerts',
    description:
      'Low-stock alerts for PDR (pièces de rechange) or outillages — items at or below the low-stock threshold. ' +
      'Use for "what\'s low in stock / out of stock" questions.',
    input_schema: {
      type: 'object',
      properties: { category: { type: 'string', enum: ['pdr', 'outillages'], description: 'Which stock to check.' } },
      required: ['category'],
    },
    kind: 'read',
    sections: ['inventaire'],
    handler: async (input = {}) => {
      if (input.category === 'outillages') {
        const items = await Outillage.findAll();
        const low = items
          .map((o) => ({ id: o.id, designation: o.designation, quantity: Number(o.quantity) }))
          .filter((o) => Number.isFinite(o.quantity) && o.quantity <= OUTILLAGE_LOW_STOCK_THRESHOLD)
          .sort((a, b) => a.quantity - b.quantity);
        return {
          category: 'outillages', lowStockCount: low.length, items: low.slice(0, 20),
          link: '/inventaire/outillages', linkLabel: 'Voir le stock outillages',
        };
      }

      const equipements = await Equipement.findAll({ where: { categorie: 'pdr' } });
      const parts = [];
      equipements.forEach((e) => {
        const d = e.pdr_details || {};
        [
          ['lame_cuivre', 'Lame cuivre'], ['lame_isolant', 'Lame isolant'],
          ['enclume_cuivre', 'Encl. cuivre'], ['enclume_isolant', 'Encl. isolant'],
        ].forEach(([key, label]) => {
          const qty = parseQuantity(d[key]?.quantity);
          if (qty !== null && qty <= PDR_LOW_STOCK_THRESHOLD) parts.push({ codeRai: e.code_rai, designation: e.designation, part: label, quantity: qty });
        });
        const denudQty = parseQuantity(d.lame_denudage_jeux);
        if (denudQty !== null && denudQty <= PDR_LOW_STOCK_THRESHOLD) {
          parts.push({ codeRai: e.code_rai, designation: e.designation, part: 'Dénudage', quantity: denudQty });
        }
      });
      return {
        category: 'pdr', lowStockCount: parts.length, items: parts.slice(0, 20),
        link: '/inventaire?categorie=pdr', linkLabel: 'Voir le stock PDR',
      };
    },
  },

  {
    name: 'findFlowCharts',
    description: 'Search flow charts by title/description, or list recent ones if no query. Use to find/open a specific flow chart.',
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Search text. Omit to list the most recently updated flow charts.' } },
      required: [],
    },
    kind: 'read',
    sections: ['indus'],
    handler: async (input = {}) => {
      const where = input.query
        ? { [Op.or]: [{ title: { [Op.iLike]: `%${input.query}%` } }, { description: { [Op.iLike]: `%${input.query}%` } }] }
        : {};
      const results = await Flowchart.findAll({ where, order: [['updatedAt', 'DESC']], limit: 5 });
      return {
        count: results.length,
        matches: results.map((f) => ({
          id: f.id, title: f.title, status: f.status, stepCount: Array.isArray(f.steps) ? f.steps.length : 0,
          link: `/industrialization/flow-chart/${f.id}/view`, linkLabel: `Ouvrir « ${f.title} »`,
        })),
      };
    },
  },

  {
    name: 'findChiffrages',
    description: 'Search chiffrages by affaire/client/reference/titre, or list recent ones if no query. Use to find/open a specific chiffrage.',
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Search text. Omit to list the most recently updated chiffrages.' } },
      required: [],
    },
    kind: 'read',
    sections: ['indus'],
    handler: async (input = {}) => {
      const where = input.query
        ? {
            [Op.or]: [
              { titre: { [Op.iLike]: `%${input.query}%` } },
              { affaire: { [Op.iLike]: `%${input.query}%` } },
              { client: { [Op.iLike]: `%${input.query}%` } },
              { reference_article: { [Op.iLike]: `%${input.query}%` } },
            ],
          }
        : {};
      const results = await Chiffrage.findAll({ where, include: [{ model: ChiffrageLigne, as: 'lignes' }], order: [['updatedAt', 'DESC']], limit: 5 });
      return {
        count: results.length,
        matches: results.map((c) => ({
          id: c.id, titre: c.titre, affaire: c.affaire, client: c.client, referenceArticle: c.reference_article,
          status: c.status, ligneCount: c.lignes?.length ?? 0,
          link: `/industrialization/chiffrage/${c.id}`, linkLabel: `Ouvrir le chiffrage ${c.affaire || c.titre || c.id}`,
        })),
      };
    },
  },

  {
    name: 'findGammeFabrication',
    description:
      'Search fabrication routing files (gamme de fabrication) by name — each gamme holds one or more processus, ' +
      'each with its own étapes and associated outillages. Use for "gamme de fabrication for X" / ' +
      '"which outillages does step Y need" questions.',
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Search text (gamme name). Omit to list all gammes.' } },
      required: [],
    },
    kind: 'read',
    sections: ['indus'],
    handler: async (input = {}) => {
      const where = input.query ? { nom: { [Op.iLike]: `%${input.query}%` } } : {};
      const gammes = await Gamme.findAll({
        where,
        include: [{
          model: ProcessusFab, as: 'processus',
          include: [{ model: EtapeFab, as: 'etapes', include: [{ model: GammeOutillage, as: 'gammeOutillages', include: [{ model: Outillage, as: 'outillage' }] }] }],
        }],
        order: [['ordre', 'ASC']],
        limit: 5,
      });
      if (gammes.length === 0) return { found: false, message: 'Aucune gamme de fabrication trouvée.' };
      return {
        count: gammes.length,
        matches: gammes.map((g) => ({
          id: g.id,
          nom: g.nom,
          processus: (g.processus || [])
            .slice()
            .sort((a, b) => a.ordre - b.ordre)
            .map((p) => ({
              nom: p.nom,
              etapes: (p.etapes || [])
                .slice()
                .sort((a, b) => a.ordre - b.ordre)
                .map((e) => ({
                  nomEtape: e.nom_etape,
                  outillages: (e.gammeOutillages || []).map((go) => go.outillage?.designation).filter(Boolean),
                })),
            })),
          link: `/industrialization/gamme-fab/${g.id}`,
          linkLabel: `Ouvrir « ${g.nom} »`,
        })),
      };
    },
  },

  {
    name: 'getArticleTestInfo',
    description:
      'Test des câbles / faisceau article info — a single article\'s full details (testeur, programme Programmé/' +
      'Auto-apprentissage, nappes) by numero_article, or the Programmé vs Auto-apprentissage split across all ' +
      'articles when no number is given.',
    input_schema: {
      type: 'object',
      properties: { numeroArticle: { type: 'string', description: 'One article number, e.g. KU0761073300. Omit for the aggregate split.' } },
      required: [],
    },
    kind: 'read',
    sections: ['indus'],
    handler: async (input = {}) => {
      if (input.numeroArticle) {
        const article = await findOneForgiving(ArticleTest, 'numero_article', input.numeroArticle, {
          include: [{ model: DetailArticle, as: 'details' }],
        });
        if (!article) return { found: false, message: `Aucun article de test ${input.numeroArticle}.` };
        return {
          numeroArticle: article.numero_article, indice: article.indice, designation: article.designation,
          numeroTesteur: article.numero_testeur, programmeTest: article.programme_test,
          nappes: (article.details || []).map((d) => ({ nappe: d.nappe_utilisee, emplacement: d.emplacement, interface: d.interface })),
          link: '/industrialization/test-cables',
          linkLabel: 'Voir dans Test des câbles',
        };
      }

      const all = await ArticleTest.findAll();
      let programme = 0, autoApprentissage = 0, nonRenseigne = 0;
      all.forEach((a) => {
        const n = normalizeProgramme(a.programme_test);
        if (n.startsWith('programm')) programme++;
        else if (n) autoApprentissage++;
        else nonRenseigne++;
      });
      return { total: all.length, programme, autoApprentissage, nonRenseigne };
    },
  },
];

// Tool defs shown to the model — pre-filtered by role. Hygiene only; the real
// gate is the `canAny` check in the orchestrator's dispatch loop.
const getToolDefsForRoles = (userRoles) =>
  TOOLS.filter((t) => canAny(userRoles, t.sections)).map(({ name, description, input_schema }) => ({
    name,
    description,
    input_schema,
  }));

// Same filtering, wrapped in the OpenAI-style {type, function} shape Ollama
// (and most local-model tool-calling APIs) expect. `input_schema` is already
// a plain JSON schema, so it slots directly into `function.parameters`.
const getOllamaToolDefsForRoles = (userRoles) =>
  TOOLS.filter((t) => canAny(userRoles, t.sections)).map(({ name, description, input_schema }) => ({
    type: 'function',
    function: { name, description, parameters: input_schema },
  }));

const findTool = (name) => TOOLS.find((t) => t.name === name);

// Promotes a tool result's `link` (single-result tools) or `matches[].link`
// (multi-result tools) into navigable references for the chat UI — the model
// never writes the URL itself, so it can't get it wrong.
const extractReferences = (result) => {
  const refs = [];
  if (result?.link) refs.push({ label: result.linkLabel || result.link, path: result.link });
  if (Array.isArray(result?.matches)) {
    result.matches.forEach((m) => {
      if (m?.link) refs.push({ label: m.linkLabel || m.link, path: m.link });
    });
  }
  return refs;
};

module.exports = { TOOLS, getToolDefsForRoles, getOllamaToolDefsForRoles, findTool, extractReferences };
