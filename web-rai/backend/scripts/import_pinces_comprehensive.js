const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { sequelize, Pince, PinceVariant, PinceMaintenanceRecord, Fabricant } = require('../app/models');

const csvPath = path.join('C:', 'Users', 'user', 'Desktop', 'Suivi des equipments pince.csv');

async function importPinces() {
  try {
    await sequelize.sync();
    console.log('Database synced');

    const data = [];
    let rowCount = 0;

    // Read CSV with proper parser that skips first 4 rows
    fs.createReadStream(csvPath)
      .pipe(csv({ headers: generateHeaders() }))
      .on('data', (row) => {
        rowCount++;
        if (rowCount > 4) { // Skip header rows
          data.push(row);
        }
      })
      .on('end', async () => {
        console.log(`Read ${data.length} pince records`);
        await processPinces(data);
      });
  } catch (error) {
    console.error('Import error:', error);
    process.exit(1);
  }
}

function generateHeaders() {
  const headers = [
    'numero_pince', 'fabricant', 'ref_catalogue', 'ref_constructeur', 'ref_tec',
    'section_mm', 'section_awg', 'longueur_denudage', 'valeur_traction',
    'test_1', 'test_2', 'test_3', 'test_4', 'test_5',
    'date_verification', 'affectation', 'statut', 'remarque'
  ];
  return headers;
}

async function processPinces(data) {
  try {
    // Delete existing data
    await PinceMaintenanceRecord.destroy({ where: {} });
    await PinceVariant.destroy({ where: {} });
    await Pince.destroy({ where: {} });
    console.log('Cleared existing pince data');

    const pinceMap = new Map(); // Map to group variants by pince

    // First pass: group data by pince
    for (const row of data) {
      const pinceNum = row.numero_pince?.trim();
      if (!pinceNum) continue;

      if (!pinceMap.has(pinceNum)) {
        pinceMap.set(pinceNum, {
          numero: pinceNum,
          fabricant: row.fabricant?.trim(),
          variants: [],
          statut: row.statut?.trim() || 'En service',
          dateVerif: parseDate(row.date_verification),
          remarque: row.remarque?.trim() || '',
        });
      }

      // Add variant if we have necessary data
      const sectionMm = parseFloat(row.section_mm);
      const refTec = row.ref_tec?.trim();
      
      if (!isNaN(sectionMm) && refTec) {
        const variant = {
          refTec: refTec,
          refConstructeur: row.ref_constructeur?.trim(),
          section_mm: sectionMm,
          section_awg: row.section_awg?.trim(),
          longueur_denudage: row.longueur_denudage?.trim(),
          valeur_traction: row.valeur_traction?.trim() || '',
          test1: row.test_1 ? parseInt(row.test_1) : null,
          test2: row.test_2 ? parseInt(row.test_2) : null,
          test3: row.test_3 ? parseInt(row.test_3) : null,
          test4: row.test_4 ? parseInt(row.test_4) : null,
          test5: row.test_5 ? parseInt(row.test_5) : null,
          dateVerif: parseDate(row.date_verification),
          remarque: row.remarque?.trim() || '',
        };
        
        pinceMap.get(pinceNum).variants.push(variant);
      }
    }

    console.log(`\nProcessed ${pinceMap.size} pinces with variants`);

    // Second pass: insert into database
    let pinceCount = 0;
    let variantCount = 0;
    let maintenanceCount = 0;

    for (const [pinceNum, pinceData] of pinceMap) {
      try {
        // Create or find fabricant
        let fabricant = await Fabricant.findOne({ where: { nom: pinceData.fabricant } });
        if (!fabricant) {
          fabricant = await Fabricant.create({ nom: pinceData.fabricant });
        }

        // Create pince
        const pince = await Pince.create({
          numero_pince: pinceData.numero,
          fabricant_id: fabricant.id,
          statut: pinceData.statut,
          date_verification: pinceData.dateVerif,
          remarque: pinceData.remarque,
        });

        pinceCount++;

        // Create variants
        for (const variant of pinceData.variants) {
          try {
            const pinceVariant = await PinceVariant.create({
              pince_id: pince.id,
              reference_tec: variant.refTec,
              reference_constructeur: variant.refConstructeur,
              section_mm: variant.section_mm,
              section_awg: variant.section_awg,
              longueur_denudage: variant.longueur_denudage,
              valeur_traction: variant.valeur_traction,
            });

            variantCount++;

            // Create maintenance record if we have test data
            if (variant.test1 || variant.test2 || variant.test3 || variant.test4 || variant.test5) {
              const testValues = [variant.test1, variant.test2, variant.test3, variant.test4, variant.test5]
                .filter(v => v !== null && v !== undefined);
              
              const moyenne = testValues.length > 0 
                ? Math.round(testValues.reduce((a, b) => a + b, 0) / testValues.length)
                : null;

              // Determine conformity
              let conformity = 'À vérifier';
              if (testValues.length > 0) {
                const minValue = parseInt(variant.valeur_traction.replace('≥ ', '').trim()) || 0;
                const allPass = testValues.every(v => v >= minValue * 0.95);
                const allFail = testValues.every(v => v < minValue * 0.8);
                
                if (allPass) {
                  conformity = 'Conforme';
                } else if (allFail) {
                  conformity = 'Non-conforme';
                } else {
                  conformity = 'À reprendre';
                }
              }

              await PinceMaintenanceRecord.create({
                pince_variant_id: pinceVariant.id,
                test_value_1: variant.test1,
                test_value_2: variant.test2,
                test_value_3: variant.test3,
                test_value_4: variant.test4,
                test_value_5: variant.test5,
                date_verification: variant.dateVerif,
                statut_verification: conformity,
                remarque: variant.remarque,
              });

              maintenanceCount++;
            }
          } catch (variantError) {
            console.error(`Error creating variant for pince ${pinceNum}:`, variantError.message);
          }
        }
      } catch (pinceError) {
        console.error(`Error creating pince ${pinceNum}:`, pinceError.message);
      }
    }

    console.log(`\n✅ Import complete:`);
    console.log(`   Pinces: ${pinceCount}`);
    console.log(`   Variants: ${variantCount}`);
    console.log(`   Maintenance records: ${maintenanceCount}`);

    await sequelize.close();
  } catch (error) {
    console.error('Processing error:', error);
    process.exit(1);
  }
}

function parseDate(dateStr) {
  if (!dateStr || dateStr === '') return null;
  
  try {
    // Handle MM/DD/YYYY format
    const parts = dateStr.trim().split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0]) - 1;
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return null;
  } catch {
    return null;
  }
}

importPinces();
