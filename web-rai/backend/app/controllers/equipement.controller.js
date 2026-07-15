const { Equipement, Zone, Fabricant, MachineTemplate } = require('../models');

const EQUIP_INCLUDES = [Zone, Fabricant, { model: MachineTemplate, as: 'MachineTemplate', attributes: ['id', 'machineKey', 'machineLabel'] }];

exports.findAll = async (req, res) => {
  try {
    const equipements = await Equipement.findAll({ include: EQUIP_INCLUDES });
    res.json(equipements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const equipement = await Equipement.findByPk(req.params.id, {
      include: EQUIP_INCLUDES,
    });
    if (equipement) {
      res.json(equipement);
    } else {
      res.status(404).json({ message: 'Équipement non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const equipement = await Equipement.create(req.body);
    res.status(201).json(equipement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Equipement.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedEquipement = await Equipement.findByPk(req.params.id);
      res.json(updatedEquipement);
    } else {
      res.status(404).json({ message: 'Équipement non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Equipement.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.json({ message: 'Équipement supprimé' });
    } else {
      res.status(404).json({ message: 'Équipement non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
