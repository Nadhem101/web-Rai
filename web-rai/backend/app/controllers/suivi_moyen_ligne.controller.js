const { SuiviMoyenLigne } = require('../models');

const clean = (v) => (v === undefined || v === null || v === '') ? null : v;
const num   = (v, d = 0) => Number.isFinite(Number(v)) ? Number(v) : d;

const build = (body) => ({
  suivi_moyen_id: Number(body.suivi_moyen_id),
  ordre:          num(body.ordre, 0),
  client:         clean(body.client),
  numero_affaire: clean(body.numero_affaire),
  reference:      clean(body.reference),
  delai_max:      clean(body.delai_max),
  priorite:       body.priorite || 'Normale',
  type_demande:   clean(body.type_demande),
  activite:       clean(body.activite),
  attribue_a:     clean(body.attribue_a),
  avancement:     num(body.avancement, 0),
  date_debut:     clean(body.date_debut),
  date_fin:       clean(body.date_fin),
  commentaire:    clean(body.commentaire),
});

exports.create = async (req, res) => {
  try {
    const row = await SuiviMoyenLigne.create(build(req.body));
    res.status(201).json(row);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const row = await SuiviMoyenLigne.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Ligne non trouvée' });
    await row.update(build({ suivi_moyen_id: row.suivi_moyen_id, ...req.body }));
    res.json(row);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const row = await SuiviMoyenLigne.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Ligne non trouvée' });
    await row.destroy();
    res.json({ message: 'Supprimée' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
