const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { sequelize, Equipement, Zone, Fabricant } = require('../../backend/app/models');

const csvCandidates = [
  process.env.PDR_FILE_PATH,
  path.join(__dirname, '..', 'PARAMETRE APP (1).csv'),
  path.join('C:', 'Users', 'user', 'Desktop', 'PARAMETRE APP (1).csv'),
].filter(Boolean);

const csvPath = csvCandidates.find((candidatePath) => fs.existsSync(candidatePath));

if (!csvPath) {
  console.error('CSV PDR introuvable. Definissez PDR_FILE_PATH ou placez le fichier dans database/.');
  process.exit(1);
}

const parseCsvLine = (line) => {
  const result = [];
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
      result.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
};

const normalizeCell = (value) => {
  const trimmedValue = (value || '').toString().trim();
  return trimmedValue === '' ? null : trimmedValue;
};

const sanitizeCode = (value) =>
  (value || 'PDR')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();

const formatPart = (label, partRef, partQuantity) => {
  if (!partRef && !partQuantity) return null;
  const quantityLabel = partQuantity || '-';
  return `${label}: ${partRef || '-'} x ${quantityLabel}`;
};

const buildPartSummary = (partRef, partQuantity) => ({
  reference: partRef,
  quantity: partQuantity,
});

const buildRemark = (record) =>
  [
    record.refTerminalFournisseur ? `Terminal fournisseur: ${record.refTerminalFournisseur}` : null,
    record.refTerminalTec ? `Terminal TEC: ${record.refTerminalTec}` : null,
    formatPart('Lame cuivre', record.parts.cuivre.ref, record.parts.cuivre.quantity),
    formatPart('Lame isolant', record.parts.isolant.ref, record.parts.isolant.quantity),
    formatPart('Enclume cuivre', record.parts.enclumeCuivre.ref, record.parts.enclumeCuivre.quantity),
    formatPart('Enclume isolant', record.parts.enclumeIsolant.ref, record.parts.enclumeIsolant.quantity),
    record.denudageQuantity ? `Lame de denudage (jeux): ${record.denudageQuantity}` : null,
    record.continuations.length ? `Complements: ${record.continuations.join(' / ')}` : null,
  ]
    .filter(Boolean)
    .join(' | ');

const buildPdrRecord = (columns, currentConstructor = null) => ({
  rowNumber: normalizeCell(columns[0]),
  refApplicateurTec: normalizeCell(columns[1]),
  constructeur: normalizeCell(columns[2]) || currentConstructor || 'Inconnu',
  refTerminalFournisseur: normalizeCell(columns[3]),
  refTerminalTec: normalizeCell(columns[4]),
  parts: {
    cuivre: {
      ref: normalizeCell(columns[5]),
      quantity: normalizeCell(columns[6]),
    },
    isolant: {
      ref: normalizeCell(columns[7]),
      quantity: normalizeCell(columns[8]),
    },
    enclumeCuivre: {
      ref: normalizeCell(columns[9]),
      quantity: normalizeCell(columns[10]),
    },
    enclumeIsolant: {
      ref: normalizeCell(columns[11]),
      quantity: normalizeCell(columns[12]),
    },
  },
  denudageQuantity: normalizeCell(columns[13]),
  continuations: [],
});

