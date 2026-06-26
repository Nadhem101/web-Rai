const sequelize = require('../db/config');
const ApplicateurPreventiveRecord = require('../models/applicateur_preventive_record.model');

// Active records for all applicateurs
exports.findAll = async (req, res) => {
  try {
    const records = await ApplicateurPreventiveRecord.findAll({
      where: { is_historique: false },
      order: [
        ['date_controle', 'DESC'],
        ['numero_outil', 'ASC'],
        ['section_mm2', 'ASC'],
      ],
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// All historical records
exports.findHistorique = async (req, res) => {
  try {
    const records = await ApplicateurPreventiveRecord.findAll({
      where: { is_historique: true },
      order: [
        ['date_controle', 'DESC'],
        ['numero_outil', 'ASC'],
        ['section_mm2', 'ASC'],
      ],
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Historical records for a single outil (used by inventory tab)
exports.findHistoriqueByOutil = async (req, res) => {
  try {
    const records = await ApplicateurPreventiveRecord.findAll({
      where: { numero_outil: req.params.numero_outil, is_historique: true },
      order: [['date_controle', 'DESC'], ['section_mm2', 'ASC']],
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const record = await ApplicateurPreventiveRecord.findByPk(req.params.id);
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
    const record = await ApplicateurPreventiveRecord.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await ApplicateurPreventiveRecord.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const record = await ApplicateurPreventiveRecord.findByPk(req.params.id);
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
    const deleted = await ApplicateurPreventiveRecord.destroy({
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

// Archive current active records for an outil then create fresh records for new maintenance cycle
exports.startMaintenance = async (req, res) => {
  const { numero_outil, date_controle, date_prochaine, rows } = req.body;

  if (!numero_outil || !date_controle || !date_prochaine || !Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ message: 'numero_outil, date_controle, date_prochaine et rows sont requis' });
  }

  const t = await sequelize.transaction();
  try {
    // Archive all currently active records for this outil
    await ApplicateurPreventiveRecord.update(
      { is_historique: true },
      { where: { numero_outil, is_historique: false }, transaction: t }
    );

    // Create new maintenance records
    const created = await ApplicateurPreventiveRecord.bulkCreate(
      rows.map((row) => ({
        numero_outil,
        date_controle,
        date_prochaine,
        section_mm2: row.section_mm2 ?? null,
        seuil_n: row.seuil_n ?? null,
        longueur_denudage: row.longueur_denudage ?? null,
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
