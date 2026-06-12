/**
 * fix_ecme_designations.js
 * One-time repair script: updates corrupted ECME designations in the DB
 * using the correctly-parsed designations from database/output/ecme_summary.json.
 *
 * The corruption happened because the CSV was read as UTF-8 instead of Latin-1,
 * mangling French accented characters (é → ?, è → ?, à → ?, etc.).
 *
 * The ecme_summary.json was generated from the original XLS file via the xlsx
 * library (which handles encoding internally), so those designations are correct.
 *
 * Usage (from the web-rai root):
 *   node backend/scripts/fix_ecme_designations.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const path = require('path');
const fs   = require('fs');
const { EcmeEtat, sequelize } = require('../app/models');

const SUMMARY_FILE = path.join(__dirname, '../../database/output/ecme_summary.json');

async function main() {
  if (!fs.existsSync(SUMMARY_FILE)) {
    console.error('❌ ecme_summary.json not found. Run parse_ecme.js first.');
    process.exit(1);
  }

  const summary = JSON.parse(fs.readFileSync(SUMMARY_FILE, 'utf8'));
  console.log(`📋 Loaded ${summary.length} entries from ecme_summary.json\n`);

  await sequelize.sync();

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const entry of summary) {
    const { code, designation, marque } = entry;
    if (!code) { skipped++; continue; }

    const record = await EcmeEtat.findByPk(code);
    if (!record) { notFound++; continue; }

    const updates = {};
    if (designation && record.designation !== designation) {
      updates.designation = designation;
    }
    // Also fix marque if it has accented chars that may be corrupted
    if (marque && record.marque !== marque) {
      updates.marque = marque;
    }

    if (Object.keys(updates).length === 0) { skipped++; continue; }

    await EcmeEtat.update(updates, { where: { code } });
    const changes = Object.entries(updates).map(([k, v]) => `${k}: "${v}"`).join(', ');
    console.log(`  ✓ ${code}: ${changes}`);
    updated++;
  }

  console.log(`\n✅ Done — ${updated} fixed, ${skipped} already correct, ${notFound} not in DB.`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});
