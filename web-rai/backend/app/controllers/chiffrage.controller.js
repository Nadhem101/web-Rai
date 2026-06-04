const { Chiffrage, ChiffrageLigne } = require('../models');
const { Op } = require('sequelize');

const VALID_STATUSES = ['brouillon', 'en_cours', 'valide', 'archive'];

exports.findAll = async (req, res) => {
  try {
    const { q } = req.query;
    const where = q ? {
      [Op.or]: [
        { affaire:           { [Op.iLike]: `%${q}%` } },
        { client:            { [Op.iLike]: `%${q}%` } },
        { reference_article: { [Op.iLike]: `%${q}%` } },
        { titre:             { [Op.iLike]: `%${q}%` } },
      ],
    } : {};

    const rows = await Chiffrage.findAll({
      where,
      include: [{ model: ChiffrageLigne, as: 'lignes' }],
      order: [['updatedAt', 'DESC']],
    });
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.findOne = async (req, res) => {
  try {
    const c = await Chiffrage.findByPk(req.params.id, {
      include: [{
        model: ChiffrageLigne,
        as: 'lignes',
        order: [['ordre', 'ASC'], ['id', 'ASC']],
      }],
    });
    if (!c) return res.status(404).json({ message: 'Chiffrage non trouvé' });
    res.json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const c = await Chiffrage.create({
      titre:             req.body.titre             || null,
      affaire:           req.body.affaire           || null,
      client:            req.body.client            || null,
      reference_article: req.body.reference_article || null,
      status:            VALID_STATUSES.includes(req.body.status) ? req.body.status : 'brouillon',
    });
    res.status(201).json(c);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const c = await Chiffrage.findByPk(req.params.id);
    if (!c) return res.status(404).json({ message: 'Chiffrage non trouvé' });
    const patch = {};
    ['titre','affaire','client','reference_article'].forEach(f => {
      if (req.body[f] !== undefined) patch[f] = req.body[f] || null;
    });
    if (req.body.status && VALID_STATUSES.includes(req.body.status)) patch.status = req.body.status;
    await c.update(patch);
    res.json(c);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const c = await Chiffrage.findByPk(req.params.id);
    if (!c) return res.status(404).json({ message: 'Chiffrage non trouvé' });
    await ChiffrageLigne.destroy({ where: { chiffrage_id: c.id } });
    await c.destroy();
    res.json({ message: 'Supprimé' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
