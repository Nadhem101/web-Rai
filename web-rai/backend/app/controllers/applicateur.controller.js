const { Applicateur, ApplicateurVariant } = require('../models');

exports.findAll = async (req, res) => {
  try {
    const applicateurs = await Applicateur.findAll({
      include: [
        {
          model: ApplicateurVariant,
          as: 'variants',
        },
      ],
      order: [['numero_outil', 'ASC']],
    });
    res.json(applicateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const applicateur = await Applicateur.findByPk(req.params.id, {
      include: [
        {
          model: ApplicateurVariant,
          as: 'variants',
        },
      ],
    });
    if (applicateur) {
      res.json(applicateur);
    } else {
      res.status(404).json({ message: 'Applicateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const applicateur = await Applicateur.create(req.body);
    res.status(201).json(applicateur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Applicateur.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedApplicateur = await Applicateur.findByPk(req.params.id);
      res.json(updatedApplicateur);
    } else {
      res.status(404).json({ message: 'Applicateur non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Applicateur.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.json({ message: 'Applicateur supprimé' });
    } else {
      res.status(404).json({ message: 'Applicateur non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
