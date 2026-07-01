import React, { useEffect, useMemo, useState } from 'react';
import { cosseService } from '../services/api';
import CosseForm from './CosseForm';
import { Plus, Pencil, Trash2, Link2, PackageOpen } from 'lucide-react';

const normalizeText = (value = '') =>
  String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const formatValue = (value) =>
  (value === null || value === undefined || value === '') ? '—' : value;

const parseNumericValue = (value) => {
  const n = String(value ?? '').replace(',', '.').trim();
  if (!n) return null;
  const p = Number(n);
  return Number.isFinite(p) ? p : null;
};

const compareText = (a, b) =>
  String(a ?? '').localeCompare(String(b ?? ''), 'fr', { numeric: true, sensitivity: 'base' });

const compareMeasurements = (a, b) => {
  const na = parseNumericValue(a);
  const nb = parseNumericValue(b);
  if (na !== null && nb !== null && na !== nb) return na - nb;
  return compareText(a, b);
};

const getCosseGroupKey = (cosse) => {
  const parts = [
    normalizeText(cosse.reference_constructeur),
    normalizeText(cosse.reference_tec),
    normalizeText(cosse.designation_tec),
    normalizeText(cosse.outillage),
  ];
  return parts.every((p) => p === '') ? `record-${cosse.id}` : parts.join('|');
};

const compareGroupRows = (a, b) => {
  const s = compareMeasurements(a.section_mm2, b.section_mm2);  if (s !== 0) return s;
  const w = compareMeasurements(a.section_awg, b.section_awg);  if (w !== 0) return w;
  const t = compareText(a.tenue_traction_n, b.tenue_traction_n); if (t !== 0) return t;
  const d = compareText(a.longueur_denudage_mm, b.longueur_denudage_mm); if (d !== 0) return d;
  return compareText(a.id ?? 0, b.id ?? 0);
};

const compareGroups = (a, b) => {
  const c = compareText(a.reference_constructeur, b.reference_constructeur); if (c !== 0) return c;
  const t = compareText(a.reference_tec, b.reference_tec);                   if (t !== 0) return t;
  const d = compareText(a.designation_tec, b.designation_tec);               if (d !== 0) return d;
  const o = compareText(a.outillage, b.outillage);                            if (o !== 0) return o;
  const s = compareMeasurements(a.rows[0]?.section_mm2, b.rows[0]?.section_mm2); if (s !== 0) return s;
  return compareText(a.rows[0]?.id ?? 0, b.rows[0]?.id ?? 0);
};

const buildGroupedCosses = (cosses) => {
  const groups = new Map();
  cosses.forEach((cosse) => {
    const key = getCosseGroupKey(cosse);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        reference_constructeur: cosse.reference_constructeur ?? null,
        reference_tec: cosse.reference_tec ?? null,
        designation_tec: cosse.designation_tec ?? null,
        outillage: cosse.outillage ?? null,
        rows: [],
      });
    }
    groups.get(key).rows.push(cosse);
  });
  return Array.from(groups.values())
    .map((g) => ({ ...g, rows: [...g.rows].sort(compareGroupRows) }))
    .sort(compareGroups);
};

