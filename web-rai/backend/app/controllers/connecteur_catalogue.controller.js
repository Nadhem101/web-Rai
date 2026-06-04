const { ConnecteurCatalogue } = require('../models');
const { Op } = require('sequelize');

exports.findAll = async (req, res) => {
  try {
    const { q } = req.query;
    const where = q ? {
      [Op.or]: [
        { ref_connecteur:   { [Op.iLike]: `%${q}%` } },
        { designation:      { [Op.iLike]: `%${q}%` } },
        { ref_contrepartie: { [Op.iLike]: `%${q}%` } },
      ],
    } : {};
    const rows = await ConnecteurCatalogue.findAll({ where, order: [['ref_connecteur', 'ASC']] });
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.findOne = async (req, res) => {
  try {
    const c = await ConnecteurCatalogue.findByPk(req.params.id);
    if (!c) return res.status(404).json({ message: 'Connecteur non trouvé' });
    res.json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const c = await ConnecteurCatalogue.create({
      ref_connecteur:          String(req.body.ref_connecteur || '').trim(),
      designation:             req.body.designation      || null,
      ref_contrepartie:        req.body.ref_contrepartie || null,
      photo_url:               req.body.photo_url        || null,
      notes:                   req.body.notes            || null,
      approvisionnements_conn: Array.isArray(req.body.approvisionnements_conn) ? req.body.approvisionnements_conn : [],
      approvisionnements_cp:   Array.isArray(req.body.approvisionnements_cp)   ? req.body.approvisionnements_cp   : [],
      solution_interne:        req.body.solution_interne || null,
    });
    res.status(201).json(c);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const c = await ConnecteurCatalogue.findByPk(req.params.id);
    if (!c) return res.status(404).json({ message: 'Connecteur non trouvé' });
    const patch = {};
    const fields = ['ref_connecteur','designation','ref_contrepartie','photo_url','notes','solution_interne'];
    fields.forEach(f => { if (req.body[f] !== undefined) patch[f] = req.body[f] || null; });
    if (req.body.approvisionnements_conn !== undefined) patch.approvisionnements_conn = Array.isArray(req.body.approvisionnements_conn) ? req.body.approvisionnements_conn : c.approvisionnements_conn;
    if (req.body.approvisionnements_cp   !== undefined) patch.approvisionnements_cp   = Array.isArray(req.body.approvisionnements_cp)   ? req.body.approvisionnements_cp   : c.approvisionnements_cp;
    await c.update(patch);
    res.json(c);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const c = await ConnecteurCatalogue.findByPk(req.params.id);
    if (!c) return res.status(404).json({ message: 'Connecteur non trouvé' });
    await c.destroy();
    res.json({ message: 'Supprimé' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
