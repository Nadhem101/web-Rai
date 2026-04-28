const { Cosse, Pince, Applicateur } = require('../models');

const normalizeToolCode = (value = '') =>
  String(value ?? '')
    .replace(/\uFEFF/g, '')
    .trim()
    .replace(/\s+/g, '')
    .toUpperCase();

const cleanText = (value = '') => String(value ?? '').replace(/\uFEFF/g, '').trim();

const buildAllowedToolLookup = async () => {
  const [pinces, applicateurs] = await Promise.all([
    Pince.findAll({ attributes: ['numero_pince'] }),
    Applicateur.findAll({ attributes: ['numero_outil'] }),
  ]);

  const lookup = new Map();

  const registerTool = (value) => {
    const canonicalValue = cleanText(value);
    const normalizedValue = normalizeToolCode(canonicalValue);

    if (!normalizedValue || lookup.has(normalizedValue)) return;
    lookup.set(normalizedValue, canonicalValue);
  };

  pinces.forEach((pince) => registerTool(pince.numero_pince));
  applicateurs.forEach((applicateur) => registerTool(applicateur.numero_outil));

  return lookup;
};

const sanitizePayload = async (body) => {
  const payload = {};

  const assignIfPresent = (key) => {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      payload[key] = cleanText(body[key]);
    }
  };

  [
    'reference_constructeur',
    'reference_tec',
    'designation_tec',
    'section_awg',
    'section_mm2',
    'tenue_traction_n',
    'longueur_denudage_mm',
    'observation',
  ].forEach(assignIfPresent);

  if (!Object.prototype.hasOwnProperty.call(body, 'outillage')) {
    return payload;
  }

  payload.outillage = cleanText(body.outillage);

  if (!payload.outillage) {
    return payload;
  }

  const lookup = await buildAllowedToolLookup();
  const canonicalOutillage = lookup.get(normalizeToolCode(payload.outillage));

  if (!canonicalOutillage) {
    throw new Error('Outillage doit correspondre à une pince ou un applicateur existant.');
  }

  payload.outillage = canonicalOutillage;
  return payload;
};

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
    const payload = await sanitizePayload(req.body);
    const cosse = await Cosse.create(payload);
    res.status(201).json(cosse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const payload = await sanitizePayload(req.body);
    const [updated] = await Cosse.update(payload, {
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