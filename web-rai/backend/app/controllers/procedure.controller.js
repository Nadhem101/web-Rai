const { Procedure } = require('../models');
const { Op } = require('sequelize');

exports.findAll = async (req, res) => {
  try {
    const { q } = req.query;
    const where = q ? { label: { [Op.iLike]: `%${q}%` } } : {};
    const rows = await Procedure.findAll({ where, order: [['label', 'ASC']] });
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.findOne = async (req, res) => {
  try {
    const p = await Procedure.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Procédure non trouvée' });
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const p = await Procedure.create({
      label:       String(req.body.label || '').trim(),
      shape:       req.body.shape       || 'operation',
      description: req.body.description || null,
      tools:       Array.isArray(req.body.tools)       ? req.body.tools       : [],
      parameters:  Array.isArray(req.body.parameters)  ? req.body.parameters  : [],
      media:       Array.isArray(req.body.media)        ? req.body.media       : [],
    });
    res.status(201).json(p);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const p = await Procedure.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Procédure non trouvée' });
    const patch = {};
    if (req.body.label       !== undefined) patch.label       = String(req.body.label).trim();
    if (req.body.shape       !== undefined) patch.shape       = req.body.shape;
    if (req.body.description !== undefined) patch.description = req.body.description || null;
    if (req.body.tools       !== undefined) patch.tools       = Array.isArray(req.body.tools)      ? req.body.tools      : p.tools;
    if (req.body.parameters  !== undefined) patch.parameters  = Array.isArray(req.body.parameters) ? req.body.parameters : p.parameters;
    if (req.body.media       !== undefined) patch.media       = Array.isArray(req.body.media)      ? req.body.media      : p.media;
    await p.update(patch);
    res.json(p);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const p = await Procedure.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Procédure non trouvée' });
    await p.destroy();
    res.json({ message: 'Supprimée' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
