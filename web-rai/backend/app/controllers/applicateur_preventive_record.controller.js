const ApplicateurPreventiveRecord = require('../models/applicateur_preventive_record.model');

exports.findAll = async (req, res) => {
  try {
    const records = await ApplicateurPreventiveRecord.findAll({
      order: [
        ['date_controle', 'DESC'],
        ['numero_outil', 'ASC'],
      ],
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
