const fs = require('fs');
const path = require('path');
const { sequelize, Pince, PinceVariant, PinceMaintenanceRecord, Fabricant } = require('../app/models');

const csvPath = path.join('C:', 'Users', 'user', 'Desktop', 'Suivi des equipments pince.csv');

async function importPinces() {
  try {
    await sequelize.sync();
    console.log('Database synced');

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');

    // Skip first 4 header rows
    const dataLines = lines.slice(4).filter(line => line.trim());
    
    console.log(`Processing ${dataLines.length} data lines...`);

    let currentPince = null;
    let currentFabricant = null;
    let currentVariants = new Map(); // Map to store variants by key

    // Delete existing data
    await PinceMaintenanceRecord.destroy({ where: {} });
    await PinceVariant.destroy({ where: {} });
    await Pince.destroy({ where: {} });
    console.log('Cleared existing pince data');

    // Parse all data
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      const parts = parseCSVLine(line);

      const pinceNum = parts[0]?.trim();
      const fabricant = parts[1]?.trim();
      const refCat = parts[2]?.trim();
      const refConstr = parts[3]?.trim();
      const refTec = parts[4]?.trim();
      const sectionMm = parts[5]?.trim();
      const sectionAwg = parts[6]?.trim();
      const longueurDenudage = parts[7]?.trim();
      const valeurTraction = parts[8]?.trim();
      
      const test1 = parts[9]?.trim();
      const test2 = parts[10]?.trim();
      const test3 = parts[11]?.trim();
      const test4 = parts[12]?.trim();
      const test5 = parts[13]?.trim();
      
      const dateVerif = parts[14]?.trim();
      const affectation = parts[15]?.trim();
      const statut = parts[16]?.trim();
      const remarque = parts[17]?.trim();

      // New pince detected
      if (pinceNum && !pinceNum.includes('Pince sertissage') && isValidPinceNumber(pinceNum)) {
        currentPince = pinceNum;
        currentFabricant = fabricant;
        currentVariants.clear();
      }

      // Add variant if we have enough data
      if (currentPince && (sectionMm || refTec)) {
        const variantKey = `${refTec || ''}_${sectionMm || ''}`;
        
        if (!currentVariants.has(variantKey)) {
          currentVariants.set(variantKey, {
            refConstr: refConstr,
            refTec: refTec,
            sectionMm: parseFloat(sectionMm) || null,
            sectionAwg: sectionAwg,
            longueurDenudage: longueurDenudage,
            valeurTraction: valeurTraction,
            tests: [],
            dateVerif: dateVerif,
            statut: statut,
            remarque: remarque,
          });
        }

        // Add test values if present
        if (test1 || test2 || test3 || test4 || test5 || dateVerif) {
          currentVariants.get(variantKey).tests.push({
            test1: parseTestValue(test1),
            test2: parseTestValue(test2),
            test3: parseTestValue(test3),
            test4: parseTestValue(test4),
            test5: parseTestValue(test5),
            dateVerif: dateVerif,
            remarque: remarque,
          });
        }
      }
    }

    // Insert data into database
    let pinceCount = 0;
    let variantCount = 0;
    let maintenanceCount = 0;

    // Create a set of unique pinces from current data
    const pinceSet = new Set();
    for (let i = 0; i < dataLines.length; i++) {
      const parts = parseCSVLine(dataLines[i]);
      const pinceNum = parts[0]?.trim();
      if (pinceNum && isValidPinceNumber(pinceNum) && !pinceNum.includes('Pince sertissage')) {
        pinceSet.add(pinceNum);
      }
    }

    console.log(`Found ${pinceSet.size} unique pinces\n`);

    // Re-parse and create in DB
    currentPince = null;
    currentFabricant = null;
    currentVariants.clear();

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      const parts = parseCSVLine(line);

      const pinceNum = parts[0]?.trim();
      const fabricant = parts[1]?.trim();
      const refConstr = parts[3]?.trim();
      const refTec = parts[4]?.trim();
      const sectionMm = parts[5]?.trim();
      const sectionAwg = parts[6]?.trim();
      const longueurDenudage = parts[7]?.trim();
      const valeurTraction = parts[8]?.trim();
      
      const test1 = parts[9]?.trim();
      const test2 = parts[10]?.trim();
      const test3 = parts[11]?.trim();
      const test4 = parts[12]?.trim();
      const test5 = parts[13]?.trim();
      
      const dateVerif = parts[14]?.trim();
      const statut = parts[16]?.trim();
      const remarque = parts[17]?.trim();

      // New pince detected - save previous if exists
      if (pinceNum && isValidPinceNumber(pinceNum) && !pinceNum.includes('Pince sertissage')) {
        if (currentPince) {
          await savePince(currentPince, currentFabricant, currentVariants);
          pinceCount++;
          variantCount += currentVariants.size;
          
          // Count maintenance records
          for (const variant of currentVariants.values()) {
            maintenanceCount += variant.tests.length;
          }
        }

        currentPince = pinceNum;
        currentFabricant = fabricant;
        currentVariants.clear();
      }

      // Add variant data
      if (currentPince && (sectionMm || refTec)) {
        const variantKey = `${refTec || ''}_${sectionMm || ''}`;
        
        if (!currentVariants.has(variantKey)) {
          currentVariants.set(variantKey, {
            refConstr: refConstr,
            refTec: refTec,
            sectionMm: parseFloat(sectionMm) || null,
            sectionAwg: sectionAwg,
            longueurDenudage: longueurDenudage,
            valeurTraction: valeurTraction,
            tests: [],
            statut: statut,
            remarque: remarque,
          });
        }

        // Add test record if we have test data
        if (test1 || test2 || test3 || test4 || test5) {
          currentVariants.get(variantKey).tests.push({
            test1: parseTestValue(test1),
            test2: parseTestValue(test2),
            test3: parseTestValue(test3),
            test4: parseTestValue(test4),
            test5: parseTestValue(test5),
            dateVerif: dateVerif,
            remarque: remarque,
          });
        }
      }
    }

    // Save last pince
    if (currentPince) {
      await savePince(currentPince, currentFabricant, currentVariants);
      pinceCount++;
      variantCount += currentVariants.size;
      for (const variant of currentVariants.values()) {
        maintenanceCount += variant.tests.length;
      }
    }

    console.log(`\n✅ Import complete:`);
    console.log(`   Pinces: ${pinceCount}`);
    console.log(`   Variants: ${variantCount}`);
    console.log(`   Maintenance records: ${maintenanceCount}`);

    await sequelize.close();
  } catch (error) {
    console.error('Import error:', error.message);
    process.exit(1);
  }
}

