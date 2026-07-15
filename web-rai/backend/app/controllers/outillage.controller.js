const { Outillage, OutillageReference, OutillagePhoto, GammeOutillage } = require('../models');

const withAssocs = {
  include: [
    { model: OutillageReference, as: 'references', order: [['ordre', 'ASC']] },
    { model: OutillagePhoto,     as: 'photos',     order: [['ordre', 'ASC']] },
  ],
};

exports.getAll = async (req, res) => {
  try {
    const list = await Outillage.findAll({ ...withAssocs, order: [['designation', 'ASC']] });
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const o = await Outillage.findByPk(req.params.id, withAssocs);
    if (!o) return res.status(404).json({ error: 'Non trouvé' });
    res.json(o);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { designation, quantity = 1, references = [], photos = [] } = req.body;
    const o = await Outillage.create({ designation, quantity });
    if (references.length)
      await OutillageReference.bulkCreate(
        references.map((r, i) => ({ outillage_id: o.id, reference: r.reference, label: r.label || null, ordre: i }))
      );
    if (photos.length)
      await OutillagePhoto.bulkCreate(
        photos.map((p, i) => ({ outillage_id: o.id, photo_data: p.photo_data, ordre: i }))
      );
    res.status(201).json(await Outillage.findByPk(o.id, withAssocs));
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const o = await Outillage.findByPk(req.params.id);
    if (!o) return res.status(404).json({ error: 'Non trouvé' });
    const { designation, quantity, references, photos } = req.body;
    if (designation !== undefined || quantity !== undefined)
      await o.update({ designation, quantity });
    if (references !== undefined) {
      await OutillageReference.destroy({ where: { outillage_id: o.id } });
      if (references.length)
        await OutillageReference.bulkCreate(
          references.map((r, i) => ({ outillage_id: o.id, reference: r.reference, label: r.label || null, ordre: i }))
        );
    }
    if (photos !== undefined) {
      await OutillagePhoto.destroy({ where: { outillage_id: o.id } });
      if (photos.length)
        await OutillagePhoto.bulkCreate(
          photos.map((p, i) => ({ outillage_id: o.id, photo_data: p.photo_data, ordre: i }))
        );
    }
    res.json(await Outillage.findByPk(o.id, withAssocs));
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const o = await Outillage.findByPk(req.params.id);
    if (!o) return res.status(404).json({ error: 'Non trouvé' });
    await OutillageReference.destroy({ where: { outillage_id: o.id } });
    await OutillagePhoto.destroy({ where: { outillage_id: o.id } });
    await GammeOutillage.destroy({ where: { outillage_id: o.id } });
    await o.destroy();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
