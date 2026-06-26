/**
 * parse_ecme.js
 * Parses all 316 ECME sheets and outputs:
 *   - database/output/ecme_summary.json   → one object per ECME
 *   - database/output/interventions.json  → all interventions across all ECMEs
 *
 * Usage: node database/scripts/parse_ecme.js
 */

const XLSX = require('xlsx');
const fs   = require('fs');
const path = require('path');

const EXCEL_FILE = path.join(__dirname, '..', 'Fiches de vie des ECME.xls');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const workbook = XLSX.readFile(EXCEL_FILE, { cellDates: true, defval: '' });

// ── helpers ──────────────────────────────────────────────────────────────────

/** Strip label prefix from a cell value like "Désignation :Banc de test KAS" */
function stripLabel(val = '', sep = ':') {
  const idx = val.indexOf(sep);
  return idx >= 0 ? val.slice(idx + 1).trim() : val.trim();
}

/** Format an Excel date value (could be JS Date or string already) */
function fmtDate(val) {
  if (!val) return '';
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  return String(val).trim();
}

/** Pull non-empty values from a row array, starting at column `start` */
function rowValues(row = [], start = 1) {
  return row.slice(start).map(v => String(v).trim()).filter(Boolean);
}

// ── parse each sheet ──────────────────────────────────────────────────────────

const ecmeList     = [];
const allInterventions = [];

workbook.SheetNames.forEach((sheetName) => {
  const ws   = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  // Helper: safe cell getter
  const cell = (r, c) => {
    const row = rows[r];
    if (!row) return '';
    const v = row[c];
    return v instanceof Date ? fmtDate(v) : String(v ?? '').trim();
  };

  // The "Code :" row anchors every other field, since sheets are not all laid
  // out at the same absolute row offset (some are shifted up by 1-5 rows).
  let codeRow = -1;
  for (let i = 0; i < Math.min(rows.length, 15); i++) {
    if (/code\s*:/i.test(cell(i, 0))) { codeRow = i; break; }
  }
  if (codeRow === -1) {
    console.warn(`⚠ ${sheetName}: could not locate the "Code :" row, skipping sheet`);
    return;
  }

  const designationRow    = codeRow - 1;
  const marqueRow         = codeRow + 1;
  const proprieteLabelRow = codeRow + 3;
  const raiRow            = codeRow + 4;
  const clientRow         = codeRow + 5;
  const zoneRow           = codeRow + 7;
  const calibRow          = codeRow + 8;
  const interventionsStart = codeRow + 16;

  // ── Static fields ───────────────────────────────────────────────────────────
  const designation       = stripLabel(cell(designationRow, 0));   // "Désignation :TEXT"
  const code              = stripLabel(cell(codeRow, 0)).replace(/\s+/g, ''); // "Code: ECME316"
  const marque            = stripLabel(cell(marqueRow, 0));
  const modele            = stripLabel(cell(marqueRow, 2));
  const n_serie           = stripLabel(cell(marqueRow, 4));

  // Propriété: RAI or Client
  const propriete         = cell(raiRow, 0) === 'R.A.I.' ? 'R.A.I.' : (cell(clientRow, 1) === 'X' ? 'Client' : '');

  // Dates
  const dateAchat         = stripLabel(cell(proprieteLabelRow, 2), ':');
  const dateMiseEnService = stripLabel(cell(raiRow, 2), ':');

  // Verification type
  const verif_interne     = cell(raiRow, 4) === 'Interne' ? true : false;
  const verif_ip          = cell(raiRow, 6).toLowerCase().includes('ip');
  const verif_exempte     = cell(clientRow, 6).toLowerCase().includes('exempt');
  let   verif_type        = '';
  if (verif_exempte)      verif_type = 'Exempté';
  else if (verif_ip)      verif_type = 'IP';
  else if (verif_interne) verif_type = 'Interne';
  else                    verif_type = 'Externe';

  // Zone — "Affectation" row, col 1 (the long-space cell sometimes; trim carefully)
  const zone              = cell(zoneRow, 1).replace(/\s+/g, ' ').trim();

  // Calibration dates row, columns 1+
  const calibDates        = rowValues(rows[calibRow] || [], 1)
    .map(v => fmtDate(v))
    .filter(Boolean);

  // ── Intervention history ────────────────────────────────────────────────────
  // The row right before interventionsStart is the header: Date[0], Nature[1], Résultat[4], Visa[7]
  const interventions = [];
  for (let r = interventionsStart; r < rows.length; r++) {
    const row = rows[r] || [];
    const date    = fmtDate(row[0]);
    const nature  = String(row[1] ?? '').trim();
    const resultat = String(row[4] ?? '').trim();
    const visa    = String(row[7] ?? '').trim();
    if (date || nature) {
      interventions.push({ ecme_code: code, date, nature, resultat, visa });
    }
  }

  const ecme = {
    code,
    designation,
    marque,
    modele,
    n_serie,
    propriete,
    date_achat:          dateAchat,
    date_mise_en_service: dateMiseEnService,
    verif_type,
    zone,
    calib_dates:         calibDates,
    interventions_count: interventions.length,
  };

  ecmeList.push(ecme);
  allInterventions.push(...interventions);
});

// ── Write outputs ─────────────────────────────────────────────────────────────

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'ecme_summary.json'),
  JSON.stringify(ecmeList, null, 2),
  'utf8'
);

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'interventions.json'),
  JSON.stringify(allInterventions, null, 2),
  'utf8'
);

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n✓ Parsed ${ecmeList.length} ECMEs`);
console.log(`✓ Total interventions: ${allInterventions.length}`);
console.log(`\nSample (first 3):\n`);
ecmeList.slice(0, 3).forEach(e => console.log(JSON.stringify(e, null, 2)));
console.log(`\nOutput files:`);
console.log(`  database/output/ecme_summary.json`);
console.log(`  database/output/interventions.json`);
