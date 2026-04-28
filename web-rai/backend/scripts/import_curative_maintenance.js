const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { sequelize, CurativeMaintenanceRecord, Equipement, Zone } = require('../app/models');

const csvPath = path.join(__dirname, '..', '..', 'database', 'suivi ..csv');

const CSV_HEADERS = [
  'intervenant',
  'zone_production',
  'equipement',
  'semaine',
  'incident_date',
  'period_key',
  'request_time',
  'started_time',
  'finished_time',
  'description_panne',
  'reserved',
  'downtime_duration',
  'downtime_minutes',
  'extra_value',
];

const normalizeCell = (value) => String(value ?? '').replace(/\r/g, '').trim();

const parseDateOnly = (value) => {
  const normalized = normalizeCell(value);
  if (!normalized) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  const parts = normalized.split('/');
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  if (!day || !month || !year) return null;

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const parseTimeToMinutes = (value) => {
  const normalized = normalizeCell(value);
  if (!normalized) return null;

  const match = normalized.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || 0);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds)) {
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

const normalizeEquipmentCode = (value) => normalizeCell(value).replace(/\s+/g, '').toUpperCase();

const isBlankRow = (row) => {
  return !normalizeCell(row.incident_date)
    && !normalizeCell(row.equipement)
    && !normalizeCell(row.description_panne)
    && !normalizeCell(row.downtime_minutes)
    && !normalizeCell(row.downtime_duration);
};

const resolveEquipment = async (rawEquipmentCode) => {
  const normalizedCode = normalizeEquipmentCode(rawEquipmentCode);
  if (!normalizedCode) return null;

  let equipment = await Equipement.findOne({
    where: { code_rai: normalizedCode },
    include: [Zone],
  });

  if (!equipment) {
    const digits = normalizedCode.match(/\d+/)?.[0];
    if (digits) {
      equipment = await Equipement.findOne({
        where: { code_rai: `EQUIP${digits}` },
        include: [Zone],
      });
    }
  }

  return equipment;
};

async function importCurativeMaintenance() {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Fichier introuvable: ${csvPath}`);
  }

  await sequelize.sync();

  const rawRows = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(
        csv({
          skipLines: 2,
          headers: CSV_HEADERS,
          mapValues: ({ value }) => normalizeCell(value),
        })
      )
      .on('data', (row) => {
        if (!isBlankRow(row)) {
          rawRows.push(row);
        }
      })
      .on('error', reject)
      .on('end', resolve);
  });

  const records = [];
  const seen = new Set();

  for (const row of rawRows) {
    const incidentDate = parseDateOnly(row.incident_date);
    const equipment = await resolveEquipment(row.equipement);
    const requestTime = normalizeCell(row.request_time);
    const startedTime = normalizeCell(row.started_time);
    const finishedTime = normalizeCell(row.finished_time);
    const downtimeFromSheetRaw = normalizeCell(row.downtime_minutes);
    const downtimeFromSheet = downtimeFromSheetRaw ? Number(downtimeFromSheetRaw.replace(',', '.')) : null;
    const downtimeFromDuration = parseTimeToMinutes(row.downtime_duration);
    const downtimeMinutes = Number.isFinite(downtimeFromSheet) ? downtimeFromSheet : downtimeFromDuration;
    const responseMinutes = requestTime && startedTime ? computeDurationMinutes(requestTime, startedTime) : null;
    const weekLabel = normalizeCell(row.semaine)
      || (incidentDate ? `KW ${String(getIsoWeekNumber(incidentDate) || '').padStart(2, '0')}` : null);
    const equipmentCode = equipment?.code_rai || normalizeCell(row.equipement) || null;
    const equipmentLabel = normalizeCell(row.equipement) || equipment?.designation || 'Non renseigné';
    const zoneProduction = normalizeCell(row.zone_production) || equipment?.Zone?.nom_zone || null;

    if (!incidentDate) {
      continue;
    }

    const dedupeKey = [
      incidentDate,
      equipmentCode,
      requestTime,
      startedTime,
      finishedTime,
      normalizeCell(row.description_panne),
      downtimeMinutes,
    ].join('|');

    if (seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    records.push({
      incident_date: incidentDate,
      week_label: weekLabel,
      intervenant: normalizeCell(row.intervenant) || null,
      zone_production: zoneProduction,
      equipement_id: equipment?.id || null,
      equipement_code: equipmentCode,
      equipement_label: equipmentLabel,
      request_time: requestTime || null,
      started_time: startedTime || null,
      finished_time: finishedTime || null,
      description_panne: normalizeCell(row.description_panne) || null,
      response_minutes: Number.isFinite(responseMinutes) ? responseMinutes : null,
      downtime_minutes: Number.isFinite(downtimeMinutes) ? Number(downtimeMinutes.toFixed(2)) : null,
    });
  }

  await CurativeMaintenanceRecord.destroy({ where: {} });

  if (records.length > 0) {
    await CurativeMaintenanceRecord.bulkCreate(records);
  }

  console.log(`Import terminé: ${records.length} enregistrement(s) de maintenance curative importé(s).`);
  await sequelize.close();
}

importCurativeMaintenance().catch((error) => {
  console.error('Import error:', error.message);
  process.exit(1);
});