import React, { useEffect, useMemo, useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { exportRowsToPDF } from '../../utils/pdfExport';

const ALERTE_OPTIONS = [
  { value: 'VALABLE',      label: 'Valable'      },
  { value: 'VERIFICATION', label: 'À vérifier'   },
  { value: 'EXEMPTE',      label: 'Exempté'      },
  { value: 'DECLASSE',     label: 'Déclassé'     },
  { value: 'CHEZ_CLIENT',  label: 'Chez client'  },
  { value: 'INCONNU',      label: 'Inconnu'      },
];

const fmtDate = (raw) => {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('fr-FR');
};

const allAlertes = () => new Set(ALERTE_OPTIONS.map((o) => o.value));

function EcmeExportModal({ isOpen, onClose, records }) {
  const [selectedEtats,   setSelectedEtats]   = useState(allAlertes);
  const [equipMode,       setEquipMode]       = useState('all'); // 'all' | 'custom'
  const [customSearch,    setCustomSearch]    = useState('');
  const [customSelected,  setCustomSelected]  = useState(new Set());
  const [exporting,       setExporting]       = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedEtats(allAlertes());
      setEquipMode('all'); setCustomSearch(''); setCustomSelected(new Set());
    }
  }, [isOpen]);

  const filteredPicker = useMemo(() => {
    const q = customSearch.toLowerCase();
    if (!q) return records;
    return records.filter((r) =>
      (r.code || '').toLowerCase().includes(q) || (r.designation || '').toLowerCase().includes(q));
  }, [records, customSearch]);

  if (!isOpen) return null;

  const toggleEtat = (value) => setSelectedEtats((prev) => {
    const next = new Set(prev);
    if (next.has(value)) next.delete(value); else next.add(value);
    return next;
  });

  const toggleEquip = (code) => setCustomSelected((prev) => {
    const next = new Set(prev);
    if (next.has(code)) next.delete(code); else next.add(code);
    return next;
  });

  const handleExport = async () => {
    const rows = records
      .filter((r) => selectedEtats.has(r.alerte))
      .filter((r) => equipMode === 'all' || customSelected.has(r.code))
      .map((r) => ({
        code: r.code, designation: r.designation || '', marque: r.marque || '',
        serie: r.n_serie || '', affectation: r.affectation || '',
        statut: ALERTE_OPTIONS.find((o) => o.value === r.alerte)?.label || r.alerte || '',
        derniere: fmtDate(r.date_derniere_verification), prochaine: fmtDate(r.date_prochaine_verification),
        remarques: r.remarques || '',
      }));

    if (rows.length === 0) { alert('Aucun ECME ne correspond à cette sélection.'); return; }

    setExporting(true);
    try {
      await exportRowsToPDF({
        filename: `ECME_${new Date().toISOString().slice(0, 10)}.pdf`,
        title: 'État des ECME',
        subtitle: `Exporté le ${new Date().toLocaleDateString('fr-FR')} — ${rows.length} équipement(s)`,
        columns: [
          { header: 'Code', key: 'code' }, { header: 'Désignation', key: 'designation', width: 26 },
          { header: 'Marque', key: 'marque' }, { header: 'N° Série', key: 'serie' },
          { header: 'Affectation', key: 'affectation' }, { header: 'Statut', key: 'statut' },
          { header: 'Dernière vérif.', key: 'derniere' }, { header: 'Prochaine vérif.', key: 'prochaine' },
          { header: 'Remarques', key: 'remarques', width: 26 },
        ],
        rows,
      });
      onClose();
    } catch (err) {
      console.error('Erreur export PDF ECME:', err);
      alert("Erreur lors de l'export PDF.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-[16px] shadow-2xl w-[440px] max-h-[85vh] flex flex-col overflow-hidden" style={{ background: 'var(--panel)' }}>
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0d1828, #0a2820)' }}>
          <p className="text-sm font-bold text-white font-display flex items-center gap-2">
            <FileText className="w-4 h-4 opacity-70" /> Exporter en PDF
          </p>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-base flex-shrink-0">✕</button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* État filter */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text3)' }}>États à inclure</p>
            <div className="flex flex-wrap gap-1.5">
              {ALERTE_OPTIONS.map((o) => {
                const active = selectedEtats.has(o.value);
                return (
                  <button key={o.value} type="button" onClick={() => toggleEtat(o.value)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
                    style={active
                      ? { background: 'var(--accent-soft)', border: '1.5px solid var(--accent)', color: 'var(--accent)' }
                      : { border: '1px solid var(--border)', background: 'var(--panel2)', color: 'var(--text3)' }}>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Equipment filter */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text3)' }}>Équipements</p>
            <div className="flex gap-1.5 mb-2">
              {[{ id: 'all', label: 'Tous' }, { id: 'custom', label: 'Sélection personnalisée' }].map((m) => (
                <button key={m.id} type="button" onClick={() => setEquipMode(m.id)}
                  className="flex-1 px-3 py-1.5 rounded-[8px] text-[11px] font-semibold transition-colors"
                  style={equipMode === m.id
                    ? { background: 'var(--accent-soft)', border: '1.5px solid var(--accent)', color: 'var(--accent)' }
                    : { border: '1px solid var(--border)', background: 'var(--panel2)', color: 'var(--text3)' }}>
                  {m.label}
                </button>
              ))}
            </div>

            {equipMode === 'custom' && (
              <>
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text3)' }} />
                  <input type="text" placeholder="Rechercher un équipement…"
                    className="w-full rounded-[8px] pl-7 pr-2 py-1.5 text-xs outline-none"
                    style={{ border: '1px solid var(--border)', background: 'var(--panel2)', color: 'var(--text)' }}
                    value={customSearch} onChange={(e) => setCustomSearch(e.target.value)} />
                </div>
                <div className="rounded-[10px] max-h-48 overflow-y-auto" style={{ border: '1px solid var(--border)' }}>
                  {filteredPicker.length === 0 ? (
                    <p className="px-3 py-3 text-xs italic" style={{ color: 'var(--text3)' }}>Aucun ECME trouvé</p>
                  ) : filteredPicker.map((r) => (
                    <label key={r.code} className="flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors hover:bg-[var(--panel2)]" style={{ borderBottom: '1px solid var(--border2)' }}>
                      <input type="checkbox" checked={customSelected.has(r.code)} onChange={() => toggleEquip(r.code)} style={{ accentColor: 'var(--accent)' }} />
                      <span className="font-mono text-[11px] font-bold flex-shrink-0" style={{ color: 'var(--accent)' }}>{r.code}</span>
                      <span className="text-[11px] truncate" style={{ color: 'var(--text2)' }}>{r.designation}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[11px] mt-1.5" style={{ color: 'var(--text3)' }}>{customSelected.size} équipement(s) sélectionné(s)</p>
              </>
            )}
          </div>
        </div>

        <div className="p-5 pt-3 border-t flex gap-2 flex-shrink-0" style={{ borderColor: 'var(--border2)' }}>
          <button onClick={handleExport} disabled={exporting || selectedEtats.size === 0 || (equipMode === 'custom' && customSelected.size === 0)}
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

// Drop-in trigger + modal, used by both État des ECME and Suivi des ECME —
// same underlying record shape, just displayed differently on each page.
const EcmeExportButton = ({ records }) => {
  const [open, setOpen] = useState(false);
  const hasRecords = Array.isArray(records) && records.length > 0;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} disabled={!hasRecords}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-semibold transition-colors disabled:opacity-50"
        style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
        <FileText className="w-3.5 h-3.5" />
        Exporter PDF
      </button>
      <EcmeExportModal isOpen={open} onClose={() => setOpen(false)} records={records || []} />
    </>
  );
};

export default EcmeExportButton;
