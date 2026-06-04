const { FournisseurCatalogue } = require('../models');
const { Op } = require('sequelize');

exports.findAll = async (req, res) => {
  try {
    const { q } = req.query;
    const where = q ? { nom: { [Op.iLike]: `%${q}%` } } : {};
    const rows = await FournisseurCatalogue.findAll({ where, order: [['nom', 'ASC']] });
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const f = await FournisseurCatalogue.create({
      nom:      String(req.body.nom || '').trim(),
      site_web: req.body.site_web || null,
      notes:    req.body.notes    || null,
    });
    res.status(201).json(f);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const f = await FournisseurCatalogue.findByPk(req.params.id);
    if (!f) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    const patch = {};
    if (req.body.nom      !== undefined) patch.nom      = String(req.body.nom).trim();
    if (req.body.site_web !== undefined) patch.site_web = req.body.site_web || null;
    if (req.body.notes    !== undefined) patch.notes    = req.body.notes    || null;
    await f.update(patch);
    res.json(f);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const f = await FournisseurCatalogue.findByPk(req.params.id);
    if (!f) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    await f.destroy();
    res.json({ message: 'Supprimé' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
