import React, { useEffect, useMemo, useState } from 'react';
import { applicateurThresholdService, applicateurPreventiveService, applicateurService } from '../services/api';
import { Search, Zap, PackageOpen, AlertCircle, XCircle, ClipboardList, X } from 'lucide-react';

const normalizeText = (value = '') =>
  String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const formatValue = (value) =>
  value === null || value === undefined || value === '' ? '—' : value;

const formatDate = (value) => {
  if (!value) return '—';
  const parts = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (parts) return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])).toLocaleDateString('fr-FR');
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('fr-FR');
};

const formatDateForInput = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const parseDateOnly = (value) => {
  const s = String(value ?? '').trim();
  if (!s) return null;
  const parts = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (parts) {
    const d = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

const addMonths = (date, n) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
};

const getWeekBounds = (ref = new Date()) => {
  const start = new Date(ref);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const getScheduleInfo = (dateProchaine) => {
  if (!dateProchaine) {
    return { key: 'unset', label: 'Pas encore initié', chipClass: 'bg-slate-100 text-slate-500 border-slate-200', canMaintain: true };
  }
  const d = parseDateOnly(dateProchaine);
  if (!d) return { key: 'unset', label: 'Pas encore initié', chipClass: 'bg-slate-100 text-slate-500 border-slate-200', canMaintain: true };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { start, end } = getWeekBounds(today);

  if (d < today) return { key: 'overdue', label: 'En retard', chipClass: 'bg-red-100 text-red-700 border-red-200', canMaintain: true };
  if (d >= start && d <= end) return { key: 'current-week', label: 'Cette semaine', chipClass: 'bg-amber-100 text-amber-700 border-amber-200', canMaintain: true };
  return { key: 'future', label: 'À venir', chipClass: 'bg-slate-100 text-slate-600 border-slate-200', canMaintain: false };
};

const parseNumericValue = (value) => {
  const n = String(value ?? '').replace(',', '.').trim();
  if (!n) return null;
  const p = Number(n);
  return Number.isFinite(p) ? p : null;
};

const compareText = (a, b) =>
  String(a ?? '').localeCompare(String(b ?? ''), 'fr', { numeric: true, sensitivity: 'base' });

const compareMeasurements = (a, b) => {
  const na = parseNumericValue(a); const nb = parseNumericValue(b);
  if (na !== null && nb !== null && na !== nb) return na - nb;
  return compareText(a, b);
};

const getGroupKey = (record) => {
  const no = normalizeText(record.numero_outil);
  const ref = normalizeText(record.reference_tec);
  const des = normalizeText(record.designation);
  if (!no && !ref && !des) return `record-${record.id}`;
  return `${no}|${ref}|${des}`;
};

const buildGroupedThresholds = (records) => {
  const groups = new Map();
  records.forEach((record) => {
    const key = getGroupKey(record);
    if (!groups.has(key)) {
      groups.set(key, { key, numeroOutil: record.numero_outil ?? null, referenceTec: record.reference_tec ?? null, designation: record.designation ?? null, rows: [] });
    }
    groups.get(key).rows.push(record);
  });
  return Array.from(groups.values())
    .map((g) => ({ ...g, rows: [...g.rows].sort((a, b) => { const s = compareMeasurements(a.section_mm2, b.section_mm2); if (s !== 0) return s; return compareMeasurements(a.seuil_n, b.seuil_n); }) }))
    .sort((a, b) => { const t = compareText(a.numeroOutil, b.numeroOutil); if (t !== 0) return t; return compareText(a.referenceTec, b.referenceTec); });
};

const STATUT_OPTIONS = ['', 'Conforme', 'Non-conforme', 'À reprendre'];

// ── Maintenance modal ─────────────────────────────────────────────────────────
const ApplicateurMaintenanceModal = ({ group, activeRecords, onConfirm, onClose, saving, error }) => {
  const today = new Date();
  const [dateControle, setDateControle] = useState(formatDateForInput(today));
  const [dateProchaine, setDateProchaine] = useState(formatDateForInput(addMonths(today, 6)));

  // Use preventive records if they exist; otherwise use threshold rows; fallback to one empty row
  const initialRows = useMemo(() => {
    if (activeRecords && activeRecords.length > 0) {
      return activeRecords.map((r) => ({
        section_mm2: r.section_mm2 ?? '',
        seuil_n: r.seuil_n ?? '',
        longueur_denudage: r.longueur_denudage ?? '',
        test_value_1: '', test_value_2: '', test_value_3: '', test_value_4: '', test_value_5: '',
        statut_verification: '',
        remarque: '',
      }));
    }
    // Bootstrap from threshold rows (or one empty row for applicateurs with no threshold config)
    const source = group.rows.length > 0 ? group.rows : [{}];
    return source.map((r) => ({
      section_mm2: r.section_mm2 ?? '',
      seuil_n: r.seuil_n ?? '',
      longueur_denudage: r.longueur_denudage ?? '',
      test_value_1: '', test_value_2: '', test_value_3: '', test_value_4: '', test_value_5: '',
      statut_verification: '',
      remarque: '',
    }));
  }, [group, activeRecords]);

  const [rowDrafts, setRowDrafts] = useState(initialRows);

  const handleDateControleChange = (val) => {
    setDateControle(val);
    const d = parseDateOnly(val);
    if (d) setDateProchaine(formatDateForInput(addMonths(d, 6)));
  };

  const updateRow = (idx, field, value) =>
    setRowDrafts((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ numero_outil: group.numeroOutil, date_controle: dateControle, date_prochaine: dateProchaine, rows: rowDrafts });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[18px] shadow-2xl">
        <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
          style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Nouvelle maintenance préventive</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Outil <span className="font-mono text-slate-200">{group.numeroOutil}</span> · {rowDrafts.length} section(s) à tester
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 rounded-[10px] px-4 py-3 text-sm" style={{ border: '1px solid var(--crit)', background: 'var(--crit-soft)', color: 'var(--crit)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>Date de contrôle</span>
              <input type="date" value={dateControle} onChange={(e) => handleDateControleChange(e.target.value)}
                className="w-full rounded-[10px] px-4 py-2 text-sm outline-none" style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>
                Prochaine échéance <span className="text-emerald-600 normal-case font-medium">(auto +6 mois)</span>
              </span>
              <input type="date" value={dateProchaine} onChange={(e) => setDateProchaine(e.target.value)}
                className="w-full rounded-[10px] px-4 py-2 text-sm outline-none" style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </label>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Valeurs de sertissage mesurées</p>
            {rowDrafts.map((row, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  {row.section_mm2 && <span className="font-mono text-sm font-bold text-amber-700">Section {row.section_mm2} mm²</span>}
                  {row.seuil_n && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      Seuil {row.seuil_n} N
                    </span>
                  )}
                  {row.longueur_denudage && <span className="text-xs text-slate-500">Dénudage : {row.longueur_denudage}</span>}
                </div>
                <div className="grid gap-2 grid-cols-5 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className="block">
                      <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">Val. {n}</span>
                      <input type="text" value={row[`test_value_${n}`]}
                        onChange={(e) => updateRow(idx, `test_value_${n}`, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-sky-400 focus:outline-none"
                        placeholder="0" />
                    </label>
                  ))}
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">Statut</span>
                    <select value={row.statut_verification} onChange={(e) => updateRow(idx, 'statut_verification', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-sky-400 focus:outline-none bg-white">
                      {STATUT_OPTIONS.map((s) => <option key={s} value={s}>{s || '— choisir —'}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">Remarque</span>
                    <input type="text" value={row.remarque} onChange={(e) => updateRow(idx, 'remarque', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-sky-400 focus:outline-none" />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: saving ? '#94a3b8' : 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              {saving ? 'Enregistrement…' : 'Valider la maintenance'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ApplicateursPreventifTable = () => {
  const [applicateurs, setApplicateurs] = useState([]);
  const [thresholds, setThresholds] = useState([]);
  const [preventiveRecords, setPreventiveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [maintenanceModal, setMaintenanceModal] = useState({ open: false, group: null, saving: false, error: '' });

  const loadData = async () => {
    try {
      setLoading(true); setError('');
      const [threshRes, preventiveRes, applicateurRes] = await Promise.all([
        applicateurThresholdService.getAll(),
        applicateurPreventiveService.getAll(),
        applicateurService.getAll(),
      ]);
      setThresholds(Array.isArray(threshRes?.records) ? threshRes.records : Array.isArray(threshRes) ? threshRes : []);
      setPreventiveRecords(Array.isArray(preventiveRes) ? preventiveRes : []);
      setApplicateurs(Array.isArray(applicateurRes) ? applicateurRes : []);
    } catch {
      setError('Impossible de charger le suivi préventif des applicateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Index preventive records by numero_outil for quick lookup
  const preventiveByOutil = useMemo(() => {
    const map = {};
    preventiveRecords.forEach((r) => {
      const key = String(r.numero_outil ?? '').trim();
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }, [preventiveRecords]);

  const normalizedSearch = normalizeText(searchQuery);
  const filteredThresholds = useMemo(() =>
    thresholds.filter((r) => {
      if (!normalizedSearch) return true;
      return [r.numero_outil, r.reference_tec, r.designation, r.section_mm2, r.seuil_n, r.longueur_denudage]
        .some((f) => normalizeText(f).includes(normalizedSearch));
    }), [thresholds, normalizedSearch]);

  const groupedRecords = useMemo(() => buildGroupedThresholds(filteredThresholds), [filteredThresholds]);

  // Merge: every applicateur from inventory appears, even without threshold config
  const mergedGroups = useMemo(() => {
    const outilsWithThresholds = new Set(groupedRecords.map((g) => normalizeText(g.numeroOutil)));
    const stubGroups = applicateurs
      .filter((a) => !outilsWithThresholds.has(normalizeText(a.numero_outil)))
      .map((a) => ({
        key: `inventory-${a.numero_outil}`,
        numeroOutil: a.numero_outil,
        referenceTec: null,
        designation: a.designation || null,
        rows: [],
      }));
    return [...groupedRecords, ...stubGroups].sort((a, b) =>
      String(a.numeroOutil ?? '').localeCompare(String(b.numeroOutil ?? ''), 'fr', { numeric: true, sensitivity: 'base' })
    );
  }, [groupedRecords, applicateurs]);

  const summary = useMemo(() => {
    const tools = new Set(mergedGroups.map((g) => g.numeroOutil).filter(Boolean));
    return { tools: tools.size, groups: mergedGroups.length, rows: filteredThresholds.length };
  }, [mergedGroups, filteredThresholds]);

  const overdueCount = useMemo(() => {
    const seen = new Set();
    return groupedRecords.filter((g) => {
      if (!g.numeroOutil || seen.has(g.numeroOutil)) return false;
      seen.add(g.numeroOutil);
      const recs = preventiveByOutil[String(g.numeroOutil).trim()] || [];
      const datePro = recs[0]?.date_prochaine;
      return getScheduleInfo(datePro).key === 'overdue';
    }).length;
  }, [groupedRecords, preventiveByOutil]);

  const openMaintenanceModal = (group) => {
    setMaintenanceModal({ open: true, group, saving: false, error: '' });
  };

  const handleMaintenanceConfirm = async (payload) => {
    setMaintenanceModal((m) => ({ ...m, saving: true, error: '' }));
    try {
      await applicateurPreventiveService.startMaintenance(payload);
      await loadData();
      setMaintenanceModal({ open: false, group: null, saving: false, error: '' });
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Erreur lors de la maintenance';
      setMaintenanceModal((m) => ({ ...m, saving: false, error: message }));
    }
  };

  const renderMergedCell = (group, field, row, rowIndex, className, renderContent) => {
    const sharedValue = group[field === 'numero_outil' ? 'numeroOutil' : field === 'reference_tec' ? 'referenceTec' : 'designation'] ?? null;
    if (rowIndex !== 0) return null;
    return <td rowSpan={group.rows.length} className={className}>{renderContent(sharedValue)}</td>;
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
    <>
      <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px]" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border2)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}>
              <Zap className="w-4 h-4" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Suivi préventif des applicateurs</p>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>Seuils de sertissage groupés par outil</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--panel3)', color: 'var(--text2)' }}>{summary.tools} outil(s)</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--panel3)', color: 'var(--text2)' }}>{summary.groups} groupe(s)</span>
            {overdueCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--crit-soft)', color: 'var(--crit)', border: '1px solid var(--crit)' }}>{overdueCount} en retard</span>
            )}
          </div>
        </div>

        <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border2)', background: 'var(--panel2)' }}>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text3)' }} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-[10px] text-sm outline-none"
              style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="N° outil, TEC, désignation, section, seuil…" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 hover:opacity-70" style={{ color: 'var(--text3)' }}>
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-auto">
          {groupedRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-slate-400">
              <PackageOpen className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm font-medium">Aucun applicateur trouvé</p>
              {searchQuery && (
                <button className="mt-1 text-xs text-sky-500 hover:underline" onClick={() => setSearchQuery('')}>Effacer la recherche</button>
              )}
            </div>
          ) : (
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                  {['N° Outil', 'Réf. TEC', 'Désignation', 'Section mm²', 'Seuil (N)', 'Dénudage', 'Statut', 'Prochaine', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--text3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mergedGroups.flatMap((group, groupIdx) => {
                  const outilKey = String(group.numeroOutil ?? '').trim();
                  const activeRecs = preventiveByOutil[outilKey] || [];
                  const datePro = activeRecs[0]?.date_prochaine ?? null;
                  const schedule = getScheduleInfo(datePro);

                  // Stub row for applicateurs with no threshold configuration
                  if (group.rows.length === 0) {
                    return [(
                      <tr key={group.key} className="transition-colors hover:bg-[var(--panel3)]"
                        style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border2)' }}>
                        <td className="px-4 py-3 align-top font-mono font-bold text-amber-600 whitespace-nowrap border-l-2 border-amber-200">
                          <div className="flex flex-col gap-1.5">
                            <span>{formatValue(group.numeroOutil)}</span>
                            <span className={`inline-flex items-center self-start rounded-full border px-2 py-0.5 text-[11px] font-semibold ${schedule.chipClass}`}>
                              {schedule.label}
                            </span>
                            <button type="button" onClick={() => openMaintenanceModal(group)}
                              className="inline-flex items-center gap-1 self-start rounded-lg px-2 py-1 text-[11px] font-semibold transition bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">
                              <ClipboardList className="w-3 h-3" />
                              Initialiser
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top font-mono text-xs" style={{ color: 'var(--text2)' }}>—</td>
                        <td className="px-4 py-3 align-top text-sm max-w-[180px]" style={{ color: 'var(--text)' }}>
                          <span className="break-words">{formatValue(group.designation)}</span>
                        </td>
                        <td colSpan={6} className="px-4 py-3 text-xs" style={{ color: 'var(--text3)' }}>
                          Aucun seuil configuré — cliquez sur Initialiser pour démarrer le suivi préventif.
                        </td>
                      </tr>
                    )];
                  }

                  return group.rows.map((record, rowIndex) => {
                    const rowKey = record.id ?? `${group.key}-${rowIndex}`;
                    const isLastRow = rowIndex === group.rows.length - 1;
                    const rowBgStyle = {
                      background: rowIndex % 2 === 0 ? 'var(--panel)' : 'var(--panel2)',
                      borderBottom: isLastRow && groupIdx < mergedGroups.length - 1 ? '2px solid var(--border)' : '1px solid var(--border2)',
                    };

                    return (
                      <tr key={rowKey}
                        className="transition-colors hover:bg-[var(--panel3)]"
                        style={rowBgStyle}>

                        {/* N° Outil — merged, shows status + action */}
                        {rowIndex === 0 && (
                          <td rowSpan={group.rows.length} className="px-4 py-3 align-top font-mono font-bold text-amber-600 whitespace-nowrap border-l-2 border-amber-200">
                            <div className="flex flex-col gap-1.5">
                              <span>{formatValue(group.numeroOutil)}</span>
                              {group.rows.length > 1 && <span className="text-[11px]" style={{ color: 'var(--text3)' }}>{group.rows.length} seuils</span>}
                              <span className={`inline-flex items-center self-start rounded-full border px-2 py-0.5 text-[11px] font-semibold ${schedule.chipClass}`}>
                                {schedule.label}
                              </span>
                              <button type="button"
                                onClick={() => openMaintenanceModal(group)}
                                disabled={!schedule.canMaintain}
                                className={`inline-flex items-center gap-1 self-start rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                                  schedule.canMaintain
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                }`}>
                                <ClipboardList className="w-3 h-3" />
                                {schedule.key === 'unset' ? 'Initialiser' : 'Nouvelle maintenance'}
                              </button>
                            </div>
                          </td>
                        )}

                        {/* Réf. TEC — merged */}
                        {rowIndex === 0 && (
                          <td rowSpan={group.rows.length} className="px-4 py-3 align-top font-mono text-xs" style={{ color: 'var(--text2)' }}>
                            {formatValue(group.referenceTec)}
                          </td>
                        )}

                        {/* Désignation — merged */}
                        {rowIndex === 0 && (
                          <td rowSpan={group.rows.length} className="px-4 py-3 align-top text-sm max-w-[180px]" style={{ color: 'var(--text)' }}>
                            <span className="break-words">{formatValue(group.designation)}</span>
                          </td>
                        )}

                        <td className="px-4 py-3 align-top text-xs font-mono text-center" style={{ color: 'var(--text2)' }}>{formatValue(record.section_mm2)}</td>
                        <td className="px-4 py-3 align-top">
                          {record.seuil_n ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-mono" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                              {record.seuil_n} N
                            </span>
                          ) : <span className="text-xs" style={{ color: 'var(--text3)' }}>—</span>}
                        </td>
                        <td className="px-4 py-3 align-top text-xs font-mono" style={{ color: 'var(--text2)' }}>{formatValue(record.longueur_denudage)}</td>

                        {/* Statut — merged */}
                        {rowIndex === 0 && (
                          <td rowSpan={group.rows.length} className="px-4 py-3 align-top text-xs">
                            {activeRecs.length > 0 && activeRecs[0].statut_verification ? (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                activeRecs[0].statut_verification === 'Conforme' ? 'bg-emerald-50 text-emerald-700' :
                                activeRecs[0].statut_verification === 'Non-conforme' ? 'bg-red-50 text-red-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>{activeRecs[0].statut_verification}</span>
                            ) : <span style={{ color: 'var(--text3)' }}>—</span>}
                          </td>
                        )}

                        {/* Prochaine — merged */}
                        {rowIndex === 0 && (
                          <td rowSpan={group.rows.length} className="px-4 py-3 align-top text-xs">
                            {datePro ? (
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                schedule.key === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>{formatDate(datePro)}</span>
                            ) : <span style={{ color: 'var(--text3)' }}>—</span>}
                          </td>
                        )}

                        {/* Actions — merged */}
                        {rowIndex === 0 && (
                          <td rowSpan={group.rows.length} className="px-4 py-3 align-top text-xs text-slate-400">
                            {activeRecs.length > 0 && (
                              <span className="text-[11px]">{activeRecs.length} enreg.</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {maintenanceModal.open && maintenanceModal.group && (
        <ApplicateurMaintenanceModal
          group={maintenanceModal.group}
          activeRecords={preventiveByOutil[String(maintenanceModal.group.numeroOutil ?? '').trim()] || []}
          saving={maintenanceModal.saving}
          error={maintenanceModal.error}
          onConfirm={handleMaintenanceConfirm}
          onClose={() => setMaintenanceModal({ open: false, group: null, saving: false, error: '' })}
        />
      )}
    </>
  );
};

export default ApplicateursPreventifTable;
