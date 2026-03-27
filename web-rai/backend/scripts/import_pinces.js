const fs = require('fs');
const readline = require('readline');
const { sequelize, Pince, PinceVariant, PinceMaintenanceRecord, Fabricant } = require('../app/models');

const PINCES_FILE = 'C:\\Users\\user\\Desktop\\Suivi des equipments FQ0300.csv';

// Parse CSV line  
const parseCSVLine = (line) => {
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
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

const parseTestValue = (val) => {
  if (!val || val === '') return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
};

const cleanString = (str) => {
  if (!str) return '';
  return str.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
};

const parseDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const [, month, day, year] = match;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return null;
};

async function importPinces() {
  try {
    console.log('🔄 Démarrage de l\'import des pinces...\n');

    const pincesData = {};
    const fileStream = fs.createReadStream(PINCES_FILE, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineCount = 0;
    let dataStarted = false;

    for await (const line of rl) {
      lineCount++;

      // Skip header lines (first 4 lines)
      if (lineCount <= 4) {
        if (lineCount === 4) console.log(`Skipped header rows, starting data parsing...\n`);
        continue;
      }

      const columns = parseCSVLine(line);
      if (columns.length < 5) continue;

      const col0 = cleanString(columns[0]);
      
      // Skip lines that don't contain pince data
      if (!col0) continue;

      // Start when we see P01, P02, P3, etc.
      if (!dataStarted && col0.match(/^P\d{1,3}$/i)) {
        dataStarted = true;
        console.log(`✓ Started parsing data at line ${lineCount}\n`);
      }

      if (!dataStarted) continue;

      // Check if this line starts with a pince number
      const pinceMatch = col0.match(/^P\d{1,3}([+]P\d{1,3})?$/i);
      if (!pinceMatch) continue;

      const pinceKey = col0.toUpperCase();
      const fabricant = cleanString(columns[1]) || 'Inconnu';

      // Initialize pince  
      if (!pincesData[pinceKey]) {
        pincesData[pinceKey] = {
          numeroPince: pinceKey,
          fabricant,
          reference: cleanString(columns[2]) || '',
          variants: [],
        };
        console.log(`  ✓ ${pinceKey} - ${fabricant}`);
      }

      // Only process if there's variant data (col3 has reference)
      if (!cleanString(columns[3])) continue;

      // Extract variant
      const variant = {
        referenceConstructeur: cleanString(columns[3]) || null,
        referenceTec: cleanString(columns[4]) || null,
        sectionMm: parseFloat(cleanString(columns[5])) || null,
        sectionAwg: cleanString(columns[6]) || null,
        longueurDenudage: cleanString(columns[7]) || null,
        valeurTraction: cleanString(columns[8]) || null,
        testValues: [
          parseTestValue(cleanString(columns[9])),
          parseTestValue(cleanString(columns[10])),
          parseTestValue(cleanString(columns[11])),
          parseTestValue(cleanString(columns[12])),
          parseTestValue(cleanString(columns[13])),
        ],
        dateVerification: parseDate(cleanString(columns[14])),
        affectation: cleanString(columns[15]) || null,
        statut: cleanString(columns[16]) || 'À vérifier',
        remarque: cleanString(columns[17]) || null,
      };

      if (variant.sectionMm) {
        pincesData[pinceKey].variants.push(variant);
      }
    }

    console.log(`\n✅ CSV parsé: ${Object.keys(pincesData).length} pinces trouvées\n`);

    // Import to database
    let createdCount = 0;
    let variantCount = 0;
    let recordCount = 0;

    for (const [pinceNum, pinceData] of Object.entries(pincesData)) {
      try {
        let fabricant = await Fabricant.findOne({
          where: { nom: pinceData.fabricant },
        });

        if (!fabricant) {
          fabricant = await Fabricant.create({
            nom: pinceData.fabricant,
          });
        }

        let pince = await Pince.findOne({
          where: { numero_pince: pinceNum },
        });

        if (!pince) {
          pince = await Pince.create({
            numero_pince: pinceNum,
            reference_pince: pinceData.reference,
            fabricant_id: fabricant.id,
          });
          createdCount++;
          console.log(`  ✓ ${pinceNum} (${pinceData.variants.length} variantes)`);
        }

        // Create variants and maintenance records
        for (const variantData of pinceData.variants) {
          if (!variantData.referenceTec || !variantData.sectionMm) continue;

          let variant = await PinceVariant.findOne({
            where: {
              pince_id: pince.id,
              reference_tec: variantData.referenceTec,
              section_mm: variantData.sectionMm,
            },
          });

          if (!variant) {
            variant = await PinceVariant.create({
              pince_id: pince.id,
              reference_constructeur: variantData.referenceConstructeur,
              reference_tec: variantData.referenceTec,
              section_mm: variantData.sectionMm,
              section_awg: variantData.sectionAwg,
              longueur_denudage: variantData.longueurDenudage,
              valeur_traction: variantData.valeurTraction,
              affectation: variantData.affectation,
              remarque: variantData.remarque,
            });
            variantCount++;
          }

          // Create maintenance record
          if (variantData.dateVerification && variantData.testValues.some(v => v !== null)) {
            const existing = await PinceMaintenanceRecord.findOne({
              where: {
                pince_variant_id: variant.id,
                date_verification: variantData.dateVerification,
              },
            });

            if (!existing) {
              await PinceMaintenanceRecord.create({
                pince_variant_id: variant.id,
                date_verification: variantData.dateVerification,
                test_value_1: variantData.testValues[0],
                test_value_2: variantData.testValues[1],
                test_value_3: variantData.testValues[2],
                test_value_4: variantData.testValues[3],
                test_value_5: variantData.testValues[4],
                statut_verification: 'À reprendre',
              });
              recordCount++;
            }
          }
        }
      } catch (error) {
        console.error(`⚠ Erreur ${pinceNum}:`, error.message);
      }
    }

    console.log(`\n✅ Import terminé!`);
    console.log(`  ${createdCount} pinces créées`);
    console.log(`  ${variantCount} variantes créées`);
    console.log(`  ${recordCount} records de maintenance créés\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

sequelize
  .sync()
  .then(() => importPinces())
  .catch((error) => {
    console.error('❌ Erreur BD:', error);
    process.exit(1);
  });
