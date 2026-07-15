const { FerBainRecord, Equipement, Zone } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const records = await FerBainRecord.findAll({
      include: [{ model: Equipement, include: [Zone], attributes: ['id', 'code_rai', 'designation', 'categorie', 'fer_bain_seuil'] }],
      order: [['date_controle', 'DESC']],
    });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getByEquipement = async (req, res) => {
  try {
    const records = await FerBainRecord.findAll({
      where: { equipement_id: req.params.equipementId },
      order: [['date_controle', 'DESC']],
    });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const record = await FerBainRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await FerBainRecord.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Enregistrement non trouvé' });
    res.json(await FerBainRecord.findByPk(req.params.id));
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await FerBainRecord.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Enregistrement non trouvé' });
    res.json({ message: 'Enregistrement supprimé' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
