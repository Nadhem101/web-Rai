const { Op } = require('sequelize');
const { CurativeMaintenanceRecord, Equipement, Zone } = require('../models');

const normalizeText = (value = '') => String(value ?? '').replace(/\uFEFF/g, '').trim();

const parseDateOnly = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  const parts = normalized.split(/[/-]/).map((part) => part.trim());
  if (parts.length !== 3) return null;

  const [first, second, third] = parts;
  if (first.length === 4) {
    return `${first}-${String(second).padStart(2, '0')}-${String(third).padStart(2, '0')}`;
  }

  return `${third}-${String(second).padStart(2, '0')}-${String(first).padStart(2, '0')}`;
};

const parseTimeToMinutes = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) return null;

  const match = normalized.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || 0);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return null;
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    return null;
  }

  return (hours * 60) + minutes + (seconds / 60);
};

const computeDurationMinutes = (startValue, endValue) => {
  const start = parseTimeToMinutes(startValue);
  const end = parseTimeToMinutes(endValue);

  if (start === null || end === null) {
    return null;
  }

  let duration = end - start;
  if (duration < 0) {
    duration += 24 * 60;
  }

  return Number(duration.toFixed(2));
};

const getIsoWeekNumber = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
};

const getCalendarYear = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  return date.getFullYear();
};

const buildCalendarMonthDefinitions = () => ([
  { month: 1, label: 'Janvier' },
  { month: 2, label: 'Février' },
  { month: 3, label: 'Mars' },
  { month: 4, label: 'Avril' },
  { month: 5, label: 'Mai' },
  { month: 6, label: 'Juin' },
  { month: 7, label: 'Juillet' },
  { month: 8, label: 'Août' },
  { month: 9, label: 'Septembre' },
  { month: 10, label: 'Octobre' },
  { month: 11, label: 'Novembre' },
  { month: 12, label: 'Décembre' },
]);

const MTTR_SEUIL = 15;

const buildCalendarSummary = (records, selectedYear) => {
  const monthDefinitions = buildCalendarMonthDefinitions();
  const buckets = monthDefinitions.map((definition) => ({
    ...definition,
    count: 0,
    totalMinutes: 0,
    averageMinutes: null,
    totalBonFonctionnement: 0,
    mtbf: null,
  }));

  records.forEach((record) => {
    if (!record.incident_date) return;

    const date = new Date(record.incident_date);
    if (Number.isNaN(date.getTime())) return;

    const recordYear = getCalendarYear(record.incident_date);
    if (recordYear !== selectedYear) return;

    const monthNumber = date.getMonth() + 1;
    const bucket = buckets.find((entry) => entry.month === monthNumber);
    if (!bucket) return;

    const downtime = Number(record.downtime_minutes);
    if (!Number.isFinite(downtime)) return;

    bucket.count += 1;
    bucket.totalMinutes += downtime;

    const bonFonct = Number(record.bon_fonctionnement_minutes);
    if (Number.isFinite(bonFonct)) {
      bucket.totalBonFonctionnement += bonFonct;
    }
  });

  buckets.forEach((bucket) => {
    if (bucket.count > 0) {
      bucket.averageMinutes = Number((bucket.totalMinutes / bucket.count).toFixed(2));
      if (bucket.totalBonFonctionnement > 0) {
        bucket.mtbf = Number((bucket.totalBonFonctionnement / bucket.count).toFixed(2));
      }
    }
  });

  const totalCount = buckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const totalMinutes = buckets.reduce((sum, bucket) => sum + bucket.totalMinutes, 0);
  const totalBonFonctionnement = buckets.reduce((sum, bucket) => sum + bucket.totalBonFonctionnement, 0);

  return {
    selectedYear,
    yearLabel: String(selectedYear),
    months: buckets,
    totalCount,
    totalMinutes: Number(totalMinutes.toFixed(2)),
    averageMinutes: totalCount > 0 ? Number((totalMinutes / totalCount).toFixed(2)) : null,
    mtbf: totalCount > 0 && totalBonFonctionnement > 0 ? Number((totalBonFonctionnement / totalCount).toFixed(2)) : null,
    mttrSeuil: MTTR_SEUIL,
  };
};

const buildAvailableYears = (records) => {
  const currentYear = new Date().getFullYear();
  const recordYears = [...new Set(records
    .map((record) => getCalendarYear(record.incident_date))
    .filter((value) => Number.isFinite(value)))].sort((left, right) => left - right);

  const minimumYear = recordYears.length > 0 ? recordYears[0] : currentYear;
  const maximumYear = Math.max(recordYears.length > 0 ? recordYears[recordYears.length - 1] : currentYear, currentYear + 1);

  const availableYears = [];
  for (let year = minimumYear; year <= maximumYear; year += 1) {
    availableYears.push(year);
  }

  return { availableYears, recordYears, currentYear };
};

const resolveEquipmentSnapshot = async (body = {}, existingRecord = null) => {
  const equipmentId = body.equipement_id ? Number(body.equipement_id) : existingRecord?.equipement_id || null;
  let equipment = null;

  if (equipmentId) {
    equipment = await Equipement.findByPk(equipmentId, { include: [Zone] });
    if (!equipment) {
      throw new Error('Équipement introuvable.');
    }
  } else {
    const suppliedCode = normalizeText(body.equipement_code || existingRecord?.equipement_code);
    if (suppliedCode) {
      const normalizedCode = suppliedCode.replace(/\s+/g, '').toUpperCase();
      equipment = await Equipement.findOne({ where: { code_rai: normalizedCode }, include: [Zone] });
    }
  }

  const equipmentCode = normalizeText(body.equipement_code)
    || equipment?.code_rai
    || existingRecord?.equipement_code
    || null;

  const equipmentLabel = normalizeText(body.equipement_label)
    || equipment?.designation
    || existingRecord?.equipement_label
    || null;

  const zoneProduction = normalizeText(body.zone_production)
    || equipment?.Zone?.nom_zone
    || existingRecord?.zone_production
    || null;

  return {
    equipement_id: equipment?.id || equipmentId || null,
    equipement_code: equipmentCode,
    equipement_label: equipmentLabel,
    zone_production: zoneProduction,
  };
};