const CossesList = ({ searchQuery = '' }) => {
  const [cosses, setCosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCosse, setEditingCosse] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => { loadCosses(); }, []);

  const loadCosses = async () => {
    try {
      setLoading(true);
      const response = await cosseService.getAll();
      setCosses(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erreur chargement cosses:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizedSearch = normalizeText(searchQuery);
  const filteredCosses = useMemo(() =>
    cosses.filter((c) => {
      if (!normalizedSearch) return true;
      return [c.reference_constructeur, c.reference_tec, c.designation_tec, c.outillage,
        c.section_awg, c.section_mm2, c.tenue_traction_n, c.longueur_denudage_mm, c.observation,
      ].some((f) => normalizeText(f).includes(normalizedSearch));
    }), [cosses, normalizedSearch]);

  const groupedCosses = useMemo(() => buildGroupedCosses(filteredCosses), [filteredCosses]);

  const handleCreateClick = () => { setEditingCosse(null); setIsFormOpen(true); };
  const handleEditClick   = (c) => { setEditingCosse(c); setIsFormOpen(true); };
  const handleFormClose   = () => { setIsFormOpen(false); setEditingCosse(null); };

  const handleDeleteClick = async (cosse) => {
    const confirmed = window.confirm(
      `Supprimer ${formatValue(cosse.reference_constructeur)} / ${formatValue(cosse.reference_tec)} ?`
    );
    if (!confirmed) return;
    try {
      await cosseService.delete(cosse.id);
      loadCosses();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const renderMergedCell = (group, field, row, rowIndex, className, renderContent) => {
    if (rowIndex !== 0) return null;
    return (
      <td rowSpan={group.rows.length} className={className}>
        {renderContent(group[field])}
      </td>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Chargement des cosses…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
        {/* Sub-header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Cosses de sertissage</p>
              <p className="text-xs text-slate-400">
                {groupedCosses.length} groupe(s) · {filteredCosses.length} ligne(s)
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateClick}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
            style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvelle cosse
          </button>
        </div>

        {groupedCosses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400">
            <PackageOpen className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm font-medium">Aucune cosse trouvée</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1 min-h-0">
            <table className="min-w-full text-xs border-collapse">
              <thead>
                <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                  <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Constructeur</th>
                  <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Réf. TEC</th>
                  <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500">Désignation</th>
                  <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500">Outillage</th>
                  <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider text-slate-500">AWG</th>
                  <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">mm²</th>
                  <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider text-slate-500">Traction</th>
                  <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider text-slate-500">Dénudage</th>
                  <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500">Observation</th>
                  <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedCosses.map((group, groupIdx) =>
                  group.rows.map((cosse, rowIndex) => {
                    const rowKey = cosse.id ?? `${group.key}-${rowIndex}`;
                    const isFirstRow = rowIndex === 0;
                    const isLastRow  = rowIndex === group.rows.length - 1;
                    const rowBg = rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/60';

                    return (
                      <tr key={rowKey}
                        className={`${rowBg} ${isLastRow && groupIdx < groupedCosses.length - 1 ? 'border-b-2 border-slate-200' : 'border-b border-slate-100'} transition-colors hover:bg-sky-50/30`}>

                        {renderMergedCell(group, 'reference_constructeur', cosse, rowIndex,
                          'px-3 py-2 align-top font-semibold text-indigo-700 whitespace-nowrap border-l-2 border-indigo-200',
                          (v) => <span>{formatValue(v)}</span>
                        )}
                        {renderMergedCell(group, 'reference_tec', cosse, rowIndex,
                          'px-3 py-2 align-top font-mono text-slate-700',
                          (v) => <span>{formatValue(v)}</span>
                        )}
                        {renderMergedCell(group, 'designation_tec', cosse, rowIndex,
                          'px-3 py-2 align-top text-slate-700 max-w-[160px]',
                          (v) => <span className="break-words">{formatValue(v)}</span>
                        )}
                        {renderMergedCell(group, 'outillage', cosse, rowIndex,
                          'px-3 py-2 align-top',
                          (v) => v ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-mono font-semibold whitespace-nowrap">{v}</span>
                          ) : <span className="text-slate-400">—</span>
                        )}

                        <td className="px-3 py-2 text-center text-slate-600">{formatValue(cosse.section_awg)}</td>
                        <td className="px-3 py-2 text-center text-slate-600 font-mono">{formatValue(cosse.section_mm2)}</td>
                        <td className="px-3 py-2 text-center text-slate-600">{formatValue(cosse.tenue_traction_n)}</td>
                        <td className="px-3 py-2 text-center text-slate-600">{formatValue(cosse.longueur_denudage_mm)}</td>
                        <td className="px-3 py-2 text-slate-500 max-w-[140px] truncate" title={cosse.observation}>{formatValue(cosse.observation)}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleEditClick(cosse)} title="Modifier"
                              className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDeleteClick(cosse)} title="Supprimer"
                              className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CosseForm
        cosse={editingCosse}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={loadCosses}
      />
    </>
  );
};

export default CossesList;
