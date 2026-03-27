const path = require('path');
const fs = require('fs');

// Get the correct path to the database
const { sequelize, Applicateur, ApplicateurVariant } = require('../app/models');

// Try multiple locations for the CSV file
const possiblePaths = [
  path.join(__dirname, '../database/Suivi des equipments FQ030.csv'),
  path.join('C:', 'Users', 'user', 'Desktop', 'Suivi des equipments FQ030.csv'),
];

let CSV_FILE = null;
for (const filePath of possiblePaths) {
  if (fs.existsSync(filePath)) {
    CSV_FILE = filePath;
    break;
  }
}

if (!CSV_FILE) {
  console.error('❌ CSV file not found in any expected location');
  process.exit(1);
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

async function importApplicateurs() {
  try {
    console.log('Reading CSV file...');
    const content = fs.readFileSync(CSV_FILE, 'utf-8');
    const lines = content.split('\n');

    // Skip header lines (first 3 lines)
    const dataLines = lines.slice(3);

    const applicateursMap = new Map(); // Store applicateurs data temporarily
    let currentApplicateur = null;

    // Parse CSV
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();

      if (!line) continue; // Skip empty lines

      const fields = parseCSVLine(line);

      // Fields: N° Outil | Site | Désignation | N° Serie | Constructeur | Ref Cosse Constructor | Ref Cosse TEC | Statut | Remarque
      const numeroOutil = fields[0];
      const site = fields[1];
      const designation = fields[2];
      const numeroSerie = fields[3];
      const constructeurOutil = fields[4];
      const refCosseConstructeur = fields[5];
      const refCosseTec = fields[6];
      const statut = fields[7] ? fields[7].toLowerCase() : 'en service';
      const remarque = fields[8];

      if (numeroOutil) {
        // New applicateur
        currentApplicateur = {
          numero_outil: numeroOutil,
          site: site || 'RAI',
          designation: designation,
          numero_serie: numeroSerie,
          constructeur_outil: constructeurOutil,
          statut: statut,
          remarque: remarque,
          variants: [],
        };

        // Add first connector reference if exists
        if (refCosseConstructeur || refCosseTec) {
          currentApplicateur.variants.push({
            reference_cosse_constructeur: refCosseConstructeur,
            reference_cosse_tec: refCosseTec,
          });
        }

        applicateursMap.set(numeroOutil, currentApplicateur);
      } else if (currentApplicateur && (refCosseConstructeur || refCosseTec)) {
        // Additional connector reference for current applicateur
        currentApplicateur.variants.push({
          reference_cosse_constructeur: refCosseConstructeur,
          reference_cosse_tec: refCosseTec,
        });
      }
    }

    console.log(`Parsed ${applicateursMap.size} applicateurs`);

    // Sync database
    console.log('Syncing database...');
    await sequelize.sync();

    // Clear existing data (ApplicateurVariant first due to FK constraint)
    await ApplicateurVariant.destroy({ where: {} });
    await Applicateur.destroy({ where: {} });

    // Import applicateurs and variants
    let totalVariants = 0;
    let successCount = 0;

    for (const [numeroOutil, applicateur] of applicateursMap) {
      try {
        const createdApplicateur = await Applicateur.create({
          numero_outil: applicateur.numero_outil,
          site: applicateur.site,
          designation: applicateur.designation,
          numero_serie: applicateur.numero_serie,
          constructeur_outil: applicateur.constructeur_outil,
          statut: applicateur.statut,
          remarque: applicateur.remarque,
        });

        // Add variants
        for (const variant of applicateur.variants) {
          await ApplicateurVariant.create({
            applicateur_id: createdApplicateur.id,
            reference_constructeur: variant.reference_cosse_constructeur,
            reference_tec: variant.reference_cosse_tec,
          });
          totalVariants++;
        }

        successCount++;
      } catch (error) {
        console.error(`Error importing applicateur ${numeroOutil}:`, error.message);
      }
    }

    console.log(`\n✅ Import complete: Applicateurs: ${successCount}, Connector references: ${totalVariants}`);
    process.exit(0);
  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

importApplicateurs();
