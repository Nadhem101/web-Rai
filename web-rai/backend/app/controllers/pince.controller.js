const { Pince, PinceVariant, PinceMaintenanceRecord, Fabricant, Cosse } = require('../models');

const normalizeText = (value = '') => String(value ?? '').replace(/\uFEFF/g, '').trim();

const resolveFabricantId = async ({ fabricant_id: fabricantId, fabricant_nom: fabricantNom }) => {
  if (fabricantId) {
    const existingFabricant = await Fabricant.findByPk(fabricantId);
    if (!existingFabricant) {
      throw new Error('Fabricant introuvable.');
    }

    return existingFabricant.id;
  }

  const cleanedNom = normalizeText(fabricantNom);
  if (!cleanedNom) {
    return null;
  }

  const [fabricant] = await Fabricant.findOrCreate({
    where: { nom: cleanedNom },
    defaults: { nom: cleanedNom },
  });

  return fabricant.id;
};

const buildPrimaryVariantPayload = (cosse) => ({
  reference_constructeur: cosse.reference_constructeur || null,
  reference_tec: cosse.reference_tec || null,
  remarque: cosse.designation_tec || cosse.observation || null,
});

const upsertPrimaryVariant = async (pinceId, variantPayload) => {
  const existingVariant = await PinceVariant.findOne({
    where: { pince_id: pinceId },
    order: [['id', 'ASC']],
  });

  if (existingVariant) {
    await existingVariant.update(variantPayload);
    return existingVariant;
  }

  return PinceVariant.create({ pince_id: pinceId, ...variantPayload });
};

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
    const { cosse_id: cosseId, fabricant_id: fabricantId, fabricant_nom: fabricantNom, ...payload } = req.body;

    if (!cosseId) {
      return res.status(400).json({ message: 'Une cosse existante doit être sélectionnée pour créer une pince.' });
    }

    const cosse = await Cosse.findByPk(cosseId);
    if (!cosse) {
      return res.status(400).json({ message: 'Cosse introuvable.' });
    }

    const resolvedFabricantId = await resolveFabricantId({ fabricant_id: fabricantId, fabricant_nom: fabricantNom });
    const pince = await Pince.create({
      ...payload,
      fabricant_id: resolvedFabricantId,
    });
    await upsertPrimaryVariant(pince.id, buildPrimaryVariantPayload(cosse));
    res.status(201).json(pince);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { cosse_id: cosseId, fabricant_id: fabricantId, fabricant_nom: fabricantNom, ...payload } = req.body;

    const resolvedFabricantId = await resolveFabricantId({ fabricant_id: fabricantId, fabricant_nom: fabricantNom });
    const updatePayload = {
      ...payload,
      fabricant_id: resolvedFabricantId,
    };

    const [updated] = await Pince.update(updatePayload, {
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
