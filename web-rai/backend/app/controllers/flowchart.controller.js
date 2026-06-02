const { Flowchart } = require('../models');
const { Op } = require('sequelize');

const clean = (v) => (v === undefined ? undefined : v === null ? null : v);

exports.findAll = async (req, res) => {
  try {
    const { q, status } = req.query;
    const where = {};
    if (q)      where.title  = { [Op.iLike]: `%${q}%` };
    if (status) where.status = status;
    const rows = await Flowchart.findAll({
      where,
      attributes: ['id','title','description','status','createdAt','updatedAt'],
      order: [['updatedAt', 'DESC']],
    });
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.findOne = async (req, res) => {
  try {
    const fc = await Flowchart.findByPk(req.params.id);
    if (!fc) return res.status(404).json({ message: 'Flowchart non trouvé' });
    res.json(fc);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const fc = await Flowchart.create({
      title:       String(req.body.title || '').trim() || 'Nouvelle gamme',
      description: clean(req.body.description) || null,
      steps:       Array.isArray(req.body.steps) ? req.body.steps : [],
      status:      ['draft','published'].includes(req.body.status) ? req.body.status : 'draft',
    });
    res.status(201).json(fc);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const fc = await Flowchart.findByPk(req.params.id);
    if (!fc) return res.status(404).json({ message: 'Flowchart non trouvé' });
    const patch = {};
    if (req.body.title       !== undefined) patch.title       = String(req.body.title).trim();
    if (req.body.description !== undefined) patch.description = req.body.description || null;
    if (req.body.steps       !== undefined) patch.steps       = Array.isArray(req.body.steps) ? req.body.steps : fc.steps;
    if (req.body.status      !== undefined) patch.status      = ['draft','published'].includes(req.body.status) ? req.body.status : fc.status;
    await fc.update(patch);
    res.json(fc);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const fc = await Flowchart.findByPk(req.params.id);
    if (!fc) return res.status(404).json({ message: 'Flowchart non trouvé' });
    await fc.destroy();
    res.json({ message: 'Supprimé' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
