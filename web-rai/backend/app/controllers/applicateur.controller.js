const { Applicateur, ApplicateurVariant, Cosse } = require('../models');

const buildPrimaryVariantPayload = (cosse) => ({
  reference_constructeur: cosse.reference_constructeur || null,
  reference_tec: cosse.reference_tec || null,
  remarque: cosse.designation_tec || cosse.observation || null,
});

const upsertPrimaryVariant = async (applicateurId, variantPayload) => {
  const existingVariant = await ApplicateurVariant.findOne({
    where: { applicateur_id: applicateurId },
    order: [['id', 'ASC']],
  });

  if (existingVariant) {
    await existingVariant.update(variantPayload);
    return existingVariant;
  }

  return ApplicateurVariant.create({ applicateur_id: applicateurId, ...variantPayload });
};

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
    const { cosse_id: cosseId, ...payload } = req.body;

    if (!cosseId) {
      return res.status(400).json({ message: 'Une cosse existante doit être sélectionnée pour créer un applicateur.' });
    }

    const cosse = await Cosse.findByPk(cosseId);
    if (!cosse) {
      return res.status(400).json({ message: 'Cosse introuvable.' });
    }

    const applicateur = await Applicateur.create(payload);
    await upsertPrimaryVariant(applicateur.id, buildPrimaryVariantPayload(cosse));
    res.status(201).json(applicateur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { cosse_id: cosseId, ...payload } = req.body;

    const [updated] = await Applicateur.update(payload, {
      where: { id: req.params.id },
    });

    if (cosseId) {
      const cosse = await Cosse.findByPk(cosseId);
      if (!cosse) {
        return res.status(400).json({ message: 'Cosse introuvable.' });
      }

      await upsertPrimaryVariant(req.params.id, buildPrimaryVariantPayload(cosse));
    }

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
