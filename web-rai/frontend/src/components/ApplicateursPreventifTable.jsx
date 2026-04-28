import React, { useEffect, useMemo, useState } from 'react';
import { applicateurThresholdService } from '../services/api';

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

const getGroupKey = (record) => {
  const numeroOutil = normalizeText(record.numero_outil);
  const referenceTec = normalizeText(record.reference_tec);
  const designation = normalizeText(record.designation);

  if (!numeroOutil && !referenceTec && !designation) {
    return `record-${record.id}`;
  }

  return `${numeroOutil}|${referenceTec}|${designation}`;
};

const getSharedFieldInfo = (rows, field) => {
  if (rows.length === 0) {
    return { shared: false, value: null };
  }

  const firstValue = rows[0]?.[field] ?? null;
  const firstNormalized = normalizeText(firstValue);
  const shared = rows.every((row) => normalizeText(row?.[field] ?? null) === firstNormalized);

  return shared ? { shared: true, value: firstValue } : { shared: false, value: null };
};

const compareGroupRows = (left, right) => {
  const sectionCompare = compareMeasurements(left.section_mm2, right.section_mm2);
  if (sectionCompare !== 0) return sectionCompare;

  const thresholdCompare = compareMeasurements(left.seuil_n, right.seuil_n);
  if (thresholdCompare !== 0) return thresholdCompare;

  const denudageCompare = compareText(left.longueur_denudage, right.longueur_denudage);
  if (denudageCompare !== 0) return denudageCompare;

  return compareText(left.id ?? 0, right.id ?? 0);
};

const compareGroups = (left, right) => {
  const toolCompare = compareText(left.numeroOutil, right.numeroOutil);
  if (toolCompare !== 0) return toolCompare;

  const tecCompare = compareText(left.referenceTec, right.referenceTec);
  if (tecCompare !== 0) return tecCompare;

  return compareText(left.designation, right.designation);
};

const buildGroupedRecords = (records) => {
  const groups = new Map();

  records.forEach((record) => {
    const groupKey = getGroupKey(record);

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        key: groupKey,
        numeroOutil: record.numero_outil ?? null,
        referenceTec: record.reference_tec ?? null,
        designation: record.designation ?? null,
        rows: [],
      });
    }

    groups.get(groupKey).rows.push(record);
  });

  return Array.from(groups.values())
    .map((group) => {
      const rows = [...group.rows].sort(compareGroupRows);

      return {
        ...group,
        rows,
        sharedFields: {
          numero_outil: { shared: true, value: group.numeroOutil },
          reference_tec: { shared: true, value: group.referenceTec },
          designation: { shared: true, value: group.designation },
        },
      };
    })
    .sort(compareGroups);
};

const ApplicateursPreventifTable = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadThresholds = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await applicateurThresholdService.getAll();
        const nextRecords = Array.isArray(response?.records) ? response.records : Array.isArray(response) ? response : [];
        setRecords(nextRecords);
      } catch (loadError) {
        console.error('Erreur chargement seuils applicateurs:', loadError);
        setRecords([]);
        setError('Impossible de charger le suivi préventif des applicateurs.');
      } finally {
        setLoading(false);
      }
    };

    loadThresholds();
  }, []);

  const normalizedSearch = normalizeText(searchQuery);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (!normalizedSearch) return true;

      return [
        record.numero_outil,
        record.reference_tec,
        record.designation,
        record.section_mm2,
        record.seuil_n,
        record.longueur_denudage,
      ].some((field) => normalizeText(field).includes(normalizedSearch));
    });
  }, [records, normalizedSearch]);

  const groupedRecords = useMemo(() => buildGroupedRecords(filteredRecords), [filteredRecords]);

  const summary = useMemo(() => {
    const uniqueTools = new Set(filteredRecords.map((record) => record.numero_outil).filter(Boolean));

    return {
      tools: uniqueTools.size,
      groups: groupedRecords.length,
      rows: filteredRecords.length,
    };
  }, [filteredRecords, groupedRecords]);

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

  if (loading) {
    return <div className="py-8 text-center text-sm text-gray-500">Chargement du suivi préventif des applicateurs...</div>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 bg-sky-50/80 px-4 py-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Tableau de suivi préventif des applicateurs</h2>
          <p className="mt-1 text-sm text-slate-600">
            Références regroupées depuis la base de données pour lire les seuils de sertissage par outil.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-sky-700">
          <span>{summary.tools} outil(s)</span>
          <span>{summary.groups} groupe(s)</span>
          <span>{summary.rows} ligne(s)</span>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-white px-4 py-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Rechercher</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
            placeholder="N° outil, TEC, désignation, section, seuil..."
          />
        </label>
      </div>

      {error && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-auto">
        {groupedRecords.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">Aucun applicateur trouvé</div>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-sky-600 text-white">
              <tr>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">N° Outil</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">TEC</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Désignation</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Section mm²</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Seuil en N</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Longueur de dénudage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {groupedRecords.map((group) =>
                group.rows.map((record, rowIndex) => {
                  const rowKey = record.id ?? `${group.key}-${rowIndex}`;

                  return (
                    <tr key={rowKey} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      {renderMergedCell(group, 'numero_outil', record, rowIndex, 'px-3 py-2 align-top text-sm font-semibold text-sky-700', (value) => (
                        <div className="flex flex-col gap-1">
                          <span>{formatValue(value)}</span>
                          {group.rows.length > 1 && <span className="text-xs font-medium text-slate-400">{group.rows.length} ligne(s)</span>}
                        </div>
                      ))}

                      {renderMergedCell(group, 'reference_tec', record, rowIndex, 'px-3 py-2 align-top text-sm font-mono text-slate-700', (value) => (
                        <span>{formatValue(value)}</span>
                      ))}

                      {renderMergedCell(group, 'designation', record, rowIndex, 'px-3 py-2 align-top text-sm text-slate-800', (value) => (
                        <span>{formatValue(value)}</span>
                      ))}

                      <td className="px-3 py-2 align-top text-sm text-slate-700">{formatValue(record.section_mm2)}</td>
                      <td className="px-3 py-2 align-top text-sm text-slate-700">{formatValue(record.seuil_n)}</td>
                      <td className="px-3 py-2 align-top text-sm text-slate-700">{formatValue(record.longueur_denudage)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ApplicateursPreventifTable;