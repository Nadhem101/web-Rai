const MaintenanceEvent = require('../models/maintenance_event.model');
const { Op } = require('sequelize');

// GET /api/maintenance-events?year=2026
exports.findAll = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const events = await MaintenanceEvent.findAll({ where: { year } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/maintenance-events  – upsert
exports.upsert = async (req, res) => {
  try {
    const { equip_code, interval_type, week, year, status, new_week } = req.body;
    if (!equip_code || !interval_type || !week || !year || !status) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }
    const [event, created] = await MaintenanceEvent.findOrCreate({
      where: { equip_code, interval_type, week, year },
      defaults: { status, new_week: new_week || null },
    });
    if (!created) {
      await event.update({ status, new_week: new_week || null });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/maintenance-events  – reset (by composite key in body)
exports.remove = async (req, res) => {
  try {
    const { equip_code, interval_type, week, year } = req.body;
    const deleted = await MaintenanceEvent.destroy({
      where: { equip_code, interval_type, week, year },
    });
    if (deleted) {
      res.json({ message: 'Événement supprimé' });
    } else {
      res.status(404).json({ message: 'Événement non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
