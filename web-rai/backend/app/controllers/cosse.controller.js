const { Cosse } = require('../models');

exports.findAll = async (req, res) => {
  try {
    const cosses = await Cosse.findAll({
      order: [
        ['reference_constructeur', 'ASC'],
        ['reference_tec', 'ASC'],
        ['section_mm2', 'ASC'],
        ['designation_tec', 'ASC'],
      ],
    });
    res.json(cosses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const cosse = await Cosse.findByPk(req.params.id);
    if (cosse) {
      res.json(cosse);
    } else {
      res.status(404).json({ message: 'Cosse non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const cosse = await Cosse.create(req.body);
    res.status(201).json(cosse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Cosse.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedCosse = await Cosse.findByPk(req.params.id);
      res.json(updatedCosse);
    } else {
      res.status(404).json({ message: 'Cosse non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Cosse.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.json({ message: 'Cosse supprimée' });
    } else {
      res.status(404).json({ message: 'Cosse non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};