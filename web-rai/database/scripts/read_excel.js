/**
 * read_excel.js
 * Reads all sheets from the Excel file and saves each as a JSON file
 * in database/output/
 *
 * Usage: node database/scripts/read_excel.js
 */

const XLSX  = require('xlsx');
const fs    = require('fs');
const path  = require('path');

const EXCEL_FILE = path.join(__dirname, '..', 'Fiches de vie des ECME.xls');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

console.log(`Reading: ${EXCEL_FILE}\n`);

const workbook = XLSX.readFile(EXCEL_FILE, { cellDates: true, defval: '' });

console.log(`Found ${workbook.SheetNames.length} sheets:\n`);

workbook.SheetNames.forEach((sheetName, i) => {
  const worksheet = workbook.Sheets[sheetName];

  // Convert sheet to JSON (array of objects using first row as headers)
  const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  // Sanitize sheet name for filename
  const safeName = sheetName.replace(/[\\/:*?"<>|]/g, '_').trim();
  const outFile  = path.join(OUTPUT_DIR, `${String(i + 1).padStart(3, '0')}_${safeName}.json`);

  fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf8');

  console.log(`  [${String(i + 1).padStart(3, '0')}] "${sheetName}" → ${data.length} row(s) → ${path.basename(outFile)}`);
});

console.log(`\nDone. Output in: ${OUTPUT_DIR}`);
