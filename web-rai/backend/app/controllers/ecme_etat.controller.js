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

// POST /api/ecme — create a new ECME
exports.create = async (req, res) => {
  try {
    const code = (req.body.code || '').toUpperCase().replace(/\s+/g, '');
    if (!code) return res.status(400).json({ error: 'Le code est obligatoire' });

    const existing = await EcmeEtat.findByPk(code);
    if (existing) return res.status(409).json({ error: `Le code ${code} existe déjà` });

    const record = await EcmeEtat.create({ ...req.body, code });
    return res.status(201).json(record);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

// PUT /api/ecme/:code — update an existing ECME
exports.update = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase().replace(/\s+/g, '');
    const record = await EcmeEtat.findByPk(code);
    if (!record) return res.status(404).json({ error: 'ECME non trouvé' });

    // Never allow changing the primary key via update
    const { code: _ignore, ...fields } = req.body;
    await record.update(fields);
    return res.json(record);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

// DELETE /api/ecme/:code
exports.delete = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase().replace(/\s+/g, '');
    const deleted = await EcmeEtat.destroy({ where: { code } });
    if (!deleted) return res.status(404).json({ error: 'ECME non trouvé' });
    return res.json({ message: 'ECME supprimé' });
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
