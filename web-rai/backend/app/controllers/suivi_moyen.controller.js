const { SuiviMoyen, SuiviMoyenLigne } = require('../models');

exports.findAll = async (req, res) => {
  try {
    const rows = await SuiviMoyen.findAll({ order: [['createdAt', 'DESC']] });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.findOne = async (req, res) => {
  try {
    const suivi = await SuiviMoyen.findByPk(req.params.id);
    if (!suivi) return res.status(404).json({ error: 'Suivi non trouvé' });
    const lignes = await SuiviMoyenLigne.findAll({
      where: { suivi_moyen_id: req.params.id },
      order: [['ordre', 'ASC'], ['id', 'ASC']],
    });
    res.json({ ...suivi.toJSON(), lignes });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const row = await SuiviMoyen.create({
      titre:      req.body.titre      || 'Suivi création + réception des moyens',
      pilote:     req.body.pilote     || null,
      date_debut: req.body.date_debut || null,
      status:     req.body.status     || 'actif',
      commentaire:req.body.commentaire|| null,
    });
    res.status(201).json(row);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const suivi = await SuiviMoyen.findByPk(req.params.id);
    if (!suivi) return res.status(404).json({ error: 'Suivi non trouvé' });
    await suivi.update({
      titre:      req.body.titre      ?? suivi.titre,
      pilote:     req.body.pilote     ?? suivi.pilote,
      date_debut: req.body.date_debut ?? suivi.date_debut,
      status:     req.body.status     ?? suivi.status,
      commentaire:req.body.commentaire?? suivi.commentaire,
    });
    res.json(suivi);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    await SuiviMoyenLigne.destroy({ where: { suivi_moyen_id: req.params.id } });
    const deleted = await SuiviMoyen.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Suivi non trouvé' });
    res.json({ message: 'Supprimé' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
