const { Op } = require('sequelize');
const sequelize = require('../db/config');
const PincePreventiveRecord = require('../models/pince_preventive_record.model');

// Only return active (non-archived) records
exports.findAll = async (req, res) => {
  try {
    const records = await PincePreventiveRecord.findAll({
      where: { is_historique: false },
      order: [
        ['date_controle', 'DESC'],
        ['numero_pince', 'ASC'],
        ['position', 'ASC'],
      ],
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// All historical records (for global history view)
exports.findHistorique = async (req, res) => {
  try {
    const records = await PincePreventiveRecord.findAll({
      where: { is_historique: true },
      order: [
        ['date_controle', 'DESC'],
        ['numero_pince', 'ASC'],
        ['position', 'ASC'],
      ],
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Normalizes "P2" / "P02" / "p2" / "2" to the same canonical form, so a
// formatting difference between the tool's own record and a maintenance
// row's numero_pince never hides a match.
const normalizePinceNumber = (value) => {
  if (!value) return value;
  const s = String(value).trim();
  return /^\d+$/.test(s) ? `P${s}` : s;
};
const normPince = (v) => String(v ?? '').trim().toUpperCase().replace(/^P0*/, 'P').replace(/^0*(\d)/, '$1');

// Full history for a single pince — both archived AND the current
// (not-yet-archived) cycle, so a just-completed maintenance never goes
// missing here. Used by both the inventory dropdown and the detail modal.
exports.findHistoriqueByPince = async (req, res) => {
  try {
    const target = normPince(normalizePinceNumber(req.params.numero_pince));
    const all = await PincePreventiveRecord.findAll({
      order: [['date_controle', 'DESC'], ['position', 'ASC']],
    });
    const records = all.filter((r) => normPince(normalizePinceNumber(r.numero_pince)) === target);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const record = await PincePreventiveRecord.findByPk(req.params.id);
    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ message: 'Enregistrement non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const record = await PincePreventiveRecord.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await PincePreventiveRecord.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const record = await PincePreventiveRecord.findByPk(req.params.id);
      res.json(record);
    } else {
      res.status(404).json({ message: 'Enregistrement non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await PincePreventiveRecord.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.json({ message: 'Enregistrement supprimé' });
    } else {
      res.status(404).json({ message: 'Enregistrement non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Archive current active records for a pince then create fresh records for new maintenance cycle
exports.startMaintenance = async (req, res) => {
  const { numero_pince, date_controle, date_prochaine, rows } = req.body;

  if (!numero_pince || !date_controle || !date_prochaine || !Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ message: 'numero_pince, date_controle, date_prochaine et rows sont requis' });
  }

  const t = await sequelize.transaction();
  try {
    // Archive all currently active records for this pince
    await PincePreventiveRecord.update(
      { is_historique: true },
      { where: { numero_pince, is_historique: false }, transaction: t }
    );

    // Create the new maintenance records
    const created = await PincePreventiveRecord.bulkCreate(
      rows.map((row) => ({
        numero_pince,
        date_controle,
        date_prochaine,
        reference_more: row.reference_more ?? null,
        cosse: row.cosse ?? null,
        position: row.position ?? null,
        fil: row.fil ?? null,
        traction_minimale_n: row.traction_minimale_n ?? null,
        test_value_1: row.test_value_1 ?? null,
        test_value_2: row.test_value_2 ?? null,
        test_value_3: row.test_value_3 ?? null,
        test_value_4: row.test_value_4 ?? null,
        test_value_5: row.test_value_5 ?? null,
        statut_verification: row.statut_verification ?? null,
        remarque: row.remarque ?? null,
        is_historique: false,
      })),
      { transaction: t }
    );

    await t.commit();
    res.status(201).json(created);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};
