const { ApplicateurThreshold } = require('../models');

exports.findAll = async (req, res) => {
  try {
    const rows = await ApplicateurThreshold.findAll({
      order: [['id', 'ASC']],
    });

    const records = rows.map((row) => row.get({ plain: true }));
    const uniqueTools = new Set(records.map((record) => record.numero_outil).filter(Boolean));
    const uniqueGroups = new Set(records.map((record) => record.group_key).filter(Boolean));

    res.json({
      source: 'applicateur_thresholds',
      total_rows: records.length,
      total_tools: uniqueTools.size,
      total_groups: uniqueGroups.size,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};