async function importPdr() {
  try {
    console.log(`🔄 Import PDR depuis ${path.basename(csvPath)}...`);
    await sequelize.sync();

    const maintenanceZone = await Zone.findOne({ where: { nom_zone: 'Maintenance' } });
    const fileStream = fs.createReadStream(csvPath, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const records = [];
    let currentRecord = null;

    const pushCurrentRecord = () => {
      if (!currentRecord) return;
      records.push(currentRecord);
      currentRecord = null;
    };

    for await (const rawLine of rl) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.includes('Ref° Applicateur TEC') || line.startsWith('N°,')) continue;

      const columns = parseCsvLine(rawLine);
      while (columns.length < 14) columns.push('');

      const refApplicateurTec = normalizeCell(columns[1]);

      if (refApplicateurTec) {
        const previousConstructor = currentRecord?.constructeur || null;
        pushCurrentRecord();
        currentRecord = buildPdrRecord(columns, previousConstructor);
        continue;
      }

      if (!currentRecord) {
        continue;
      }

      const continuationSummary = [
        normalizeCell(columns[3]) ? `Fournisseur ${normalizeCell(columns[3])}` : null,
        normalizeCell(columns[4]) ? `TEC ${normalizeCell(columns[4])}` : null,
        normalizeCell(columns[13]) ? `Jeux ${normalizeCell(columns[13])}` : null,
      ]
        .filter(Boolean)
        .join(', ');

      if (continuationSummary) {
        currentRecord.continuations.push(continuationSummary);
      }

      if (!currentRecord.refTerminalFournisseur && normalizeCell(columns[3])) {
        currentRecord.refTerminalFournisseur = normalizeCell(columns[3]);
      }
      if (!currentRecord.refTerminalTec && normalizeCell(columns[4])) {
        currentRecord.refTerminalTec = normalizeCell(columns[4]);
      }
      if (!currentRecord.parts.cuivre.ref && normalizeCell(columns[5])) {
        currentRecord.parts.cuivre.ref = normalizeCell(columns[5]);
      }
      if (!currentRecord.parts.cuivre.quantity && normalizeCell(columns[6])) {
        currentRecord.parts.cuivre.quantity = normalizeCell(columns[6]);
      }
      if (!currentRecord.parts.isolant.ref && normalizeCell(columns[7])) {
        currentRecord.parts.isolant.ref = normalizeCell(columns[7]);
      }
      if (!currentRecord.parts.isolant.quantity && normalizeCell(columns[8])) {
        currentRecord.parts.isolant.quantity = normalizeCell(columns[8]);
      }
      if (!currentRecord.parts.enclumeCuivre.ref && normalizeCell(columns[9])) {
        currentRecord.parts.enclumeCuivre.ref = normalizeCell(columns[9]);
      }
      if (!currentRecord.parts.enclumeCuivre.quantity && normalizeCell(columns[10])) {
        currentRecord.parts.enclumeCuivre.quantity = normalizeCell(columns[10]);
      }
      if (!currentRecord.parts.enclumeIsolant.ref && normalizeCell(columns[11])) {
        currentRecord.parts.enclumeIsolant.ref = normalizeCell(columns[11]);
      }
      if (!currentRecord.parts.enclumeIsolant.quantity && normalizeCell(columns[12])) {
        currentRecord.parts.enclumeIsolant.quantity = normalizeCell(columns[12]);
      }
      if (!currentRecord.denudageQuantity && normalizeCell(columns[13])) {
        currentRecord.denudageQuantity = normalizeCell(columns[13]);
      }
    }

    pushCurrentRecord();

    const seenCodes = new Map();
    const pdrRows = records.map((record, index) => {
      const baseCode = `PDR-${sanitizeCode(record.refApplicateurTec || record.rowNumber || `${index + 1}`)}`;
      const duplicateCount = seenCodes.get(baseCode) || 0;
      seenCodes.set(baseCode, duplicateCount + 1);

      return {
        code_rai: duplicateCount === 0 ? baseCode : `${baseCode}-${duplicateCount + 1}`,
        designation: `${record.constructeur} / ${record.refApplicateurTec || record.rowNumber || 'PDR'}`,
        numero_serie: [record.refTerminalTec, record.refTerminalFournisseur].filter(Boolean).join(' / ') || null,
        remarque: buildRemark(record),
        pdrDetails: {
          ref_applicateur_tec: record.refApplicateurTec,
          ref_terminal_fournisseur: record.refTerminalFournisseur,
          ref_terminal_tec: record.refTerminalTec,
          lame_cuivre: buildPartSummary(record.parts.cuivre.ref, record.parts.cuivre.quantity),
          lame_isolant: buildPartSummary(record.parts.isolant.ref, record.parts.isolant.quantity),
          enclume_cuivre: buildPartSummary(record.parts.enclumeCuivre.ref, record.parts.enclumeCuivre.quantity),
          enclume_isolant: buildPartSummary(record.parts.enclumeIsolant.ref, record.parts.enclumeIsolant.quantity),
          lame_denudage_jeux: record.denudageQuantity,
        },
        statut: 'En service',
        categorie: 'pdr',
        zone_id: maintenanceZone ? maintenanceZone.id : null,
        constructeur: record.constructeur,
      };
    });

    await sequelize.transaction(async (transaction) => {
      await Equipement.destroy({ where: { categorie: 'pdr' }, transaction });

      for (const row of pdrRows) {
        let fabricant = await Fabricant.findOne({
          where: { nom: row.constructeur },
          transaction,
        });

        if (!fabricant) {
          fabricant = await Fabricant.create(
            {
              nom: row.constructeur,
            },
            { transaction }
          );
        }

        await Equipement.create(
          {
            code_rai: row.code_rai,
            designation: row.designation,
            numero_serie: row.numero_serie,
            pdr_details: row.pdrDetails,
            remarque: row.remarque,
            statut: row.statut,
            categorie: row.categorie,
            zone_id: row.zone_id,
            fabricant_id: fabricant.id,
          },
          { transaction }
        );
      }
    });

    console.log(`✅ Import PDR termine: ${pdrRows.length} reference(s) importee(s).`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur import PDR:', error.message);
    process.exit(1);
  }
}

importPdr();