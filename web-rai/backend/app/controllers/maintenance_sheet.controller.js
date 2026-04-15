const MaintenanceSheet = require('../models/maintenance_sheet.model');

const buildOrder = () => [
  ['started_at', 'DESC'],
  ['id', 'DESC'],
];

const parsePayload = (body = {}) => ({
  machine_key: body.machine_key,
  machine_label: body.machine_label,
  reference: body.reference || null,
  template: body.template || {},
  tasks: Array.isArray(body.tasks) ? body.tasks : [],
  spare_parts: Array.isArray(body.spare_parts) ? body.spare_parts : [],
  observations: body.observations || null,
  operator_matricule: body.operator_matricule || null,
  operator_signature: body.operator_signature || null,
  started_at: body.started_at || undefined,
  finished_at: body.finished_at || null,
  status: body.status || 'in_progress',
});

exports.findAll = async (req, res) => {
  try {
    const where = {};

    if (req.query.machine_key) {
      where.machine_key = req.query.machine_key;
    }

    if (req.query.status) {
      where.status = req.query.status;
    }

    const sheets = await MaintenanceSheet.findAll({
      where,
      order: buildOrder(),
    });

    res.json(sheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const sheet = await MaintenanceSheet.findByPk(req.params.id);

    if (!sheet) {
      return res.status(404).json({ message: 'Fiche introuvable' });
    }

    res.json(sheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findLatestByMachine = async (req, res) => {
  try {
    const { machineKey } = req.params;

    const activeSheet = await MaintenanceSheet.findOne({
      where: {
        machine_key: machineKey,
        status: 'in_progress',
      },
      order: buildOrder(),
    });

    if (activeSheet) {
      return res.json(activeSheet);
    }

    const latestSheet = await MaintenanceSheet.findOne({
      where: { machine_key: machineKey },
      order: buildOrder(),
    });

    if (!latestSheet) {
      return res.status(404).json({ message: 'Aucune fiche trouvée pour cette machine' });
    }

    res.json(latestSheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = parsePayload(req.body);

    if (!payload.machine_key || !payload.machine_label) {
      return res.status(400).json({ message: 'machine_key et machine_label sont obligatoires' });
    }

    const sheet = await MaintenanceSheet.create(payload);
    res.status(201).json(sheet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const sheet = await MaintenanceSheet.findByPk(req.params.id);

    if (!sheet) {
      return res.status(404).json({ message: 'Fiche introuvable' });
    }

    const payload = parsePayload({ ...sheet.toJSON(), ...req.body });
    await sheet.update(payload);

    res.json(sheet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.finish = async (req, res) => {
  try {
    const sheet = await MaintenanceSheet.findByPk(req.params.id);

    if (!sheet) {
      return res.status(404).json({ message: 'Fiche introuvable' });
    }

    const payload = parsePayload({
      ...sheet.toJSON(),
      ...req.body,
      status: 'completed',
      finished_at: req.body.finished_at || new Date(),
    });

    await sheet.update(payload);

    res.json(sheet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};