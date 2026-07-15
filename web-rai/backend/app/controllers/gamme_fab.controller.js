const { ProcessusFab, EtapeFab, GammeOutillage, Outillage, OutillageReference, OutillagePhoto } = require('../models');

const outillageInclude = {
  model: Outillage,
  as: 'outillage',
  include: [
    { model: OutillageReference, as: 'references', order: [['ordre', 'ASC']] },
    { model: OutillagePhoto,     as: 'photos',     order: [['ordre', 'ASC']] },
  ],
};

const fullInclude = [
  {
    model: EtapeFab,
    as: 'etapes',
    include: [{ model: GammeOutillage, as: 'gammeOutillages', include: [outillageInclude] }],
  },
];

exports.getAll = async (req, res) => {
  try {
    const list = await ProcessusFab.findAll({
      include: fullInclude,
      order: [
        ['ordre', 'ASC'],
        [{ model: EtapeFab, as: 'etapes' }, 'ordre', 'ASC'],
        [{ model: EtapeFab, as: 'etapes' }, { model: GammeOutillage, as: 'gammeOutillages' }, 'ordre', 'ASC'],
      ],
    });
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createProcessus = async (req, res) => {
  try {
    const { nom } = req.body;
    const max = (await ProcessusFab.max('ordre')) || 0;
    const p = await ProcessusFab.create({ nom, ordre: max + 1 });
    res.status(201).json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.updateProcessus = async (req, res) => {
  try {
    const p = await ProcessusFab.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Non trouvé' });
    await p.update(req.body);
    res.json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteProcessus = async (req, res) => {
  try {
    const p = await ProcessusFab.findByPk(req.params.id, {
      include: [{ model: EtapeFab, as: 'etapes' }],
    });
    if (!p) return res.status(404).json({ error: 'Non trouvé' });
    for (const etape of (p.etapes || [])) {
      await GammeOutillage.destroy({ where: { etape_id: etape.id } });
      await etape.destroy();
    }
    await p.destroy();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createEtape = async (req, res) => {
  try {
    const { processus_id, nom_etape } = req.body;
    const max = (await EtapeFab.max('ordre', { where: { processus_id } })) || 0;
    const e = await EtapeFab.create({ processus_id, nom_etape, ordre: max + 1 });
    res.status(201).json(e);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.updateEtape = async (req, res) => {
  try {
    const e = await EtapeFab.findByPk(req.params.id);
    if (!e) return res.status(404).json({ error: 'Non trouvé' });
    await e.update(req.body);
    res.json(e);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteEtape = async (req, res) => {
  try {
    const e = await EtapeFab.findByPk(req.params.id);
    if (!e) return res.status(404).json({ error: 'Non trouvé' });
    await GammeOutillage.destroy({ where: { etape_id: e.id } });
    await e.destroy();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addOutillageToEtape = async (req, res) => {
  try {
    const { etape_id, outillage_id } = req.body;
    const max = (await GammeOutillage.max('ordre', { where: { etape_id } })) || 0;
    const g = await GammeOutillage.create({ etape_id, outillage_id, ordre: max + 1 });
    res.status(201).json(g);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.removeOutillageFromEtape = async (req, res) => {
  try {
    const g = await GammeOutillage.findByPk(req.params.id);
    if (!g) return res.status(404).json({ error: 'Non trouvé' });
    await g.destroy();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
