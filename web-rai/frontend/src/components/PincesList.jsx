import React, { useState, useEffect } from 'react';
import { pinceService, pincePreventiveService } from '../services/api';
import PinceForm from './PinceForm';
import { Plus, Pencil, Trash2, Wrench, PackageOpen, History, ChevronDown, ChevronUp } from 'lucide-react';

const StatusBadge = ({ statut }) => {
  const cfg = {
    'En service':           { dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'Hors service':         { dot: 'bg-red-500',     cls: 'bg-red-50 text-red-700 border-red-200' },
    'À vérifier':           { dot: 'bg-amber-400',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    'Manque cosse':         { dot: 'bg-orange-400',  cls: 'bg-orange-50 text-orange-700 border-orange-200' },
    'Vérification visuelle':{ dot: 'bg-sky-400',     cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  }[statut] ?? { dot: 'bg-slate-400', cls: 'bg-slate-50 text-slate-600 border-slate-200' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {statut}
    </span>
  );
};

const formatDate = (value) => {
  if (!value) return '—';
  const parts = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (parts) return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])).toLocaleDateString('fr-FR');
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('fr-FR');
};

// Collapsible history drawer for one pince
const HistoriqueDrawer = ({ numeroPince }) => {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const toggle = async () => {
    if (!open && !fetched) {
      setLoading(true);
      try {
        const data = await pincePreventiveService.getHistoriqueByPince(numeroPince);
        setRecords(Array.isArray(data) ? data : []);
      } catch {
        setRecords([]);
      } finally {
        setLoading(false);
        setFetched(true);
      }
    }
    setOpen((v) => !v);
  };

  // Group by date_controle to separate maintenance sessions
  const sessions = records.reduce((acc, r) => {
    const key = r.date_controle ?? 'sans-date';
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
  const sessionDates = Object.keys(sessions).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <tr className="bg-sky-50/40">
        <td colSpan={7} className="px-4 py-1.5">
          <button
            onClick={toggle}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            Historique des maintenances
            {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {fetched && records.length > 0 && (
              <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-700">
                {sessionDates.length} session(s)
              </span>
            )}
          </button>
        </td>
      </tr>

      {open && (
        <tr>
          <td colSpan={7} className="px-4 pb-4 bg-slate-50/60">
            {loading ? (
              <div className="flex items-center gap-2 py-3 text-xs text-slate-400">
                <div className="w-4 h-4 border-2 border-sky-100 border-t-sky-400 rounded-full animate-spin" />
                Chargement de l'historique…
              </div>
            ) : records.length === 0 ? (
              <p className="py-3 text-xs text-slate-400 italic">Aucun historique disponible pour cette pince.</p>
            ) : (
              <div className="space-y-3 mt-2">
                {sessionDates.map((dateKey) => {
                  const sessionRows = sessions[dateKey];
                  const first = sessionRows[0];
                  return (
                    <div key={dateKey} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                      {/* Session header */}
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-700">
                          Contrôle du {formatDate(first.date_controle)}
                        </span>
                        {first.date_prochaine && (
                          <span className="text-xs text-slate-500">
                            Prochaine (archivée) : {formatDate(first.date_prochaine)}
                          </span>
                        )}
                      </div>
                      {/* Session rows */}
                      <table className="min-w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50">
                            {['Position', 'Cosse', 'Fil', 'Traction min.', 'Val.1', 'Val.2', 'Val.3', 'Val.4', 'Val.5', 'Moy.', 'Statut'].map((h) => (
                              <th key={h} className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {sessionRows.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50">
                              <td className="px-3 py-2 font-mono">{r.position ?? '—'}</td>
                              <td className="px-3 py-2">{r.cosse ?? '—'}</td>
                              <td className="px-3 py-2">{r.fil ?? '—'}</td>
                              <td className="px-3 py-2 font-mono">{r.traction_minimale_n ?? '—'}</td>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <td key={n} className="px-3 py-2 font-mono text-slate-600">{r[`test_value_${n}`] ?? '—'}</td>
                              ))}
                              <td className="px-3 py-2 font-semibold text-slate-800">{r.moyenne ?? '—'}</td>
                              <td className="px-3 py-2">
                                {r.statut_verification ? (
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                    r.statut_verification === 'Conforme' ? 'bg-emerald-50 text-emerald-700' :
                                    r.statut_verification === 'Non-conforme' ? 'bg-red-50 text-red-700' :
                                    'bg-amber-50 text-amber-700'
                                  }`}>{r.statut_verification}</span>
                                ) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

const PincesList = ({ searchQuery = '' }) => {
  const [pinces, setPinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPince, setEditingPince] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => { loadPinces(); }, []);

  const loadPinces = async () => {
    try {
      setLoading(true);
      const response = await pinceService.getAll();
      setPinces(response.data);
    } catch (error) {
      console.error('Erreur chargement pinces:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = pinces.filter((p) =>
    p.numero_pince?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.Fabricant?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.reference_pince?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPinceSortKey = (numero = '') => {
    const base = numero.toUpperCase().split('+')[0] || '';
    const match = base.match(/^P(\d{1,3})$/);
    return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
  };

  const sorted = [...filtered].sort((a, b) => {
    const ka = getPinceSortKey(a.numero_pince);
    const kb = getPinceSortKey(b.numero_pince);
    if (ka !== kb) return ka - kb;
    return (a.numero_pince || '').localeCompare(b.numero_pince || '', 'fr', { numeric: true });
  });

  const handleEditClick = (pince) => { setEditingPince(pince); setIsFormOpen(true); };
  const handleFormClose = () => { setIsFormOpen(false); setEditingPince(null); };
  const handleFormSuccess = () => { loadPinces(); };

  const handleDeleteClick = async (pince) => {
    if (!window.confirm(`Supprimer ${pince.numero_pince} ?`)) return;
    try {
      await pinceService.delete(pince.id);
      loadPinces();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Chargement des pinces…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Pinces de sertissage</p>
              <p className="text-xs text-slate-400">{sorted.length} pince(s)</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingPince(null); setIsFormOpen(true); }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvelle pince
          </button>
        </div>

        <div className="overflow-auto flex-1">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">N° Pince</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Constructeur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Remarque</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <PackageOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm text-slate-400">Aucune pince trouvée</p>
                  </td>
                </tr>
              ) : sorted.map((pince) => (
                <React.Fragment key={pince.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-sky-600 whitespace-nowrap">{pince.numero_pince}</td>
                    <td className="px-4 py-3 text-slate-700">{pince.Fabricant?.nom || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{pince.reference_pince || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge statut={pince.statut} /></td>
                    <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate" title={pince.remarque}>{pince.remarque || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEditClick(pince)} title="Modifier"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteClick(pince)} title="Supprimer"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Historique drawer — only shown when pince has a numero_pince to match preventive records */}
                  {pince.numero_pince && <HistoriqueDrawer numeroPince={pince.numero_pince} />}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PinceForm pince={editingPince} isOpen={isFormOpen} onClose={handleFormClose} onSuccess={handleFormSuccess} />
    </>
  );
};

export default PincesList;
