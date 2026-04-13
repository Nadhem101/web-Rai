const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { sequelize, PincePreventiveRecord } = require('../app/models');

const csvPath = path.join('C:', 'Users', 'user', 'Desktop', "Suivi mesures de force d'extraction des pinces (2) (1).csv");

const CSV_HEADERS = [
  'date_controle',
  'numero_pince',
  'reference_more',
  'position',
  'cosse',
  'fil',
  'traction_minimale_n',
  'test_value_1',
  'test_value_2',
  'test_value_3',
  'test_value_4',
  'test_value_5',
  'date_prochaine',
  'reserved',
  'remarque',
];

const EMPTY_FIELDS = new Set(['', null, undefined]);

function normalizeCell(value) {
  if (EMPTY_FIELDS.has(value)) return '';
  return String(value).replace(/\r/g, '').trim();
}

function parseDateOnly(value) {
  const normalized = normalizeCell(value);
  if (!normalized) return null;

  const parts = normalized.split('/');
  if (parts.length !== 3) return null;

  const month = String(parts[0]).padStart(2, '0');
  const day = String(parts[1]).padStart(2, '0');
  const year = String(parts[2]).padStart(4, '0');

  if (!month || !day || !year) return null;
  return `${year}-${month}-${day}`;
}

function parseMeasurement(value) {
  const normalized = normalizeCell(value);
  if (!normalized) return null;

  const cleaned = normalized.replace(',', '.').replace(/[^0-9.+-]/g, '');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function keyForRow(row) {
  return [
    row.date_controle,
    row.numero_pince,
    row.reference_more,
    row.position,
    row.cosse,
    row.fil,
    row.traction_minimale_n,
    row.test_value_1,
    row.test_value_2,
    row.test_value_3,
    row.test_value_4,
    row.test_value_5,
    row.date_prochaine,
    row.remarque,
  ].join('|');
}

async function importPincePreventive() {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Fichier introuvable: ${csvPath}`);
  }

  await sequelize.sync();

  const rows = [];
  const seen = new Set();
  let previousRow = null;

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(
        csv({
          skipLines: 2,
          headers: CSV_HEADERS,
          mapValues: ({ value }) => normalizeCell(value),
        })
      )
      .on('data', (rawRow) => {
        const hasContent = Object.values(rawRow).some((value) => normalizeCell(value));
        if (!hasContent) return;

        const merged = {};
        CSV_HEADERS.forEach((header) => {
          const currentValue = normalizeCell(rawRow[header]);
          const previousValue = previousRow ? previousRow[header] : '';
          merged[header] = currentValue || previousValue || '';
        });

        previousRow = merged;

        const normalizedRow = {
          date_controle: parseDateOnly(merged.date_controle),
          numero_pince: merged.numero_pince || null,
          reference_more: merged.reference_more || null,
          position: merged.position || null,
          cosse: merged.cosse || null,
          fil: merged.fil || null,
          traction_minimale_n: merged.traction_minimale_n || null,
          test_value_1: parseMeasurement(merged.test_value_1),
          test_value_2: parseMeasurement(merged.test_value_2),
          test_value_3: parseMeasurement(merged.test_value_3),
          test_value_4: parseMeasurement(merged.test_value_4),
          test_value_5: parseMeasurement(merged.test_value_5),
          date_prochaine: parseDateOnly(merged.date_prochaine),
          remarque: merged.remarque || null,
        };

        const dedupeKey = keyForRow(normalizedRow);
        if (seen.has(dedupeKey)) return;

        seen.add(dedupeKey);
        rows.push(normalizedRow);
      })
      .on('error', reject)
      .on('end', resolve);
  });

  await PincePreventiveRecord.destroy({ where: {} });

  if (rows.length > 0) {
    await PincePreventiveRecord.bulkCreate(rows);
  }

  console.log(`Import terminé: ${rows.length} enregistrement(s) de maintenance preventive importé(s).`);
  await sequelize.close();
}

importPincePreventive().catch((error) => {
  console.error('Import error:', error.message);
  process.exit(1);
});