async function savePince(pinceNum, fabricantName, variants) {
  try {
    // Create/find fabricant
    let fabricant = await Fabricant.findOne({ where: { nom: fabricantName } });
    if (!fabricant) {
      fabricant = await Fabricant.create({ nom: fabricantName });
    }

    // Create pince
    const pince = await Pince.create({
      numero_pince: pinceNum,
      fabricant_id: fabricant.id,
      statut: 'En service',
    });

    // Create variants and maintenance records
    for (const variant of variants.values()) {
      try {
        const pinceVariant = await PinceVariant.create({
          pince_id: pince.id,
          reference_tec: variant.refTec,
          reference_constructeur: variant.refConstr,
          section_mm: variant.sectionMm,
          section_awg: variant.sectionAwg,
          longueur_denudage: variant.longueurDenudage,
          valeur_traction: variant.valeurTraction,
        });

        // Create maintenance records for each test set
        for (const test of variant.tests) {
          const testValues = [test.test1, test.test2, test.test3, test.test4, test.test5]
            .filter(v => v !== null && v !== undefined && v !== '');
          
          // Skip if no valid test values
          if (testValues.length === 0) continue;

          try {
            const moyenne = Math.round(testValues.reduce((a, b) => a + b, 0) / testValues.length);

            // Determine conformity - always set to valid enum value
            let conformity = 'À reprendre';
            if (variant.valeurTraction) {
              const minValue = parseInt(variant.valeurTraction.replace(/[^0-9]/g, '')) || 50;
              if (!isNaN(minValue)) {
                const allPass = testValues.every(v => v >= minValue * 0.95);
                const someFailSevere = testValues.some(v => v < minValue * 0.8);
                
                if (allPass && testValues.length > 0) {
                  conformity = 'Conforme';
                } else if (someFailSevere) {
                  conformity = 'Non-conforme';
                }
              }
            }

            // Ensure valid value (final safety check)
            if (!['Conforme', 'Non-conforme', 'À reprendre'].includes(conformity)) {
              conformity = 'À reprendre';
            }

            await PinceMaintenanceRecord.create({
              pince_variant_id: pinceVariant.id,
              test_value_1: test.test1 || null,
              test_value_2: test.test2 || null,
              test_value_3: test.test3 || null,
              test_value_4: test.test4 || null,
              test_value_5: test.test5 || null,
              date_verification: test.dateVerif ? parseDate(test.dateVerif) : null,
              statut_verification: conformity,
              remarque: test.remarque || null,
            });
          } catch (recordError) {
            // Silently skip this maintenance record if there's an error
            continue;
          }
        }
      } catch (variantError) {
        console.error(`Error creating variant for ${pinceNum}:`, variantError.message);
      }
    }
  } catch (error) {
    console.error(`Error saving pince ${pinceNum}:`, error.message);
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function isValidPinceNumber(str) {
  return /^P\d+/.test(str) || str.includes('P0') || str.includes('P1') || str.includes('P2') || 
         str.includes('P3') || str.includes('P4') || str.includes('P5') || 
         str.includes('P6') || str.includes('P7') || str.includes('P8') || str.includes('P9');
}

function parseTestValue(str) {
  if (!str || str === '') return null;
  // Only accept numeric values, ignore symbols and text
  const cleaned = str.replace(/[^0-9]/g, '');
  if (cleaned === '') return null;
  const num = parseInt(cleaned);
  return isNaN(num) ? null : num;
}

function parseDate(dateStr) {
  if (!dateStr || dateStr === '') return null;
  
  try {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0]) - 1;
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

importPinces();
