/**
 * inspect_sheet.js
 * Dumps raw row arrays for first sheet to understand the form structure
 * Usage: node database/scripts/inspect_sheet.js
 */

const XLSX = require('xlsx');
const path = require('path');

const EXCEL_FILE = path.join(__dirname, '..', 'Fiches de vie des ECME.xls');
const workbook = XLSX.readFile(EXCEL_FILE, { cellDates: true, defval: '' });

// Inspect first sheet
const sheetName = workbook.SheetNames[0];
const ws = workbook.Sheets[sheetName];

// Get as array of arrays (raw rows)
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

console.log(`Sheet: ${sheetName}\n`);
rows.forEach((row, i) => {
  const nonEmpty = row.map((c, j) => `[${j}]=${JSON.stringify(c)}`).filter(s => !s.includes('=""'));
  if (nonEmpty.length) console.log(`Row ${String(i).padStart(2,'0')}: ${nonEmpty.join('  ')}`);
});
