const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { sequelize, Pince, PinceVariant, PinceMaintenanceRecord, Fabricant } = require('../app/models');

const PINCES_FILE = path.join(__dirname, '../../database/Suivi des equipments pince.csv');

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
  const normalized = String(val).replace(',', '.');
  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
};

const cleanString = (str) => {
  if (!str) return '';
  return str.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
};

const parseSectionMm = (value) => {
  const cleaned = cleanString(value);
  if (!cleaned) return null;

  const normalized = cleaned
    .replace(',', '.')
    .replace(/\s+/g, '')
    .replace(/[^0-9.\-]/g, '');

  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

const hasMaintenanceValues = (testValues) => testValues.some((v) => v !== null);

const parsePinceNumber = (raw) => {
  const value = cleanString(raw).toUpperCase();
  if (!value) return null;

  const normalized = value.replace(/\s+/g, ' ');
  const regex = /^P\d{1,3}(?:\s*BIS)?(?:\+P?\d{1,3})?(?:-\d+)?$/i;
  if (!regex.test(normalized)) return null;

  return normalized;
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

const normalizePinceStatut = (rawValue, rawRemark) => {
  const source = `${cleanString(rawValue)} ${cleanString(rawRemark)}`.toLowerCase();

  if (source.includes('manque cosse')) return 'Manque cosse';
  if (source.includes('verefication visuelle') || source.includes('verification visuelle')) return 'Vérification visuelle';
  if (source.includes('hors service')) return 'Hors service';
  if (source.includes('en service')) return 'En service';
  return 'À vérifier';
};

async function importPinces() {
  try {
    console.log('🔄 Démarrage de l\'import des pinces...\n');

    const pincesData = new Map();
    const fileStream = fs.createReadStream(PINCES_FILE, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineCount = 0;
    let currentPinceKey = null;

    for await (const line of rl) {
      lineCount++;

      const columns = parseCSVLine(line);
      if (columns.length < 17) {
        while (columns.length < 17) columns.push('');
      }

      const col0 = cleanString(columns[0]);

      const maybePinceNumber = parsePinceNumber(col0);
      if (maybePinceNumber) {
        const constructeur = (cleanString(columns[1]) || 'Inconnu').toUpperCase();
        const referenceMore = cleanString(columns[2]) || '';
        const pinceUniqueKey = `${maybePinceNumber}__${constructeur}__${referenceMore}`;

        if (!pincesData.has(pinceUniqueKey)) {
          pincesData.set(pinceUniqueKey, {
            numeroPince: maybePinceNumber,
            constructeur,
            referenceMore,
            lastReferenceConstructeur: cleanString(columns[3]) || null,
            lastReferenceTec: cleanString(columns[4]) || null,
            lastLongueurDenudage: cleanString(columns[6]) || null,
            lastDateVerification: parseDate(cleanString(columns[13])),
            statut: normalizePinceStatut(columns[15], columns[16]),
            remarque: cleanString(columns[16]) || null,
            variants: [],
          });
          console.log(`  ✓ ${maybePinceNumber} - ${constructeur}`);
        } else {
          const existing = pincesData.get(pinceUniqueKey);
          const freshDate = parseDate(cleanString(columns[13]));
          existing.lastDateVerification = freshDate || existing.lastDateVerification;
          existing.statut = normalizePinceStatut(columns[15], columns[16]);
          existing.remarque = cleanString(columns[16]) || existing.remarque;
        }

        currentPinceKey = pinceUniqueKey;
      }

      if (!currentPinceKey || !pincesData.has(currentPinceKey)) {
        continue;
      }

      const currentPince = pincesData.get(currentPinceKey);

      const rawReferenceConstructeur = cleanString(columns[3]);
      const rawReferenceTec = cleanString(columns[4]);
      const rawSectionMm = cleanString(columns[5]);
      const rawLongueurDenudage = cleanString(columns[6]);

      if (rawReferenceConstructeur) currentPince.lastReferenceConstructeur = rawReferenceConstructeur;
      if (rawReferenceTec) currentPince.lastReferenceTec = rawReferenceTec;
      if (rawLongueurDenudage) currentPince.lastLongueurDenudage = rawLongueurDenudage;

      const sectionMm = parseSectionMm(rawSectionMm);

      const testValues = [
        parseTestValue(cleanString(columns[8])),
        parseTestValue(cleanString(columns[9])),
        parseTestValue(cleanString(columns[10])),
        parseTestValue(cleanString(columns[11])),
        parseTestValue(cleanString(columns[12])),
      ];

      const explicitDateVerification = parseDate(cleanString(columns[13]));
      if (explicitDateVerification) {
        currentPince.lastDateVerification = explicitDateVerification;
      }

      const looksLikeVariant = Boolean(
        rawReferenceConstructeur ||
        rawReferenceTec ||
        rawSectionMm ||
        rawLongueurDenudage ||
        cleanString(columns[7]) ||
        hasMaintenanceValues(testValues)
      );

      if (!looksLikeVariant) {
        continue;
      }

      const variant = {
        referenceConstructeur: currentPince.lastReferenceConstructeur,
        referenceTec: currentPince.lastReferenceTec,
        sectionMm,
        sectionAwg: null,
        longueurDenudage: rawLongueurDenudage || currentPince.lastLongueurDenudage,
        valeurTraction: cleanString(columns[7]) || null,
        testValues,
        dateVerification: explicitDateVerification || currentPince.lastDateVerification,
        affectation: cleanString(columns[14]) || null,
        statut: normalizePinceStatut(columns[15], columns[16]),
        remarque: cleanString(columns[16]) || null,
      };

      currentPince.variants.push(variant);
    }

    console.log(`\n✅ CSV parsé: ${pincesData.size} pinces trouvées\n`);

    // Rebuild pince data from CSV source of truth
    await sequelize.transaction(async (transaction) => {
      await PinceMaintenanceRecord.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true, transaction });
      await PinceVariant.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true, transaction });
      await Pince.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true, transaction });
    });

    let createdCount = 0;
    let variantCount = 0;
    let recordCount = 0;

    for (const pinceData of pincesData.values()) {
      try {
        let fabricant = await Fabricant.findOne({
          where: { nom: pinceData.constructeur },
        });

        if (!fabricant) {
          fabricant = await Fabricant.create({
            nom: pinceData.constructeur,
          });
        }

        const pince = await Pince.create({
          numero_pince: pinceData.numeroPince,
          reference_pince: pinceData.referenceMore,
          fabricant_id: fabricant.id,
          date_verification: pinceData.lastDateVerification,
          statut: pinceData.statut,
          remarque: pinceData.remarque,
        });
        createdCount++;

        console.log(`  ✓ ${pinceData.numeroPince} (${pinceData.variants.length} variantes)`);

        // Create variants and maintenance records
        for (const variantData of pinceData.variants) {
          if (!variantData.referenceConstructeur && !variantData.referenceTec && variantData.sectionMm === null) {
            continue;
          }

          const variant = await PinceVariant.create({
            pince_id: pince.id,
            reference_constructeur: variantData.referenceConstructeur,
            reference_tec: variantData.referenceTec,
            section_mm: variantData.sectionMm,
            section_awg: null,
            longueur_denudage: variantData.longueurDenudage,
            valeur_traction: variantData.valeurTraction,
            affectation: variantData.affectation,
            remarque: variantData.remarque,
          });
          variantCount++;

          // Create maintenance record
          if (variantData.dateVerification && hasMaintenanceValues(variantData.testValues)) {
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
      } catch (error) {
        console.error(`⚠ Erreur ${pinceData.numeroPince}:`, error.message);
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
