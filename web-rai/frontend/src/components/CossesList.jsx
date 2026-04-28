import React, { useEffect, useMemo, useState } from 'react';
import { cosseService } from '../services/api';
import CosseForm from './CosseForm';

const normalizeText = (value = '') =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const formatValue = (value) => (value === null || value === undefined || value === '' ? '-' : value);

const parseNumericValue = (value) => {
  const normalized = String(value ?? '').replace(',', '.').trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const compareText = (left, right) =>
  String(left ?? '').localeCompare(String(right ?? ''), 'fr', { numeric: true, sensitivity: 'base' });

const compareMeasurements = (left, right) => {
  const leftNumeric = parseNumericValue(left);
  const rightNumeric = parseNumericValue(right);

  if (leftNumeric !== null && rightNumeric !== null && leftNumeric !== rightNumeric) {
    return leftNumeric - rightNumeric;
  }

  return compareText(left, right);
};

const getCosseGroupKey = (cosse) => {
  const keyParts = [
    normalizeText(cosse.reference_constructeur),
    normalizeText(cosse.reference_tec),
    normalizeText(cosse.designation_tec),
    normalizeText(cosse.outillage),
  ];

  if (keyParts.every((part) => part === '')) {
    return `record-${cosse.id}`;
  }

  return keyParts.join('|');
};

const compareGroupRows = (left, right) => {
  const sectionCompare = compareMeasurements(left.section_mm2, right.section_mm2);
  if (sectionCompare !== 0) return sectionCompare;

  const awgCompare = compareMeasurements(left.section_awg, right.section_awg);
  if (awgCompare !== 0) return awgCompare;

  const tractionCompare = compareText(left.tenue_traction_n, right.tenue_traction_n);
  if (tractionCompare !== 0) return tractionCompare;

  const denudageCompare = compareText(left.longueur_denudage_mm, right.longueur_denudage_mm);
  if (denudageCompare !== 0) return denudageCompare;

  return compareText(left.id ?? 0, right.id ?? 0);
};

const compareGroups = (left, right) => {
  const constructorCompare = compareText(left.reference_constructeur, right.reference_constructeur);
  if (constructorCompare !== 0) return constructorCompare;

  const tecCompare = compareText(left.reference_tec, right.reference_tec);
  if (tecCompare !== 0) return tecCompare;

  const designationCompare = compareText(left.designation_tec, right.designation_tec);
  if (designationCompare !== 0) return designationCompare;

  const outillageCompare = compareText(left.outillage, right.outillage);
  if (outillageCompare !== 0) return outillageCompare;

  const sectionCompare = compareMeasurements(left.rows[0]?.section_mm2, right.rows[0]?.section_mm2);
  if (sectionCompare !== 0) return sectionCompare;

  return compareText(left.rows[0]?.id ?? 0, right.rows[0]?.id ?? 0);
};

const buildGroupedCosses = (cosses) => {
  const groups = new Map();

  cosses.forEach((cosse) => {
    const groupKey = getCosseGroupKey(cosse);

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        key: groupKey,
        reference_constructeur: cosse.reference_constructeur ?? null,
        reference_tec: cosse.reference_tec ?? null,
        designation_tec: cosse.designation_tec ?? null,
        outillage: cosse.outillage ?? null,
        rows: [],
      });
    }

    groups.get(groupKey).rows.push(cosse);
  });

  return Array.from(groups.values())
    .map((group) => {
      const rows = [...group.rows].sort(compareGroupRows);

      return {
        ...group,
        rows,
        sharedFields: {
          reference_constructeur: { shared: true, value: group.reference_constructeur },
          reference_tec: { shared: true, value: group.reference_tec },
          designation_tec: { shared: true, value: group.designation_tec },
          outillage: { shared: true, value: group.outillage },
        },
      };
    })
    .sort(compareGroups);
};

