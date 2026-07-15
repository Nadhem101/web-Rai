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
  const c = normalizeText(eq.categorie);
  if (['fer-et-bain', 'fer-a-souder', 'bain-creuset'].includes(c)) return true;
  const d = normalizeText(eq.designation);
  return d.includes('fer a souder') || d.includes('bain creuset');
};

// ── Status badge ───────────────────────────────────────────
const StatusBadge = ({ statut }) => {
  const cfg = {
    'En service':     { bg: 'var(--ok-soft)',   color: 'var(--ok)',   dot: 'var(--ok)'   },
    'Hors service':   { bg: 'var(--crit-soft)', color: 'var(--crit)', dot: 'var(--crit)' },
    'En maintenance': { bg: 'var(--warn-soft)', color: 'var(--warn)', dot: 'var(--warn)' },
  }[statut] ?? { bg: 'var(--panel2)', color: 'var(--text3)', dot: 'var(--text3)' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[20px] text-xs font-bold"
      style={{ background: cfg.bg, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {statut}
    </span>
  );
};

// ── PDR quantity pill ──────────────────────────────────────
const PdrQtyPill = ({ value }) => {
  const qty = parsePdrQuantity(value);
  let bg = 'var(--panel2)', color = 'var(--text3)';
  if (qty !== null) {
    if (qty === 0) { bg = 'var(--crit-soft)'; color = 'var(--crit)'; }
    else if (qty <= PDR_LOW_STOCK_THRESHOLD) { bg = 'var(--warn-soft)'; color = 'var(--warn)'; }
    else { bg = 'var(--ok-soft)'; color = 'var(--ok)'; }
  }
  return (
    <span className="inline-flex min-w-[2.5rem] items-center justify-center rounded-[20px] px-2 py-0.5 text-xs font-bold"
      style={{ background: bg, color }}>
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
    <div className="px-[26px] pt-6 pb-10 flex-1 overflow-auto flex flex-col gap-[18px]" style={{ background: 'var(--bg)' }}>

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)' }}>
            <CategoryIcon className={`w-5 h-5 ${catConfig.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>{categoryTitle}</h1>
              {!isSpecialCatalogue && !loading && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-[20px]" style={{ background: 'var(--panel2)', color: 'var(--text3)' }}>
                  {filteredEquipements.length}
                </span>
              )}
            </div>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>{categorySummary}</p>
          </div>
        </div>

        {canUseGenericCrud && (
          <button type="button" onClick={handleCreateClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
            <Plus className="w-4 h-4" /> Nouvel équipement
          </button>
        )}
      </div>

      {/* ── Search ──────────────────────────────────────── */}
      <div className="relative max-w-[520px]">
        <Search className="absolute left-[13px] top-1/2 -translate-y-1/2 w-[15px] h-[15px] pointer-events-none" style={{ color: 'var(--text3)' }} />
        <input type="text" placeholder={getSearchPlaceholder(categorie)}
          className="w-full pl-10 pr-4 py-[11px] rounded-[11px] text-[13px] outline-none transition-colors"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }}
          value={search} onChange={(e) => setSearch(e.target.value)} />
        {search && (
          <button className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70" style={{ color: 'var(--text3)' }} onClick={() => setSearch('')}>
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
            <p className="text-sm" style={{ color: 'var(--text3)' }}>Chargement…</p>
          </div>
        </div>

      ) : categorie === 'pinces' ? (
        <PincesList searchQuery={search} />

      ) : categorie === 'applicateurs' ? (
        <ApplicateursList searchQuery={search} />

      ) : categorie === 'cosses' ? (
        <CossesList searchQuery={search} />

      ) : filteredEquipements.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16" style={{ color: 'var(--text3)' }}>
          <PackageOpen className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm font-medium">
            {isPdr ? 'Aucune pièce de rechange trouvée' : 'Aucun équipement trouvé'}
          </p>
          {search && (
            <button className="mt-2 text-xs hover:underline" style={{ color: 'var(--accent)' }} onClick={() => setSearch('')}>
              Effacer la recherche
            </button>
          )}
        </div>

      ) : (
        <div className="rounded-[14px] overflow-hidden flex-1 flex flex-col min-h-0"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <div className="overflow-auto flex-1">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                  {['Code RAI','Désignation','N° Série',
                    ...(isPdr ? ['Lame cuivre réf.','Qté','Lame isolant réf.','Qté','Enclume cuivre réf.','Qté','Enclume isolant réf.','Qté','Lame dénudage qté'] : []),
                    'Zone','Fabricant','Statut','Actions'].map(h => (
                    <th key={h} className={`px-3.5 py-2.5 text-left whitespace-nowrap ${h==='Actions'?'text-center':''}`}>
                      <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text3)' }}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEquipements.map((eq) => (
                  <tr key={eq.id} className="transition-colors hover:bg-[var(--panel2)] group" style={{ borderBottom: '1px solid var(--border2)' }}>
                    <td className="px-3.5 py-2.5 font-mono text-xs font-bold whitespace-nowrap" style={{ color: 'var(--accent)' }}>{eq.code_rai}</td>
                    <td className="px-3.5 py-2.5 max-w-[220px] truncate" style={{ color: 'var(--text)' }} title={eq.designation}>{eq.designation}</td>
                    <td className="px-3.5 py-2.5 text-xs whitespace-nowrap font-mono" style={{ color: 'var(--text3)' }}>{eq.numero_serie || '—'}</td>
                    {isPdr && (
                      <>
                        <td className="px-3.5 py-2.5 text-xs whitespace-nowrap" style={{ color: 'var(--text2)' }}>{formatPdrCell(eq.pdr_details?.lame_cuivre?.reference)}</td>
                        <td className="px-3.5 py-2.5 text-center"><PdrQtyPill value={eq.pdr_details?.lame_cuivre?.quantity} /></td>
                        <td className="px-3.5 py-2.5 text-xs whitespace-nowrap" style={{ color: 'var(--text2)' }}>{formatPdrCell(eq.pdr_details?.lame_isolant?.reference)}</td>
                        <td className="px-3.5 py-2.5 text-center"><PdrQtyPill value={eq.pdr_details?.lame_isolant?.quantity} /></td>
                        <td className="px-3.5 py-2.5 text-xs whitespace-nowrap" style={{ color: 'var(--text2)' }}>{formatPdrCell(eq.pdr_details?.enclume_cuivre?.reference)}</td>
                        <td className="px-3.5 py-2.5 text-center"><PdrQtyPill value={eq.pdr_details?.enclume_cuivre?.quantity} /></td>
                        <td className="px-3.5 py-2.5 text-xs whitespace-nowrap" style={{ color: 'var(--text2)' }}>{formatPdrCell(eq.pdr_details?.enclume_isolant?.reference)}</td>
                        <td className="px-3.5 py-2.5 text-center"><PdrQtyPill value={eq.pdr_details?.enclume_isolant?.quantity} /></td>
                        <td className="px-3.5 py-2.5 text-center"><PdrQtyPill value={eq.pdr_details?.lame_denudage?.quantity} /></td>
                      </>
                    )}
                    <td className="px-3.5 py-2.5 text-xs whitespace-nowrap" style={{ color: 'var(--text3)' }}>{eq.Zone?.nom_zone || '—'}</td>
                    <td className="px-3.5 py-2.5 text-xs whitespace-nowrap" style={{ color: 'var(--text3)' }}>{eq.Fabricant?.nom || '—'}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap"><StatusBadge statut={eq.statut} /></td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <button type="button" onClick={() => handleEditClick(eq)} title="Modifier"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                          style={{ color: 'var(--text3)' }}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => handleDeleteClick(eq)} title="Supprimer"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                          style={{ color: 'var(--text3)' }}>
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
