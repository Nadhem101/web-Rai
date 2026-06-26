/**
 * seed_ecme.js
 * Imports ECME state list (CSV) + intervention history (JSON) into PostgreSQL.
 *
 * Usage: node backend/scripts/seed_ecme.js
 *
 * Expects:
 *   - CSV at:  database/Etat des ECME-Validé.csv  (or Desktop fallback)
 *   - JSON at: database/output/interventions.json
 *   - JSON at: database/output/ecme_summary.json
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const path  = require('path');
const fs    = require('fs');
const { EcmeEtat, EcmeIntervention, sequelize } = require('../app/models');

// ── CSV path (try project folder first, then Desktop) ────────────────────────
const CSV_CANDIDATES = [
  path.join(__dirname, '../../database/Etat des ECME-Validé.csv'),
  path.join('C:/Users', process.env.USERNAME || 'user', 'Desktop/Etat des ECME-Validé.csv'),
];
const CSV_FILE = CSV_CANDIDATES.find(fs.existsSync);

const INTERVENTIONS_FILE = path.join(__dirname, '../../database/output/interventions.json');
const SUMMARY_FILE       = path.join(__dirname, '../../database/output/ecme_summary.json');

// ── Simple CSV parser (handles quoted fields) ─────────────────────────────────
function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseDate(raw) {
  if (!raw || raw.trim() === '' || raw.trim() === ' ') return null;
  raw = raw.trim();
  // M/D/YYYY
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [, mo, da, yr] = m;
    return `${yr}-${mo.padStart(2, '0')}-${da.padStart(2, '0')}`;
  }
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  return null;
}

function mapAlerte(val, necessite) {
  const v = (val || '').toUpperCase().trim();
  if (v === 'VALABLE')       return 'VALABLE';
  if (v === 'VERIFICATION')  return 'VERIFICATION';
  if (v.includes('DECLASSE') || v.includes('DECLASSER')) return 'DECLASSE';
  if (!necessite)            return 'EXEMPTE';
  return 'INCONNU';
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!CSV_FILE) {
    console.error('❌ CSV file not found. Please place "Etat des ECME-Validé.csv" in database/ folder.');
    process.exit(1);
  }

  console.log(`📂 CSV:           ${CSV_FILE}`);
  console.log(`📂 Interventions: ${INTERVENTIONS_FILE}`);
  console.log(`📂 Summary:       ${SUMMARY_FILE}\n`);

  await sequelize.sync();

  // ── Load verif_type from ecme_summary ────────────────────────────────────
  const verifMap = {};
  if (fs.existsSync(SUMMARY_FILE)) {
    const summary = JSON.parse(fs.readFileSync(SUMMARY_FILE, 'utf8'));
    summary.forEach(e => { verifMap[e.code] = e.verif_type || ''; });
  }

  // ── Parse CSV ─────────────────────────────────────────────────────────────
  // Use 'latin1' (ISO-8859-1) because French Excel CSV exports use this encoding.
  // Reading as 'utf8' corrupts characters like é, è, à, ç → garbled bytes.
  const lines = fs.readFileSync(CSV_FILE, 'latin1').split('\n');

  // Find data rows: rows where col 3 starts with "ECME"
  const dataRows = lines
    .map(l => parseCSVLine(l))
    .filter(row => row[3] && row[3].trim().toUpperCase().startsWith('ECME'));

  console.log(`📋 Found ${dataRows.length} ECME rows in CSV`);

  // Upsert EcmeEtat records
  let created = 0, updated = 0;
  for (const row of dataRows) {
    const code         = row[3].trim().replace(/\s+/g, ''); // "ECME 127" → "ECME127"
    const designation  = row[0].trim();
    const marque       = row[1].trim();
    const n_serie      = row[2].trim();
    const affectation  = row[4].trim();
    const necessite    = row[6].trim().toLowerCase() === 'oui';
    const dateDernier  = parseDate(row[7]);
    const alerteRaw    = row[8].trim();
    const dateProchaineRaw = parseDate(row[10]) || parseDate(row[9]);
    const dateAlerte   = parseDate(row[9]);
    const remarques    = row[11]?.trim() || '';

    // Special case: "Declasse" appears in remarques even when alerte is empty
    const remarquesLower = remarques.toLowerCase();
    let alerte = mapAlerte(alerteRaw, necessite);
    if (alerte === 'INCONNU' && (remarquesLower.includes('déclasser') || remarquesLower.includes('declasse'))) {
      alerte = 'DECLASSE';
    }

    const verifType = verifMap[code] || (necessite ? (alerte === 'EXEMPTE' ? 'Exempté' : '') : 'Exempté');

    const [, wasCreated] = await EcmeEtat.upsert({
      code,
      designation,
      marque,
      n_serie,
      affectation,
      necessite_verification: necessite,
      date_derniere_verification: dateDernier,
      alerte,
      date_prochaine_verification: dateProchaineRaw,
      date_alerte: dateAlerte,
      remarques,
      verif_type: verifType,
    });

    wasCreated ? created++ : updated++;
  }

  console.log(`✓ EcmeEtat: ${created} created, ${updated} updated`);

  // ── Load interventions ────────────────────────────────────────────────────
  if (fs.existsSync(INTERVENTIONS_FILE)) {
    const interventions = JSON.parse(fs.readFileSync(INTERVENTIONS_FILE, 'utf8'));

    // Get all valid codes that exist in ecme_etat
    const existing = await EcmeEtat.findAll({ attributes: ['code'] });
    const validCodes = new Set(existing.map(e => e.code));

    // Delete all existing interventions and re-insert (simpler than upsert)
    await EcmeIntervention.destroy({ where: {} });

    const toInsert = interventions
      .filter(i => (i.date || i.nature) && validCodes.has(i.ecme_code)) // only valid FK codes
      .map(i => ({
        ecme_code: i.ecme_code,
        date:      i.date    || '',
        nature:    i.nature  || '',
        resultat:  i.resultat || '',
        visa:      i.visa    || '',
      }));

    await EcmeIntervention.bulkCreate(toInsert, { validate: false });
    console.log(`✓ Interventions: ${toInsert.length} inserted`);
  } else {
    console.warn('⚠  interventions.json not found — run parse_ecme.js first');
  }

  console.log('\n✅ Seeding complete.');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
