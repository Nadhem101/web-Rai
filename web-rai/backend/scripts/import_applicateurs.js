const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

// Get the correct path to the database
const { sequelize, Applicateur, ApplicateurVariant } = require('../app/models');

// Try multiple locations for the CSV file
const possiblePaths = [
  path.join(__dirname, '../../database/Suivi des equipments FQ030.csv'),
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

const CSV_HEADERS = [
  'numero_outil',
  'site',
  'designation',
  'numero_serie',
  'constructeur_outil',
  'reference_cosse_constructeur',
  'reference_cosse_tec',
  'statut',
  'remarque',
];

const normalizeCell = (value) => String(value ?? '').replace(/\r/g, '').replace(/\uFEFF/g, '').trim();

const readRows = () =>
  new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(CSV_FILE)
      .pipe(
        csv({
          skipLines: 4,
          headers: CSV_HEADERS,
          mapValues: ({ value }) => normalizeCell(value),
        })
      )
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });

async function importApplicateurs() {
  try {
    const applicateursMap = new Map(); // Store applicateurs data temporarily
    let currentApplicateur = null;

    console.log('Reading CSV file...');
    const dataLines = await readRows();

    // Parse CSV
    for (let i = 0; i < dataLines.length; i++) {
      const row = dataLines[i];

      const numeroOutil = normalizeCell(row.numero_outil);
      const site = normalizeCell(row.site);
      const designation = normalizeCell(row.designation);
      const numeroSerie = normalizeCell(row.numero_serie);
      const constructeurOutil = normalizeCell(row.constructeur_outil);
      const refCosseConstructeur = normalizeCell(row.reference_cosse_constructeur);
      const refCosseTec = normalizeCell(row.reference_cosse_tec);
      const statut = normalizeCell(row.statut).toLowerCase() || 'en service';
      const remarque = normalizeCell(row.remarque);

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
