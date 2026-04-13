const fs = require('fs');
const path = require('path');
const { sequelize, Cosse } = require('../app/models');

const csvCandidates = [
  process.env.COSS_FILE_PATH,
  path.join(__dirname, '..', '..', 'database', 'Liste Outillage Faisceaux 05-03-2026.csv'),
  path.join('C:', 'Users', 'user', 'Desktop', 'Liste Outillage Faisceaux 05-03-2026.csv'),
].filter(Boolean);

const csvPath = csvCandidates.find((candidatePath) => fs.existsSync(candidatePath));

if (!csvPath) {
  console.error('CSV des cosses introuvable. Définissez COSS_FILE_PATH ou placez le fichier dans database/.');
  process.exit(1);
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === ',' && !insideQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function normalizeCell(value) {
  const trimmedValue = (value || '').trim();
  return trimmedValue === '' ? null : trimmedValue;
}

async function importCosses() {
  try {
    await sequelize.sync();
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split(/\r?\n/);
    const headerIndex = lines.findIndex((line) => line.trim().startsWith('Constructeur,TEC'));

    if (headerIndex === -1) {
      throw new Error('En-tête CSV introuvable');
    }

    const dataLines = lines.slice(headerIndex + 1).filter((line) => line.trim());
    const rows = [];
    const dedupe = new Set();

    for (const line of dataLines) {
      const fields = parseCsvLine(line);
      const row = {
        reference_constructeur: normalizeCell(fields[0]),
        reference_tec: normalizeCell(fields[1]),
        designation_tec: normalizeCell(fields[2]),
        outillage: normalizeCell(fields[3]),
        section_awg: normalizeCell(fields[4]),
        section_mm2: normalizeCell(fields[5]),
        tenue_traction_n: normalizeCell(fields[6]),
        longueur_denudage_mm: normalizeCell(fields[7]),
        observation: normalizeCell(fields[8]),
      };

      if (!row.reference_constructeur && !row.reference_tec && !row.designation_tec) {
        continue;
      }

      const dedupeKey = JSON.stringify(row);
      if (dedupe.has(dedupeKey)) {
        continue;
      }

      dedupe.add(dedupeKey);
      rows.push(row);
    }

    await Cosse.destroy({ where: {} });
    await Cosse.bulkCreate(rows);

    console.log(`✅ Import cosses terminé: ${rows.length} lignes insérées depuis ${path.basename(csvPath)}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur import cosses:', error.message);
    process.exit(1);
  }
}

importCosses();