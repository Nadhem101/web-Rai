import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { equipementService } from '../../services/api';
import PincesList from '../../components/PincesList';
import ApplicateursList from '../../components/ApplicateursList';
import CossesList from '../../components/CossesList';
import PinceForm from '../../components/PinceForm';
import ApplicateurForm from '../../components/ApplicateurForm';
import EquipementForm from '../../components/EquipementForm';
import {
  Search, Plus, Pencil, Trash2, Package, Wrench, Zap,
  Link2, Flame, Box, MapPin, CheckCircle2, XCircle,
  AlertTriangle, PackageOpen,
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────
const normalizeZoneName = (value) => {
  if (!value) return '';
  return value.toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
};
const normalizeText = (value) => {
  if (!value) return '';
  return value.toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
};
const PDR_LOW_STOCK_THRESHOLD = 1;
const formatPdrCell = (value) => value || '—';
const parsePdrQuantity = (value) => {
  const normalized = String(value ?? '').replace(',', '.').trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};
const hasPdrDetails = (eq) => Boolean(eq.pdr_details && Object.keys(eq.pdr_details).length > 0);
const isFerEtBainItem = (eq) => {
  const d = normalizeText(eq.designation);
  const c = normalizeText(eq.categorie);
  return c === 'fer-et-bain' || d.includes('fer a souder') || d.includes('bain creuset');
};

// ── Status badge ───────────────────────────────────────────
const StatusBadge = ({ statut }) => {
  const cfg = {
    'En service':    { dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'Hors service':  { dot: 'bg-red-500',     cls: 'bg-red-50 text-red-700 border-red-200' },
    'En maintenance':{ dot: 'bg-amber-400',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  }[statut] ?? { dot: 'bg-slate-400', cls: 'bg-slate-50 text-slate-600 border-slate-200' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {statut}
    </span>
  );
};

// ── PDR quantity pill ──────────────────────────────────────
const PdrQtyPill = ({ value }) => {
  const qty = parsePdrQuantity(value);
  let cls = 'bg-slate-50 border-slate-200 text-slate-500';
  if (qty !== null) {
    if (qty === 0) cls = 'bg-red-50 border-red-200 text-red-700';
    else if (qty <= PDR_LOW_STOCK_THRESHOLD) cls = 'bg-amber-50 border-amber-200 text-amber-700';
    else cls = 'bg-emerald-50 border-emerald-200 text-emerald-700';
  }
  return (
    <span className={`inline-flex min-w-[2.5rem] items-center justify-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {formatPdrCell(value)}
    </span>
  );
};

// ── Category config ────────────────────────────────────────
const CATEGORY_CONFIG = {
  'equipement-all': { label: 'Tous les équipements', icon: Package,  color: 'text-slate-500' },
  pinces:           { label: 'Pinces',               icon: Wrench,   color: 'text-sky-500' },
  applicateurs:     { label: 'Applicateurs',         icon: Zap,      color: 'text-amber-500' },
  cosses:           { label: 'Cosses',               icon: Link2,    color: 'text-indigo-500' },
  'fer-et-bain':    { label: 'Fer et bain',          icon: Flame,    color: 'text-orange-500' },
  pdr:              { label: 'PDR — Pièces de rechange', icon: Box,  color: 'text-purple-500' },
};

const getSearchPlaceholder = (categorie) => {
  const map = {
    pinces: 'Rechercher une pince, un fabricant ou une référence…',
    applicateurs: 'Rechercher un applicateur, une référence ou un constructeur…',
    cosses: 'Rechercher une cosse, une référence ou un outillage…',
    'fer-et-bain': 'Rechercher un fer à souder ou un bain creuset…',
    pdr: 'Rechercher une pièce de rechange, une référence ou un applicateur…',
  };
  return map[categorie] ?? 'Rechercher par code ou désignation…';
};

// ── Main component ─────────────────────────────────────────
const ListeEquipements = () => {
  const [searchParams] = useSearchParams();
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingEquipement, setEditingEquipement] = useState(null);

  const rawCategorie = searchParams.get('categorie') || 'equipement-all';
  const categorie = rawCategorie === 'all' || rawCategorie === 'equipement' ? 'equipement-all' : rawCategorie;
  const isSpecialCatalogue = ['pinces', 'applicateurs', 'cosses'].includes(categorie);
  const canUseGenericCrud = !isSpecialCatalogue;

  const catConfig = CATEGORY_CONFIG[categorie] ?? { label: 'Équipements', icon: MapPin, color: 'text-slate-500' };
  const CategoryIcon = catConfig.icon;

  const defaultEquipmentCategory = categorie === 'pdr' ? 'pdr' : categorie === 'fer-et-bain' ? 'fer-et-bain' : 'equipement';
  const defaultZoneName = categorie.startsWith('zone:') ? categorie.slice(5) : '';

  useEffect(() => {
    if (isSpecialCatalogue) { setLoading(false); return; }
    loadEquipements();
  }, [categorie]);

  const loadEquipements = async () => {
    try {
      setLoading(true);
      const response = await equipementService.getAll();
      setEquipements(response.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEquipements = () => {
    if (isSpecialCatalogue) return [];
    let filtered = equipements;

    const allowedCategories =
      categorie === 'pdr' ? ['pdr'] :
      categorie === 'fer-et-bain' ? ['equipement', 'pdr', 'fer-et-bain'] :
      categorie.startsWith('zone:') ? ['equipement', 'fer-et-bain'] :
      ['equipement', 'pdr', 'fer-et-bain'];

    filtered = filtered.filter((eq) => {
      const nc = normalizeText(eq.categorie);
      if (categorie === 'pdr') return nc === 'pdr' || hasPdrDetails(eq);
      return allowedCategories.includes(nc);
    });

    if (categorie === 'fer-et-bain') filtered = filtered.filter(isFerEtBainItem);

    if (categorie.startsWith('zone:')) {
      const selected = normalizeZoneName(categorie.slice(5));
      filtered = filtered.filter((eq) => {
        if (!eq.Zone?.nom_zone) return false;
        return normalizeZoneName(eq.Zone.nom_zone) === selected;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((eq) =>
        eq.code_rai?.toLowerCase().includes(q) ||
        eq.designation?.toLowerCase().includes(q) ||
        eq.numero_serie?.toLowerCase().includes(q) ||
        eq.remarque?.toLowerCase().includes(q) ||
        JSON.stringify(eq.pdr_details || {}).toLowerCase().includes(q)
      );
    }

    return filtered;
  };

  const filteredEquipements = getFilteredEquipements();

  const categoryTitle = categorie.startsWith('zone:')
    ? categorie.slice(5)
    : catConfig.label;

  const categorySummary = (() => {
    if (categorie === 'pinces') return 'Catalogue des pinces de sertissage';
    if (categorie === 'applicateurs') return 'Catalogue des applicateurs faisceaux';
    if (categorie === 'cosses') return 'Références groupées par constructeur, réf. TEC et outillage';
    if (categorie === 'fer-et-bain') return 'Fers à souder et bains creusets';
    if (categorie === 'pdr') return 'Stock des pièces de rechange';
    return `${filteredEquipements.length} équipement(s) trouvé(s)`;
  })();

  const handleFormClose = () => { setIsCreatingNew(false); setEditingEquipement(null); };
  const handleFormSuccess = () => { setIsCreatingNew(false); setEditingEquipement(null); loadEquipements(); };
  const handleCreateClick = () => { setEditingEquipement(null); setIsCreatingNew(true); };
  const handleEditClick = (eq) => { setEditingEquipement(eq); setIsCreatingNew(true); };

  const handleDeleteClick = async (eq) => {
    if (!window.confirm(`Supprimer ${eq.code_rai} ?`)) return;
    try {
      await equipementService.delete(eq.id);
      loadEquipements();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const isPdr = categorie === 'pdr';

  return (
    <div className="p-6 flex-1 overflow-auto flex flex-col gap-5">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0`}>
            <CategoryIcon className={`w-5 h-5 ${catConfig.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">{categoryTitle}</h1>
              {!isSpecialCatalogue && !loading && (
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {filteredEquipements.length}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{categorySummary}</p>
          </div>
        </div>

        {canUseGenericCrud && (
          <button
            type="button"
            onClick={handleCreateClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}
          >
            <Plus className="w-4 h-4" />
            Nouvel équipement
          </button>
        )}
      </div>

      {/* ── Search ──────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={getSearchPlaceholder(categorie)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            onClick={() => setSearch('')}
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Chargement…</p>
          </div>
        </div>

      ) : categorie === 'pinces' ? (
        <PincesList searchQuery={search} />

      ) : categorie === 'applicateurs' ? (
        <ApplicateursList searchQuery={search} />

      ) : categorie === 'cosses' ? (
        <CossesList searchQuery={search} />

      ) : filteredEquipements.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400">
          <PackageOpen className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm font-medium">
            {isPdr ? 'Aucune pièce de rechange trouvée' : 'Aucun équipement trouvé'}
          </p>
          {search && (
            <button className="mt-2 text-xs text-sky-500 hover:underline" onClick={() => setSearch('')}>
              Effacer la recherche
            </button>
          )}
        </div>

      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="overflow-auto flex-1">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Code RAI</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Désignation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">N° Série</th>
                  {isPdr && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Lame cuivre réf.</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Qté</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Lame isolant réf.</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Qté</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Enclume cuivre réf.</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Qté</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Enclume isolant réf.</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Qté</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Zone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Fabricant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Statut</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEquipements.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700 whitespace-nowrap">
                      {eq.code_rai}
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-[220px] truncate" title={eq.designation}>
                      {eq.designation}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {eq.numero_serie || '—'}
                    </td>
                    {isPdr && (
                      <>
                        <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{formatPdrCell(eq.pdr_details?.lame_cuivre?.reference)}</td>
                        <td className="px-4 py-3 text-center"><PdrQtyPill value={eq.pdr_details?.lame_cuivre?.quantity} /></td>
                        <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{formatPdrCell(eq.pdr_details?.lame_isolant?.reference)}</td>
                        <td className="px-4 py-3 text-center"><PdrQtyPill value={eq.pdr_details?.lame_isolant?.quantity} /></td>
                        <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{formatPdrCell(eq.pdr_details?.enclume_cuivre?.reference)}</td>
                        <td className="px-4 py-3 text-center"><PdrQtyPill value={eq.pdr_details?.enclume_cuivre?.quantity} /></td>
                        <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{formatPdrCell(eq.pdr_details?.enclume_isolant?.reference)}</td>
                        <td className="px-4 py-3 text-center"><PdrQtyPill value={eq.pdr_details?.enclume_isolant?.quantity} /></td>
                      </>
                    )}
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{eq.Zone?.nom_zone || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{eq.Fabricant?.nom || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge statut={eq.statut} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditClick(eq)}
                          title="Modifier"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(eq)}
                          title="Supprimer"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
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
      )}

      {/* ── Forms ───────────────────────────────────────── */}
      {categorie === 'pinces' && (
        <PinceForm pince={null} isOpen={isCreatingNew} onClose={handleFormClose} onSuccess={handleFormSuccess} />
      )}
      {categorie === 'applicateurs' && (
        <ApplicateurForm applicateur={null} isOpen={isCreatingNew} onClose={handleFormClose} onSuccess={handleFormSuccess} />
      )}
      {canUseGenericCrud && (
        <EquipementForm
          equipement={editingEquipement}
          isOpen={isCreatingNew}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          defaultCategory={defaultEquipmentCategory}
          defaultZoneName={defaultZoneName}
        />
      )}
    </div>
  );
};

export default ListeEquipements;
