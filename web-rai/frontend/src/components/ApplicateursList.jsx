import React, { useState, useEffect } from 'react';
import { applicateurService, applicateurPreventiveService } from '../services/api';
import ApplicateurDetailModal from './ApplicateurDetailModal';
import ApplicateurForm from './ApplicateurForm';
import { Plus, Pencil, Trash2, Zap, PackageOpen, Eye, History, ChevronDown, ChevronUp } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return '—';
  const parts = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (parts) return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])).toLocaleDateString('fr-FR');
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('fr-FR');
};

// Collapsible history drawer for one applicateur
const HistoriqueDrawer = ({ numeroOutil }) => {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const toggle = async () => {
    if (!open && !fetched) {
      setLoading(true);
      try {
        const data = await applicateurPreventiveService.getHistoriqueByOutil(numeroOutil);
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

  const sessions = records.reduce((acc, r) => {
    const key = r.date_controle ?? 'sans-date';
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
  const sessionDates = Object.keys(sessions).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <tr className="bg-amber-50/30">
        <td colSpan={8} className="px-4 py-1.5">
          <button onClick={toggle}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-800 transition-colors">
            <History className="w-3.5 h-3.5" />
            Historique des maintenances
            {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {fetched && records.length > 0 && (
              <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
                {sessionDates.length} session(s)
              </span>
            )}
          </button>
        </td>
      </tr>

      {open && (
        <tr>
          <td colSpan={8} className="px-4 pb-4 bg-slate-50/60">
            {loading ? (
              <div className="flex items-center gap-2 py-3 text-xs text-slate-400">
                <div className="w-4 h-4 border-2 border-amber-100 border-t-amber-400 rounded-full animate-spin" />
                Chargement de l'historique…
              </div>
            ) : records.length === 0 ? (
              <p className="py-3 text-xs text-slate-400 italic">Aucun historique disponible pour cet applicateur.</p>
            ) : (
              <div className="space-y-3 mt-2">
                {sessionDates.map((dateKey) => {
                  const sessionRows = sessions[dateKey];
                  const first = sessionRows[0];
                  return (
                    <div key={dateKey} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-700">Contrôle du {formatDate(first.date_controle)}</span>
                        {first.date_prochaine && (
                          <span className="text-xs text-slate-500">Prochaine (archivée) : {formatDate(first.date_prochaine)}</span>
                        )}
                      </div>
                      <table className="min-w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50">
                            {['Section mm²', 'Seuil N', 'Dénudage', 'Val.1', 'Val.2', 'Val.3', 'Val.4', 'Val.5', 'Moy.', 'Statut'].map((h) => (
                              <th key={h} className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {sessionRows.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50">
                              <td className="px-3 py-2 font-mono">{r.section_mm2 ?? '—'}</td>
                              <td className="px-3 py-2 font-mono">{r.seuil_n ?? '—'}</td>
                              <td className="px-3 py-2">{r.longueur_denudage ?? '—'}</td>
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

const normalizeText = (value = '') =>
  value.toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const StatusBadge = ({ statut }) => {
  const cfg = {
    'en service':  { dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'hors service':{ dot: 'bg-red-500',     cls: 'bg-red-50 text-red-700 border-red-200' },
  }[statut?.toLowerCase()] ?? { dot: 'bg-amber-400', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
  const label = statut === 'en service' ? 'En service' : statut === 'hors service' ? 'Hors service' : 'À vérifier';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {label}
    </span>
  );
};

const ApplicateursList = ({ searchQuery = '' }) => {
  const [applicateurs, setApplicateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicateur, setSelectedApplicateur] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingApplicateur, setEditingApplicateur] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => { fetchApplicateurs(); }, []);

  const fetchApplicateurs = async () => {
    try {
      setLoading(true);
      const response = await applicateurService.getAll();
      setApplicateurs(response);
    } catch (error) {
      console.error('Erreur chargement applicateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizedSearch = normalizeText(searchQuery);
  const filtered = applicateurs.filter((a) => {
    if (!normalizedSearch) return true;
    return [
      a.numero_outil, a.designation, a.constructeur_outil, a.numero_serie, a.site, a.statut,
      ...(a.variants || []).map((v) => `${v.reference_constructeur || ''} ${v.reference_tec || ''}`),
    ].some((f) => normalizeText(f).includes(normalizedSearch));
  });

  const sorted = [...filtered].sort((a, b) =>
    (a.numero_outil || '').localeCompare(b.numero_outil || '', 'fr', { numeric: true })
  );

  const handleDetailClick  = (a) => { setSelectedApplicateur(a); setShowModal(true); };
  const handleEditClick    = (a) => { setEditingApplicateur(a); setIsFormOpen(true); };
  const handleFormClose    = () => { setIsFormOpen(false); setEditingApplicateur(null); };
  const handleFormSuccess  = () => { fetchApplicateurs(); };

  const handleDeleteClick = async (a) => {
    if (!window.confirm(`Supprimer ${a.numero_outil} ?`)) return;
    try {
      await applicateurService.delete(a.id);
      fetchApplicateurs();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Chargement des applicateurs…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-0">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
        {/* Sub-header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Applicateurs faisceaux</p>
              <p className="text-xs text-slate-400">{sorted.length} applicateur(s)</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingApplicateur(null); setIsFormOpen(true); }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
            style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvel applicateur
          </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">N° Outil</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Désignation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Constructeur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">N° Série</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Cosses</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Statut</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <PackageOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm text-slate-400">Aucun applicateur trouvé</p>
                  </td>
                </tr>
              ) : sorted.map((a) => (
                <React.Fragment key={a.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-amber-600 whitespace-nowrap">{a.numero_outil}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-[180px] truncate" title={a.designation}>{a.designation || '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{a.constructeur_outil || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.numero_serie || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        {a.variants?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge statut={a.statut} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleDetailClick(a)} title="Voir les détails"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleEditClick(a)} title="Modifier"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteClick(a)} title="Supprimer"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {a.numero_outil && <HistoriqueDrawer numeroOutil={a.numero_outil} />}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ApplicateurDetailModal
        applicateur={selectedApplicateur}
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedApplicateur(null); }}
      />
      <ApplicateurForm
        applicateur={editingApplicateur}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default ApplicateursList;
