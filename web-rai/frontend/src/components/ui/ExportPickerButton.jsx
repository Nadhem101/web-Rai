import React, { useEffect, useMemo, useState } from 'react';
import { Search, FileText, FileSpreadsheet } from 'lucide-react';
import { exportRowsToPDF } from '../../utils/pdfExport';
import { exportRowsToExcel } from '../../utils/excelExport';

// Generic "choose what to export" trigger + modal — whole/current view, or a
// searchable custom selection — generalized so any list page can drop it in
// with its own item shape, for either a PDF or an Excel output (`format`).
function ExportPickerModal({
  isOpen, onClose, items, getKey, getSearchText, getPrimaryLabel, getSecondaryLabel,
  columns, buildRow, buildRows, onExport, filename, title, sheetName,
  mergeGroupKey, mergeColumns, format = 'pdf',
}) {
  const [mode,      setMode]      = useState('view'); // 'view' | 'custom'
  const [search,    setSearch]    = useState('');
  const [selected,  setSelected]  = useState(new Set());
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!isOpen) { setMode('view'); setSearch(''); setSelected(new Set()); }
  }, [isOpen]);

  const filteredPicker = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return items;
    return items.filter((it) => getSearchText(it).toLowerCase().includes(q));
  }, [items, search, getSearchText]);

  if (!isOpen) return null;

  const toggle = (key) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  const handleExport = async () => {
    const targetItems = mode === 'view' ? items : items.filter((it) => selected.has(getKey(it)));
    if (targetItems.length === 0) { alert('Aucun élément à exporter.'); return; }
    setExporting(true);
    try {
      if (onExport) {
        // Fully custom export (e.g. a detailed multi-page fiche per item)
        // instead of the generic flat-table builder below.
        await onExport(targetItems);
      } else {
        // buildRows lets one item expand into several output rows (e.g. one
        // piece of equipment → its whole measurement history); buildRow
        // stays the simple 1-row-per-item path most pages use.
        const rows = buildRows ? targetItems.flatMap(buildRows) : targetItems.map(buildRow);
        const resolvedFilename = typeof filename === 'function' ? filename() : filename;
        if (format === 'excel') {
          await exportRowsToExcel({ filename: resolvedFilename, sheetName: sheetName || title, columns, rows, mergeGroupKey, mergeColumns });
        } else {
          await exportRowsToPDF({
            filename: resolvedFilename,
            title,
            subtitle: `Exporté le ${new Date().toLocaleDateString('fr-FR')} — ${rows.length} ligne(s)`,
            columns,
            rows,
          });
        }
      }
      onClose();
    } catch (err) {
      console.error(`Erreur export ${format === 'excel' ? 'Excel' : 'PDF'}:`, err);
      alert(`Erreur lors de l'export ${format === 'excel' ? 'Excel' : 'PDF'}.`);
    } finally {
      setExporting(false);
    }
  };

  const FormatIcon = format === 'excel' ? FileSpreadsheet : FileText;
  const formatName = format === 'excel' ? 'Excel' : 'PDF';

  const MODES = [
    { id: 'view', label: 'Vue actuelle', desc: 'Tous les éléments actuellement affichés (recherche/filtre inclus).' },
    { id: 'custom', label: 'Sélection personnalisée', desc: 'Choisissez vous-même les éléments à inclure.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-[16px] shadow-2xl w-[440px] max-h-[85vh] flex flex-col overflow-hidden" style={{ background: 'var(--panel)' }}>
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0d1828, #0a2820)' }}>
          <p className="text-sm font-bold text-white font-display flex items-center gap-2">
            <FormatIcon className="w-4 h-4 opacity-70" /> Exporter en {formatName}
          </p>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-base flex-shrink-0">✕</button>
        </div>

        <div className="p-5 space-y-3 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-1.5">
            {MODES.map((m) => {
              const active = mode === m.id;
              return (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className="w-full text-left px-3 py-2.5 rounded-[10px] transition-colors"
                  style={active
                    ? { background: 'var(--accent-soft)', border: '1.5px solid var(--accent)' }
                    : { border: '1px solid var(--border)', background: 'var(--panel2)' }}>
                  <p className="text-xs font-semibold" style={{ color: active ? 'var(--accent)' : 'var(--text)' }}>{m.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>{m.desc}</p>
                </button>
              );
            })}
          </div>

          {mode === 'custom' && (
            <div className="pt-1">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text3)' }} />
                <input type="text" placeholder="Rechercher…"
                  className="w-full rounded-[8px] pl-7 pr-2 py-1.5 text-xs outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--panel2)', color: 'var(--text)' }}
                  value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="rounded-[10px] max-h-56 overflow-y-auto" style={{ border: '1px solid var(--border)' }}>
                {filteredPicker.length === 0 ? (
                  <p className="px-3 py-3 text-xs italic" style={{ color: 'var(--text3)' }}>Aucun élément trouvé</p>
                ) : filteredPicker.map((it) => {
                  const key = getKey(it);
                  return (
                    <label key={key} className="flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors hover:bg-[var(--panel2)]" style={{ borderBottom: '1px solid var(--border2)' }}>
                      <input type="checkbox" checked={selected.has(key)} onChange={() => toggle(key)} style={{ accentColor: 'var(--accent)' }} />
                      <span className="font-mono text-[11px] font-bold flex-shrink-0" style={{ color: 'var(--accent)' }}>{getPrimaryLabel(it)}</span>
                      <span className="text-[11px] truncate" style={{ color: 'var(--text2)' }}>{getSecondaryLabel(it)}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-[11px] mt-1.5" style={{ color: 'var(--text3)' }}>{selected.size} élément(s) sélectionné(s)</p>
            </div>
          )}
        </div>

        <div className="p-5 pt-3 border-t flex gap-2 flex-shrink-0" style={{ borderColor: 'var(--border2)' }}>
          <button onClick={handleExport} disabled={exporting || (mode === 'custom' && selected.size === 0)}
            className="flex-1 py-2 rounded-[10px] text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
            {exporting ? 'Export…' : 'Exporter'}
          </button>
          <button onClick={onClose}
            className="flex-1 py-2 rounded-[10px] text-sm font-semibold transition-colors hover:bg-[var(--panel3)]"
            style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

const ExportPickerButton = ({ label, format = 'pdf', ...props }) => {
  const [open, setOpen] = useState(false);
  const items = props.items || [];
  const hasItems = items.length > 0;
  const Icon = format === 'excel' ? FileSpreadsheet : FileText;
  const resolvedLabel = label || (format === 'excel' ? 'Exporter Excel' : 'Exporter PDF');

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} disabled={!hasItems}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-semibold transition-colors disabled:opacity-50"
        style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
        <Icon className="w-3.5 h-3.5" />
        {resolvedLabel}
      </button>
      <ExportPickerModal {...props} items={items} format={format} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ExportPickerButton;
