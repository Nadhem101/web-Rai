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

  // ── Static fields ───────────────────────────────────────────────────────────
  const designation       = stripLabel(cell(5, 0));           // "Désignation :TEXT"
  const code              = stripLabel(cell(6, 0)).replace(/\s+/g, ''); // "Code: ECME316"
  const marque            = cell(7, 1);
  const modele            = cell(7, 3);
  const n_serie           = cell(7, 5);

  // Propriété: RAI or Client
  const proprieteRow10    = cell(9, 0);  // "Propriété" — label
  const propriete         = cell(10, 0) === 'R.A.I.' ? 'R.A.I.' : (cell(11, 1) === 'X' ? 'Client' : '');

  // Dates
  const dateAchat         = stripLabel(cell(9, 2), ':');
  const dateMiseEnService = stripLabel(cell(10, 2), ':');

  // Verification type
  const verif_interne     = cell(10, 4) === 'Interne' ? true : false;
  const verif_ip          = cell(10, 6).toLowerCase().includes('ip');
  const verif_exempte     = cell(11, 6).toLowerCase().includes('exempt');
  let   verif_type        = '';
  if (verif_exempte)      verif_type = 'Exempté';
  else if (verif_ip)      verif_type = 'IP';
  else if (verif_interne) verif_type = 'Interne';
  else                    verif_type = 'Externe';

  // Zone — row 13 col 1 (the long-space cell sometimes; trim carefully)
  const zone              = cell(13, 1).replace(/\s+/g, ' ').trim();

  // Calibration dates row (row 14, columns 1+)
  const calibDates        = rowValues(rows[14] || [], 1)
    .map(v => fmtDate(v))
    .filter(Boolean);

  // ── Intervention history (row 22 onward) ────────────────────────────────────
  // Row 21 is headers: Date[0], Nature[1], Résultat[4], Visa[7]
  const interventions = [];
  for (let r = 22; r < rows.length; r++) {
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