const parsePayload = async (body = {}, existingRecord = null) => {
  const incidentDate = parseDateOnly(body.incident_date || existingRecord?.incident_date);
  const requestedWeek = normalizeText(body.week_label || existingRecord?.week_label);
  const weekLabel = requestedWeek || (incidentDate ? `KW ${String(getIsoWeekNumber(incidentDate)).padStart(2, '0')}` : null);

  const requestTime = normalizeText(body.request_time || existingRecord?.request_time);
  const startedTime = normalizeText(body.started_time || existingRecord?.started_time);
  const finishedTime = normalizeText(body.finished_time || existingRecord?.finished_time);

  const responseMinutesInput = body.response_minutes ?? existingRecord?.response_minutes;
  const downtimeMinutesInput = body.downtime_minutes ?? existingRecord?.downtime_minutes;

  const responseMinutes = responseMinutesInput === null || responseMinutesInput === undefined || responseMinutesInput === ''
    ? (requestTime && startedTime ? computeDurationMinutes(requestTime, startedTime) : null)
    : Number(responseMinutesInput);

  const downtimeMinutes = downtimeMinutesInput === null || downtimeMinutesInput === undefined || downtimeMinutesInput === ''
    ? (startedTime && finishedTime ? computeDurationMinutes(startedTime, finishedTime) : null)
    : Number(downtimeMinutesInput);

  const bonFonctionnementInput = body.bon_fonctionnement_minutes ?? existingRecord?.bon_fonctionnement_minutes;
  const bonFonctionnementMinutes = bonFonctionnementInput === null || bonFonctionnementInput === undefined || bonFonctionnementInput === ''
    ? null
    : Number(bonFonctionnementInput);

  return {
    incident_date: incidentDate,
    week_label: weekLabel,
    intervenant: normalizeText(body.intervenant || existingRecord?.intervenant) || null,
    request_time: requestTime || null,
    started_time: startedTime || null,
    finished_time: finishedTime || null,
    description_panne: normalizeText(body.description_panne || existingRecord?.description_panne) || null,
    response_minutes: Number.isFinite(responseMinutes) ? Number(responseMinutes.toFixed(2)) : null,
    downtime_minutes: Number.isFinite(downtimeMinutes) ? Number(downtimeMinutes.toFixed(2)) : null,
    bon_fonctionnement_minutes: Number.isFinite(bonFonctionnementMinutes) ? Number(bonFonctionnementMinutes.toFixed(2)) : null,
    ...(await resolveEquipmentSnapshot(body, existingRecord)),
  };
};

const buildOrder = () => [
  ['incident_date', 'DESC'],
  ['id', 'DESC'],
];

exports.findAll = async (req, res) => {
  try {
    const where = {};

    if (req.query.equipement_id) {
      where.equipement_id = Number(req.query.equipement_id);
    }

    if (req.query.year) {
      const year = Number(req.query.year);
      if (Number.isFinite(year)) {
        where.incident_date = {
          [Op.between]: [`${year}-01-01`, `${year}-12-31`],
        };
      }
    }

    const records = await CurativeMaintenanceRecord.findAll({
      where,
      include: [
        {
          model: Equipement,
          include: [Zone],
        },
      ],
      order: buildOrder(),
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const record = await CurativeMaintenanceRecord.findByPk(req.params.id, {
      include: [
        {
          model: Equipement,
          include: [Zone],
        },
      ],
    });

    if (!record) {
      return res.status(404).json({ message: 'Enregistrement curatif introuvable' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = await parsePayload(req.body);

    if (!payload.incident_date) {
      return res.status(400).json({ message: 'La date de l\'incident est obligatoire.' });
    }

    const record = await CurativeMaintenanceRecord.create(payload);
    const created = await CurativeMaintenanceRecord.findByPk(record.id, {
      include: [
        {
          model: Equipement,
          include: [Zone],
        },
      ],
    });

    res.status(201).json(created || record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const record = await CurativeMaintenanceRecord.findByPk(req.params.id, {
      include: [
        {
          model: Equipement,
          include: [Zone],
        },
      ],
    });

    if (!record) {
      return res.status(404).json({ message: 'Enregistrement curatif introuvable' });
    }

    const payload = await parsePayload({ ...record.toJSON(), ...req.body }, record);
    await record.update(payload);

    const updated = await CurativeMaintenanceRecord.findByPk(req.params.id, {
      include: [
        {
          model: Equipement,
          include: [Zone],
        },
      ],
    });

    res.json(updated || record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await CurativeMaintenanceRecord.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Enregistrement curatif introuvable' });
    }

    res.json({ message: 'Enregistrement curatif supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.monthlySummary = async (req, res) => {
  try {
    const records = await CurativeMaintenanceRecord.findAll({
      attributes: ['incident_date', 'downtime_minutes', 'bon_fonctionnement_minutes'],
      order: buildOrder(),
    });

    const { availableYears, recordYears, currentYear } = buildAvailableYears(records);
    const requestedYear = Number(req.query.year ?? req.query.fiscalYear);
    const selectedYear = Number.isFinite(requestedYear)
      ? requestedYear
      : (recordYears.length > 0 ? recordYears[recordYears.length - 1] : currentYear);

    const summary = buildCalendarSummary(records, selectedYear);

    res.json({
      ...summary,
      availableYears,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};