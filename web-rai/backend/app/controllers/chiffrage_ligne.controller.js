const { ChiffrageLigne } = require('../models');

const clean = (v) => (v === undefined || v === null || v === '') ? null : v;
const num   = (v, def = 0) => (v !== undefined && v !== null && v !== '') ? (Number(v) || def) : def;

const STATUTS = ['en_stock', 'rupture', 'a_commander', 'interne'];
const validStatut = (v, def = 'a_commander') => STATUTS.includes(v) ? v : def;

const buildPayload = (body) => ({
  chiffrage_id:       Number(body.chiffrage_id),
  ordre:              num(body.ordre, 0),
  ref_connecteur:     clean(body.ref_connecteur),
  designation:        clean(body.designation),
  ref_contrepartie:   clean(body.ref_contrepartie),
  photo_url:          clean(body.photo_url),
  // Connector supply
  fournisseur:        clean(body.fournisseur),
  ref_fournisseur:    clean(body.ref_fournisseur),
  statut_stock:       validStatut(body.statut_stock),
  prix_unitaire:      num(body.prix_unitaire),
  // Contrepartie supply
  fournisseur_cp:     clean(body.fournisseur_cp),
  ref_fournisseur_cp: clean(body.ref_fournisseur_cp),
  statut_cp:          validStatut(body.statut_cp),
  prix_cp:            num(body.prix_cp),
  // Internal solution
  solution_interne:   clean(body.solution_interne),
  commentaire_rai:    clean(body.commentaire_rai),
  quantite:           num(body.quantite, 1),
});

exports.create = async (req, res) => {
  try {
    const ligne = await ChiffrageLigne.create(buildPayload(req.body));
    res.status(201).json(ligne);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const ligne = await ChiffrageLigne.findByPk(req.params.id);
    if (!ligne) return res.status(404).json({ message: 'Ligne non trouvée' });
    const payload = buildPayload({ chiffrage_id: ligne.chiffrage_id, ...req.body });
    await ligne.update(payload);
    res.json(ligne);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const ligne = await ChiffrageLigne.findByPk(req.params.id);
    if (!ligne) return res.status(404).json({ message: 'Ligne non trouvée' });
    await ligne.destroy();
    res.json({ message: 'Supprimée' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
