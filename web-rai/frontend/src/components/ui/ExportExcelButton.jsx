import React, { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { exportRowsToExcel } from '../../utils/excelExport';

// Drop-in "Exporter Excel" button — same look everywhere in the app.
// `rows` are the already-filtered/visible records; `columns` is
// [{ header, key, width? }], and each row object's values are read by `key`.
const ExportExcelButton = ({
  filename,
  sheetName,
  columns,
  rows,
  label = 'Exporter Excel',
  className = '',
}) => {
  const [exporting, setExporting] = useState(false);
  const hasRows = Array.isArray(rows) && rows.length > 0;

  const handleClick = async () => {
    if (!hasRows || exporting) return;
    setExporting(true);
    try {
      await exportRowsToExcel({ filename, sheetName, columns, rows });
    } catch (err) {
      console.error('Erreur export Excel:', err);
      alert("Erreur lors de l'export Excel.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!hasRows || exporting}
      title={!hasRows ? 'Aucune donnée à exporter' : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-semibold transition-colors disabled:opacity-50 ${className}`}
      style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text2)' }}
    >
      <FileSpreadsheet className="w-3.5 h-3.5" />
      {exporting ? 'Export…' : label}
    </button>
  );
};

export default ExportExcelButton;
