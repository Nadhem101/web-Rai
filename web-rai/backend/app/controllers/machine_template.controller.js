const { MachineTemplate } = require('../models');

exports.findAll = async (req, res) => {
  try {
    const rows = await MachineTemplate.findAll({ order: [['createdAt', 'ASC']] });
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.findOne = async (req, res) => {
  try {
    const t = await MachineTemplate.findByPk(req.params.id);
    if (!t) return res.status(404).json({ message: 'Template non trouvé' });
    res.json(t);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { machineKey, machineLabel, subtitle, sections } = req.body;
    if (!machineKey || !machineLabel) {
      return res.status(400).json({ message: 'machineKey et machineLabel sont obligatoires' });
    }
    const t = await MachineTemplate.create({
      machineKey:   String(machineKey).trim(),
      machineLabel: String(machineLabel).trim(),
      subtitle:     subtitle ? String(subtitle).trim() : null,
      sections:     Array.isArray(sections) ? sections : [],
    });
    res.status(201).json(t);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Une fiche machine avec cette clé existe déjà.' });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const t = await MachineTemplate.findByPk(req.params.id);
    if (!t) return res.status(404).json({ message: 'Template non trouvé' });
    const patch = {};
    if (req.body.machineLabel !== undefined) patch.machineLabel = String(req.body.machineLabel).trim();
    if (req.body.subtitle     !== undefined) patch.subtitle     = req.body.subtitle || null;
    if (req.body.sections     !== undefined) patch.sections     = Array.isArray(req.body.sections) ? req.body.sections : t.sections;
    await t.update(patch);
    res.json(t);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const t = await MachineTemplate.findByPk(req.params.id);
    if (!t) return res.status(404).json({ message: 'Template non trouvé' });
    await t.destroy();
    res.json({ message: 'Supprimé' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
