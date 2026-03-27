const { Pince, PinceVariant, PinceMaintenanceRecord, Fabricant } = require('../models');

exports.findAll = async (req, res) => {
  try {
    const pinces = await Pince.findAll({
      include: [
        Fabricant,
        {
          model: PinceVariant,
          as: 'variants',
          include: [
            {
              model: PinceMaintenanceRecord,
              as: 'maintenanceRecords',
            },
          ],
        },
      ],
      order: [['numero_pince', 'ASC']],
    });
    res.json(pinces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const pince = await Pince.findByPk(req.params.id, {
      include: [
        Fabricant,
        {
          model: PinceVariant,
          as: 'variants',
          include: [
            {
              model: PinceMaintenanceRecord,
              as: 'maintenanceRecords',
              order: [['date_verification', 'DESC']],
            },
          ],
        },
      ],
    });
    if (pince) {
      res.json(pince);
    } else {
      res.status(404).json({ message: 'Pince non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const pince = await Pince.create(req.body);
    res.status(201).json(pince);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Pince.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedPince = await Pince.findByPk(req.params.id);
      res.json(updatedPince);
    } else {
      res.status(404).json({ message: 'Pince non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Pince.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.json({ message: 'Pince supprimée' });
    } else {
      res.status(404).json({ message: 'Pince non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
