// Generic tabular Excel export, shared by every "Exporter Excel" button in the
// app. Column-colored/multi-sheet exports (e.g. the Préventif calendar) keep
// their own bespoke builder — this one is for plain "one row per record" data.

const HEADER_FILL = 'FF0F1D35';
const GROUP_BORDER = { style: 'medium', color: { argb: 'FFCBD5E1' } };

// `mergeGroupKey(row)` + `mergeColumns` are for "detailed" exports where one
// parent record expands into several rows (e.g. one test article → one row
// per nappe): consecutive rows sharing the same group key get their
// mergeColumns cells merged vertically instead of repeating the same
// article code/désignation on every line, plus a divider under each group.
export async function exportRowsToExcel({ filename, sheetName = 'Feuille1', columns, rows, mergeGroupKey, mergeColumns }) {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetName.slice(0, 31));

  ws.columns = columns.map((c) => ({ header: c.header, key: c.key, width: c.width || 20 }));

  const headerRow = ws.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_FILL } };
    cell.alignment = { vertical: 'middle' };
  });

  rows.forEach((r) => ws.addRow(r));

  if (mergeGroupKey && mergeColumns?.length && rows.length) {
    const mergeColIdx = mergeColumns
      .map((key) => columns.findIndex((c) => c.key === key) + 1)
      .filter((idx) => idx > 0);

    const closeRun = (startRow, endRow) => {
      if (endRow > startRow) {
        mergeColIdx.forEach((colIdx) => {
          ws.mergeCells(startRow, colIdx, endRow, colIdx);
          ws.getRow(startRow).getCell(colIdx).alignment = { vertical: 'middle', wrapText: true };
        });
      }
      for (let col = 1; col <= columns.length; col += 1) {
        const cell = ws.getRow(endRow).getCell(col);
        cell.border = { ...cell.border, bottom: GROUP_BORDER };
      }
    };

    let runStart = 2; // row 1 is the header
    let runKey = mergeGroupKey(rows[0]);
    rows.forEach((r, i) => {
      const rowNum = i + 2;
      const key = mergeGroupKey(r);
      if (key !== runKey) {
        closeRun(runStart, rowNum - 1);
        runStart = rowNum;
        runKey = key;
      }
    });
    closeRun(runStart, rows.length + 1);
  }

  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };
  ws.views = [{ state: 'frozen', ySplit: 1 }];

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
