import React, { useState, useEffect } from 'react';
import { applicateurService } from '../services/api';
import ApplicateurDetailModal from './ApplicateurDetailModal';
import ApplicateurForm from './ApplicateurForm';
import { Plus, Pencil, Trash2, Zap, PackageOpen, Eye } from 'lucide-react';

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
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvel applicateur
          </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
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
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
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
