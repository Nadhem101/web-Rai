import React, { useEffect, useMemo, useState } from 'react';
import { applicateurThresholdService } from '../services/api';
import { Search, Zap, PackageOpen, AlertCircle, XCircle } from 'lucide-react';

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

const getGroupKey = (record) => {
  const no  = normalizeText(record.numero_outil);
  const ref = normalizeText(record.reference_tec);
  const des = normalizeText(record.designation);
  if (!no && !ref && !des) return `record-${record.id}`;
  return `${no}|${ref}|${des}`;
};

const getSharedFieldInfo = (rows, field) => {
  if (!rows.length) return { shared: false, value: null };
  const first = rows[0]?.[field] ?? null;
  const norm  = normalizeText(first);
  return rows.every((r) => normalizeText(r?.[field] ?? null) === norm)
    ? { shared: true, value: first }
    : { shared: false, value: null };
};

const compareGroupRows = (a, b) => {
  const s = compareMeasurements(a.section_mm2, b.section_mm2); if (s !== 0) return s;
  const t = compareMeasurements(a.seuil_n, b.seuil_n);         if (t !== 0) return t;
  const d = compareText(a.longueur_denudage, b.longueur_denudage); if (d !== 0) return d;
  return compareText(a.id ?? 0, b.id ?? 0);
};

const compareGroups = (a, b) => {
  const t = compareText(a.numeroOutil, b.numeroOutil); if (t !== 0) return t;
  const r = compareText(a.referenceTec, b.referenceTec); if (r !== 0) return r;
  return compareText(a.designation, b.designation);
};

const buildGroupedRecords = (records) => {
  const groups = new Map();
  records.forEach((record) => {
    const key = getGroupKey(record);
    if (!groups.has(key)) {
      groups.set(key, {
        key, numeroOutil: record.numero_outil ?? null,
        referenceTec: record.reference_tec ?? null,
        designation: record.designation ?? null, rows: [],
      });
    }
    groups.get(key).rows.push(record);
  });
  return Array.from(groups.values())
    .map((g) => ({
      ...g,
      rows: [...g.rows].sort(compareGroupRows),
      sharedFields: {
        numero_outil:  { shared: true, value: g.numeroOutil },
        reference_tec: { shared: true, value: g.referenceTec },
        designation:   { shared: true, value: g.designation },
      },
    }))
    .sort(compareGroups);
};

const ApplicateursPreventifTable = () => {
  const [records,     setRecords]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true); setError('');
        const response = await applicateurThresholdService.getAll();
        const next = Array.isArray(response?.records) ? response.records : Array.isArray(response) ? response : [];
        setRecords(next);
      } catch {
        setRecords([]);
        setError('Impossible de charger le suivi préventif des applicateurs.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const normalizedSearch = normalizeText(searchQuery);
  const filteredRecords = useMemo(() =>
    records.filter((r) => {
      if (!normalizedSearch) return true;
      return [r.numero_outil, r.reference_tec, r.designation, r.section_mm2, r.seuil_n, r.longueur_denudage]
        .some((f) => normalizeText(f).includes(normalizedSearch));
    }), [records, normalizedSearch]);

  const groupedRecords = useMemo(() => buildGroupedRecords(filteredRecords), [filteredRecords]);

  const summary = useMemo(() => {
    const tools = new Set(filteredRecords.map((r) => r.numero_outil).filter(Boolean));
    return { tools: tools.size, groups: groupedRecords.length, rows: filteredRecords.length };
  }, [filteredRecords, groupedRecords]);

  const renderMergedCell = (group, field, row, rowIndex, className, renderContent) => {
    const sf = group.sharedFields[field];
    if (sf?.shared) {
      if (rowIndex !== 0) return null;
      return <td rowSpan={group.rows.length} className={className}>{renderContent(sf.value, true)}</td>;
    }
    return <td className={className}>{renderContent(row[field], false)}</td>;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Chargement du suivi préventif des applicateurs…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* Sub-header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Suivi préventif des applicateurs</p>
            <p className="text-xs text-slate-400">Seuils de sertissage groupés par outil</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{summary.tools} outil(s)</span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{summary.groups} groupe(s)</span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{summary.rows} ligne(s)</span>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-slate-100 bg-white px-5 py-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            placeholder="N° outil, TEC, désignation, section, seuil…"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto">
        {groupedRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-slate-400">
            <PackageOpen className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm font-medium">Aucun applicateur trouvé</p>
            {searchQuery && (
              <button className="mt-1 text-xs text-sky-500 hover:underline" onClick={() => setSearchQuery('')}>
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['N° Outil','Réf. TEC','Désignation','Section mm²','Seuil (N)','Dénudage'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupedRecords.map((group, groupIdx) =>
                group.rows.map((record, rowIndex) => {
                  const rowKey = record.id ?? `${group.key}-${rowIndex}`;
                  const isLastRow = rowIndex === group.rows.length - 1;
                  const rowBg = rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/40';

                  return (
                    <tr key={rowKey}
                      className={`${rowBg} ${isLastRow && groupIdx < groupedRecords.length - 1 ? 'border-b-2 border-slate-200' : 'border-b border-slate-100'} hover:bg-amber-50/20 transition-colors`}>

                      {renderMergedCell(group, 'numero_outil', record, rowIndex,
                        'px-4 py-3 align-top font-mono font-bold text-amber-600 whitespace-nowrap border-l-2 border-amber-200',
                        (value) => (
                          <div className="flex flex-col gap-1">
                            <span>{formatValue(value)}</span>
                            {group.rows.length > 1 && (
                              <span className="text-[11px] text-slate-400">{group.rows.length} seuils</span>
                            )}
                          </div>
                        )
                      )}

                      {renderMergedCell(group, 'reference_tec', record, rowIndex,
                        'px-4 py-3 align-top font-mono text-xs text-slate-600',
                        (v) => <span>{formatValue(v)}</span>
                      )}

                      {renderMergedCell(group, 'designation', record, rowIndex,
                        'px-4 py-3 align-top text-sm text-slate-700 max-w-[180px]',
                        (v) => <span className="break-words">{formatValue(v)}</span>
                      )}

                      <td className="px-4 py-3 align-top text-xs font-mono text-slate-600 text-center">{formatValue(record.section_mm2)}</td>
                      <td className="px-4 py-3 align-top">
                        {record.seuil_n ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                            {record.seuil_n} N
                          </span>
                        ) : <span className="text-slate-400 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 align-top text-xs font-mono text-slate-600">{formatValue(record.longueur_denudage)}</td>
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
