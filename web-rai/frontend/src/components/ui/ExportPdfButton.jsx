import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { exportRowsToPDF } from '../../utils/pdfExport';

// Drop-in "Exporter PDF" button for a simple, already-filtered table — no
// selection step. Pages that need the user to pick what goes in first (e.g.
// ECME's état/équipement picker) build their own modal around exportRowsToPDF.
const ExportPdfButton = ({
  filename,
  title,
  subtitle,
  columns,
  rows,
  label = 'Exporter PDF',
  className = '',
}) => {
  const [exporting, setExporting] = useState(false);
  const hasRows = Array.isArray(rows) && rows.length > 0;

  const handleClick = async () => {
    if (!hasRows || exporting) return;
    setExporting(true);
    try {
      await exportRowsToPDF({ filename, title, subtitle, columns, rows });
    } catch (err) {
      console.error('Erreur export PDF:', err);
      alert("Erreur lors de l'export PDF.");
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
      <FileText className="w-3.5 h-3.5" />
      {exporting ? 'Export…' : label}
    </button>
  );
};

export default ExportPdfButton;
