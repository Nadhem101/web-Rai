const { Gamme, ProcessusFab, EtapeFab, GammeOutillage, Outillage, OutillageReference, OutillagePhoto } = require('../models');

const outillageInclude = {
  model: Outillage,
  as: 'outillage',
  include: [
    { model: OutillageReference, as: 'references', order: [['ordre', 'ASC']] },
    { model: OutillagePhoto,     as: 'photos',     order: [['ordre', 'ASC']] },
  ],
};

const processusInclude = {
  model: ProcessusFab,
  as: 'processus',
  include: [
    { model: EtapeFab, as: 'etapes', include: [{ model: GammeOutillage, as: 'gammeOutillages', include: [outillageInclude] }] },
  ],
};

const order = [
  [{ model: ProcessusFab, as: 'processus' }, 'ordre', 'ASC'],
  [{ model: ProcessusFab, as: 'processus' }, { model: EtapeFab, as: 'etapes' }, 'ordre', 'ASC'],
  [{ model: ProcessusFab, as: 'processus' }, { model: EtapeFab, as: 'etapes' }, { model: GammeOutillage, as: 'gammeOutillages' }, 'ordre', 'ASC'],
];

exports.getAll = async (req, res) => {
  try {
    const list = await Gamme.findAll({ include: [processusInclude], order });
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const g = await Gamme.findByPk(req.params.id, { include: [processusInclude], order });
    if (!g) return res.status(404).json({ error: 'Non trouvé' });
    res.json(g);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { nom } = req.body;
    const max = (await Gamme.max('ordre')) || 0;
    const g = await Gamme.create({ nom, ordre: max + 1 });
    res.status(201).json(g);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const g = await Gamme.findByPk(req.params.id);
    if (!g) return res.status(404).json({ error: 'Non trouvé' });
    await g.update(req.body);
    res.json(g);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const g = await Gamme.findByPk(req.params.id, {
      include: [{ model: ProcessusFab, as: 'processus', include: [{ model: EtapeFab, as: 'etapes' }] }],
    });
    if (!g) return res.status(404).json({ error: 'Non trouvé' });
    for (const proc of (g.processus || [])) {
      for (const etape of (proc.etapes || [])) {
        await GammeOutillage.destroy({ where: { etape_id: etape.id } });
        await etape.destroy();
      }
      await proc.destroy();
    }
    await g.destroy();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