const CossesList = ({ searchQuery = '' }) => {
  const [cosses, setCosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCosse, setEditingCosse] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadCosses();
  }, []);

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
  const filteredCosses = useMemo(() => {
    return cosses.filter((cosse) => {
      if (!normalizedSearch) return true;

      return [
        cosse.reference_constructeur,
        cosse.reference_tec,
        cosse.designation_tec,
        cosse.outillage,
        cosse.section_awg,
        cosse.section_mm2,
        cosse.tenue_traction_n,
        cosse.longueur_denudage_mm,
        cosse.observation,
      ].some((field) => normalizeText(field).includes(normalizedSearch));
    });
  }, [cosses, normalizedSearch]);

  const groupedCosses = useMemo(() => buildGroupedCosses(filteredCosses), [filteredCosses]);

  const renderMergedCell = (group, field, row, rowIndex, className, renderContent) => {
    const sharedField = group.sharedFields[field];

    if (sharedField?.shared) {
      if (rowIndex !== 0) return null;
      return (
        <td rowSpan={group.rows.length} className={className}>
          {renderContent(sharedField.value, true)}
        </td>
      );
    }

    return <td className={className}>{renderContent(row[field], false)}</td>;
  };

  const handleCreateClick = () => {
    setEditingCosse(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (cosse) => {
    setEditingCosse(cosse);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (cosse) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${formatValue(cosse.reference_constructeur)} / ${formatValue(
        cosse.reference_tec
      )} / ${formatValue(cosse.designation_tec)} / ${formatValue(cosse.outillage)} ?`
    );

    if (!confirmed) return;

    try {
      await cosseService.delete(cosse.id);
      loadCosses();
    } catch (error) {
      console.error('Erreur suppression cosse:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement des cosses...</div>;
  }

  if (groupedCosses.length === 0) {
    return (
      <>
        <div className="bg-white rounded-xl shadow overflow-hidden flex-1 min-h-0 flex flex-col">
          <div className="px-4 py-3 border-b border-amber-100 bg-amber-50/70 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-amber-800">🔗 Cosses</h2>
              <p className="text-sm text-amber-900/70">
                Références groupées par Constructeur, Réf. TEC, Désignation et Outillage.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-amber-700">
              <span>{groupedCosses.length} groupe(s)</span>
              <span>{filteredCosses.length} ligne(s)</span>
              <button
                onClick={handleCreateClick}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                ➕ Nouvelle cosse
              </button>
            </div>
          </div>
          <div className="text-center py-8 text-gray-500">Aucune cosse trouvée</div>
        </div>

        <CosseForm
          cosse={editingCosse}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCosse(null);
          }}
          onSuccess={loadCosses}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="px-4 py-3 border-b border-amber-100 bg-amber-50/70 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-amber-800">🔗 Cosses</h2>
            <p className="text-sm text-amber-900/70">
              Références groupées par Constructeur, Réf. TEC, Désignation et Outillage.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-amber-700">
            <span>{groupedCosses.length} groupe(s)</span>
            <span>{filteredCosses.length} ligne(s)</span>
            <button
              onClick={handleCreateClick}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              ➕ Nouvelle cosse
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1 min-h-0">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-amber-600 sticky top-0 z-10 text-white">
              <tr>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Constructeur</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Réf. TEC</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Désignation</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Outillage</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">AWG</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Section mm²</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Traction</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Dénudage</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Observation</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 bg-white">
              {groupedCosses.map((group) =>
                group.rows.map((cosse, index) => {
                  const rowKey = cosse.id ?? `${group.key}-${index}`;

                  return (
                    <tr key={rowKey} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                      {renderMergedCell(group, 'reference_constructeur', cosse, index, 'px-3 py-2 align-top text-sm font-semibold text-amber-700', (value) => (
                        <span>{formatValue(value)}</span>
                      ))}

                      {renderMergedCell(group, 'reference_tec', cosse, index, 'px-3 py-2 align-top text-sm font-mono text-slate-700', (value) => (
                        <span>{formatValue(value)}</span>
                      ))}

                      {renderMergedCell(group, 'designation_tec', cosse, index, 'px-3 py-2 align-top text-sm text-slate-800', (value) => (
                        <span>{formatValue(value)}</span>
                      ))}

                      {renderMergedCell(group, 'outillage', cosse, index, 'px-3 py-2 align-top text-sm text-slate-700', (value) => (
                        <span>{formatValue(value)}</span>
                      ))}

                      <td className="px-3 py-2 align-top text-sm text-slate-700">{formatValue(cosse.section_awg)}</td>
                      <td className="px-3 py-2 align-top text-sm text-slate-700">{formatValue(cosse.section_mm2)}</td>
                      <td className="px-3 py-2 align-top text-sm text-slate-700">{formatValue(cosse.tenue_traction_n)}</td>
                      <td className="px-3 py-2 align-top text-sm text-slate-700">{formatValue(cosse.longueur_denudage_mm)}</td>
                      <td className="px-3 py-2 align-top text-sm text-slate-600">{formatValue(cosse.observation)}</td>
                      <td className="px-3 py-2 align-top text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(cosse)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteClick(cosse)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            🗑️
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
      </div>

      <CosseForm
        cosse={editingCosse}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCosse(null);
        }}
        onSuccess={loadCosses}
      />
    </>
  );
};

export default CossesList;