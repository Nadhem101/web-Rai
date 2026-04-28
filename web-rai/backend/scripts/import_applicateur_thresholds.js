const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { sequelize, ApplicateurThreshold } = require('../app/models');

const csvPath = path.join(__dirname, '../../database/Seuil Par Applicateur.csv');

const CSV_HEADERS = [
  'numero_outil',
  'reference_tec',
  'designation',
  'section_mm2',
  'seuil_n',
  'longueur_denudage',
];

const EMPTY_VALUES = new Set(['', null, undefined]);

const normalizeCell = (value) => {
  if (EMPTY_VALUES.has(value)) return '';
  return String(value).replace(/\r/g, '').replace(/\uFEFF/g, '').trim();
};

const normalizeText = (value = '') =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const buildGroupKey = (numeroOutil, referenceTec, designation) =>
  `${normalizeText(numeroOutil)}__${normalizeText(referenceTec)}__${normalizeText(designation)}`;

const hasMeaningfulContent = (row) => CSV_HEADERS.some((header) => normalizeCell(row[header]));

const parseRows = () =>
  new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(csvPath)
      .pipe(
        csv({
          skipLines: 2,
          headers: CSV_HEADERS,
          mapValues: ({ value }) => normalizeCell(value),
        })
      )
      .on('data', (row) => {
        if (!hasMeaningfulContent(row)) return;
        rows.push(row);
      })
      .on('end', () => resolve(rows))
      .on('error', reject);
  });

const importApplicateurThresholds = async () => {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Fichier introuvable: ${csvPath}`);
  }

  await sequelize.sync();

  const sourceRows = await parseRows();
  const records = [];

  let currentNumeroOutil = '';
  let currentReferenceTec = '';
  let currentDesignation = '';

  sourceRows.forEach((row) => {
    const rawNumeroOutil = normalizeCell(row.numero_outil);
    const rawReferenceTec = normalizeCell(row.reference_tec);
    const rawDesignation = normalizeCell(row.designation);
    const sectionMm2 = normalizeCell(row.section_mm2);
    const seuilN = normalizeCell(row.seuil_n);
    const longueurDenudage = normalizeCell(row.longueur_denudage);

    if (rawNumeroOutil) currentNumeroOutil = rawNumeroOutil;
    if (rawNumeroOutil) {
      currentReferenceTec = rawReferenceTec;
      currentDesignation = rawDesignation;
    } else {
      if (rawReferenceTec) currentReferenceTec = rawReferenceTec;
      if (rawDesignation) currentDesignation = rawDesignation;
    }

    const numeroOutil = currentNumeroOutil;
    const referenceTec = currentReferenceTec;
    const designation = currentDesignation;

    records.push({
      numero_outil: numeroOutil || null,
      reference_tec: referenceTec || null,
      designation: designation || null,
      section_mm2: sectionMm2 || null,
      seuil_n: seuilN || null,
      longueur_denudage: longueurDenudage || null,
      group_key: buildGroupKey(numeroOutil, referenceTec, designation),
    });
  });

  await ApplicateurThreshold.destroy({ where: {} });

  if (records.length > 0) {
    await ApplicateurThreshold.bulkCreate(records, { validate: false });
  }

  console.log(`Import terminé: ${records.length} enregistrement(s) d'applicateur importé(s) depuis le CSV vers la BDD.`);
  await sequelize.close();
};

importApplicateurThresholds().catch((error) => {
  console.error('Import error:', error.message);
  process.exit(1);
});