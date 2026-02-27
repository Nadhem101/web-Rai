const { EcmeEtat, EcmeIntervention } = require('../models');
const { Op } = require('sequelize');

// GET /api/ecme?affectation=...&alerte=...&search=...
exports.findAll = async (req, res) => {
  try {
    const { affectation, alerte, search } = req.query;
    const where = {};

    if (affectation) where.affectation = affectation;
    if (alerte)      where.alerte      = alerte;
    if (search) {
      where[Op.or] = [
        { code:        { [Op.iLike]: `%${search}%` } },
        { designation: { [Op.iLike]: `%${search}%` } },
        { marque:      { [Op.iLike]: `%${search}%` } },
        { affectation: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const records = await EcmeEtat.findAll({
      where,
      order: [['code', 'ASC']],
      attributes: { exclude: [] },
    });

    return res.json(records);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/ecme/:code  (includes interventions)
exports.findOne = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase().replace(/\s+/g, '');
    const record = await EcmeEtat.findByPk(code, {
      include: [{ model: EcmeIntervention, as: 'interventions', order: [['date', 'ASC']] }],
    });
    if (!record) return res.status(404).json({ error: 'ECME non trouvé' });
    return res.json(record);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/ecme/meta/affectations  — distinct affectation values for filter
exports.getAffectations = async (req, res) => {
  try {
    const rows = await EcmeEtat.findAll({
      attributes: ['affectation'],
      group: ['affectation'],
      order: [['affectation', 'ASC']],
    });
    return res.json(rows.map(r => r.affectation).filter(Boolean));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
