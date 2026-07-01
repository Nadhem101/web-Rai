import React, { useEffect, useMemo, useState } from 'react';
import { pincePreventiveService } from '../services/api';
import { Pencil, Trash2, Plus, X, AlertCircle, Wrench, ClipboardList } from 'lucide-react';

const normalizeText = (value = '') =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

const formatValue = (value) => (value === null || value === undefined || value === '' ? '-' : value);

const formatDate = (value) => {
  const date = parseDateOnly(value);
  if (!date) return value ? String(value) : '-';
  return date.toLocaleDateString('fr-FR');
};

const formatDateForInput = (value = new Date()) => {
  const date = value instanceof Date ? value : parseDateOnly(value) || new Date(value);
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateOnly = (value) => {
  const normalized = String(value ?? '').trim();
  if (!normalized) return null;
  const parts = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (parts) {
    const date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseNumericValue = (value) => {
  const normalized = String(value ?? '').replace(',', '.').trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const toNullableValue = (value) => (value === null || value === undefined || value === '' ? null : value);

const compareText = (left, right) =>
  String(left ?? '').localeCompare(String(right ?? ''), 'fr', { numeric: true, sensitivity: 'base' });

const compareMeasurements = (left, right) => {
  const leftNumeric = parseNumericValue(left);
  const rightNumeric = parseNumericValue(right);
  if (leftNumeric !== null && rightNumeric !== null && leftNumeric !== rightNumeric) return leftNumeric - rightNumeric;
  return compareText(left, right);
};

const isPastDate = (value) => {
  const date = parseDateOnly(value);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

const getWeekBounds = (referenceDate = new Date()) => {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);
  const dayIndex = start.getDay();
  const offsetToMonday = (dayIndex + 6) % 7;
  start.setDate(start.getDate() - offsetToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const getGroupScheduleInfo = (group) => {
  const validDates = group.rows
    .map((row) => parseDateOnly(row.date_prochaine))
    .filter(Boolean)
    .sort((left, right) => left - right);

  if (validDates.length === 0) {
    return { key: 'unknown', label: 'Sans date', chipClass: 'bg-slate-100 text-slate-600 border-slate-200', canAdd: false, nextDate: null };
  }

  const nextDate = validDates[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { start, end } = getWeekBounds(today);

  if (nextDate < today) {
    return { key: 'overdue', label: 'En retard', chipClass: 'bg-red-100 text-red-700 border-red-200', canAdd: true, nextDate };
  }
  if (nextDate >= start && nextDate <= end) {
    return { key: 'current-week', label: 'Cette semaine', chipClass: 'bg-amber-100 text-amber-700 border-amber-200', canAdd: true, nextDate };
  }
  return { key: 'future', label: 'A venir', chipClass: 'bg-slate-100 text-slate-600 border-slate-200', canAdd: false, nextDate };
};

const buildNewRowDraft = (group) => {
  const baseRow = group.rows[0] || {};
  return {
    numero_pince: group.sharedFields.numero_pince?.value || baseRow.numero_pince || '',
    reference_more: group.sharedFields.reference_more?.value || baseRow.reference_more || '',
    cosse: group.sharedFields.cosse?.value || baseRow.cosse || '',
    date_controle: formatDateForInput(new Date()),
    position: baseRow.position || '',
    fil: baseRow.fil || '',
    traction_minimale_n: baseRow.traction_minimale_n || '',
    test_value_1: '',
    test_value_2: '',
    test_value_3: '',
    test_value_4: '',
    test_value_5: '',
    statut_verification: '',
    date_prochaine: '',
    remarque: '',
  };
};

const buildEditRowDraft = (record) => ({
  numero_pince: record?.numero_pince ?? '',
  reference_more: record?.reference_more ?? '',
  cosse: record?.cosse ?? '',
  date_controle: record?.date_controle ? formatDateForInput(record.date_controle) : '',
  position: record?.position ?? '',
  fil: record?.fil ?? '',
  traction_minimale_n: record?.traction_minimale_n ?? '',
  test_value_1: record?.test_value_1 ?? '',
  test_value_2: record?.test_value_2 ?? '',
  test_value_3: record?.test_value_3 ?? '',
  test_value_4: record?.test_value_4 ?? '',
  test_value_5: record?.test_value_5 ?? '',
  statut_verification: record?.statut_verification ?? '',
  date_prochaine: record?.date_prochaine ? formatDateForInput(record.date_prochaine) : '',
  remarque: record?.remarque ?? '',
});

const buildRowPayload = (data) => ({
  numero_pince: toNullableValue(data.numero_pince),
  reference_more: toNullableValue(data.reference_more),
  cosse: toNullableValue(data.cosse),
  date_controle: toNullableValue(data.date_controle),
  position: toNullableValue(data.position),
  fil: toNullableValue(data.fil),
  traction_minimale_n: toNullableValue(data.traction_minimale_n),
  test_value_1: toNullableValue(data.test_value_1),
  test_value_2: toNullableValue(data.test_value_2),
  test_value_3: toNullableValue(data.test_value_3),
  test_value_4: toNullableValue(data.test_value_4),
  test_value_5: toNullableValue(data.test_value_5),
  statut_verification: toNullableValue(data.statut_verification),
  date_prochaine: toNullableValue(data.date_prochaine),
  remarque: toNullableValue(data.remarque),
});

const getPinceGroupKey = (record) => {
  const normalizedNumero = normalizeText(record.numero_pince);
  if (normalizedNumero) return normalizedNumero;
  return `record-${record.id}`;
};

const getSharedFieldInfo = (rows, field) => {
  if (rows.length === 0) return { shared: false, value: null };
  const firstValue = rows[0]?.[field] ?? null;
  const firstNormalized = normalizeText(firstValue);
  const shared = rows.every((row) => normalizeText(row?.[field] ?? null) === firstNormalized);
  return shared ? { shared: true, value: firstValue } : { shared: false, value: null };
};

const compareGroupRows = (left, right) => {
  const positionCompare = compareMeasurements(left.position, right.position);
  if (positionCompare !== 0) return positionCompare;
  const controlDateCompare = compareText(left.date_controle, right.date_controle);
  if (controlDateCompare !== 0) return controlDateCompare;
  return compareText(left.id ?? 0, right.id ?? 0);
};

const compareGroups = (left, right) => {
  const leftLabel = formatValue(left.numeroPince);
  const rightLabel = formatValue(right.numeroPince);
  const leftMissing = leftLabel === '-';
  const rightMissing = rightLabel === '-';
  if (leftMissing && !rightMissing) return 1;
  if (!leftMissing && rightMissing) return -1;
  const labelCompare = compareText(leftLabel, rightLabel);
  if (labelCompare !== 0) return labelCompare;
  const firstLeftDate = left.rows[0]?.date_controle;
  const firstRightDate = right.rows[0]?.date_controle;
  return compareText(firstLeftDate, firstRightDate);
};

const buildGroupedRecords = (records) => {
  const groups = new Map();
  records.forEach((record) => {
    const groupKey = getPinceGroupKey(record);
    if (!groups.has(groupKey)) {
      groups.set(groupKey, { key: groupKey, numeroPince: record.numero_pince ?? null, rows: [] });
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
          numero_pince: { shared: true, value: group.numeroPince },
          date_controle: getSharedFieldInfo(rows, 'date_controle'),
          reference_more: getSharedFieldInfo(rows, 'reference_more'),
          cosse: getSharedFieldInfo(rows, 'cosse'),
          date_prochaine: getSharedFieldInfo(rows, 'date_prochaine'),
          remarque: getSharedFieldInfo(rows, 'remarque'),
        },
      };
    })
    .sort(compareGroups);
};

const getMeasurementValues = (record) =>
  [record.test_value_1, record.test_value_2, record.test_value_3, record.test_value_4, record.test_value_5]
    .filter((value) => value !== null && value !== undefined && value !== '');

const STATUT_OPTIONS = ['', 'Conforme', 'Non-conforme', 'À reprendre'];

// ── Maintenance modal (new maintenance cycle for a whole pince group) ─────────
const MaintenanceModal = ({ group, onConfirm, onClose, saving, error }) => {
  const today = new Date();
  const defaultDateControle = formatDateForInput(today);
  const defaultDateProchaine = formatDateForInput(addMonths(today, 6));

  const [dateControle, setDateControle] = useState(defaultDateControle);
  const [dateProchaine, setDateProchaine] = useState(defaultDateProchaine);
  const [globalRemarque, setGlobalRemarque] = useState('');
  // One row of test values per position in the current group
  const [rowDrafts, setRowDrafts] = useState(() =>
    group.rows.map((r) => ({
      position: r.position ?? '',
      fil: r.fil ?? '',
      traction_minimale_n: r.traction_minimale_n ?? '',
      reference_more: r.reference_more ?? '',
      cosse: r.cosse ?? '',
      test_value_1: '',
      test_value_2: '',
      test_value_3: '',
      test_value_4: '',
      test_value_5: '',
      statut_verification: '',
      remarque: '',
    }))
  );

  // When dateControle changes, recalculate dateProchaine to +6M
  const handleDateControleChange = (val) => {
    setDateControle(val);
    const d = parseDateOnly(val);
    if (d) setDateProchaine(formatDateForInput(addMonths(d, 6)));
  };

  const updateRow = (idx, field, value) => {
    setRowDrafts((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      numero_pince: group.numeroPince,
      date_controle: dateControle || null,
      date_prochaine: dateProchaine || null,
      rows: rowDrafts.map((r) => ({
        ...r,
        test_value_1: toNullableValue(r.test_value_1),
        test_value_2: toNullableValue(r.test_value_2),
        test_value_3: toNullableValue(r.test_value_3),
        test_value_4: toNullableValue(r.test_value_4),
        test_value_5: toNullableValue(r.test_value_5),
        statut_verification: toNullableValue(r.statut_verification),
        remarque: toNullableValue(r.remarque) ?? toNullableValue(globalRemarque),
      })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[18px] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
          style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Nouvelle maintenance préventive</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pince <span className="font-mono text-slate-200">{group.numeroPince}</span> · {group.rows.length} position(s) à tester
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
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

          {/* Dates */}
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

          {/* Per-position test values */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Valeurs de traction mesurées</p>
            {rowDrafts.map((row, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-bold text-sky-700">
                    {row.position ? `Position ${row.position}` : `Mesure ${idx + 1}`}
                  </span>
                  {row.fil && <span className="text-xs text-slate-500">Fil : {row.fil}</span>}
                  {row.traction_minimale_n && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700">
                      min. {row.traction_minimale_n} N
                    </span>
                  )}
                </div>
                <div className="grid gap-2 grid-cols-5 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className="block">
                      <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">Val. {n}</span>
                      <input type="text" value={row[`test_value_${n}`]}
                        onChange={(e) => updateRow(idx, `test_value_${n}`, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
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
                    <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">Remarque (ligne)</span>
                    <input type="text" value={row.remarque} onChange={(e) => updateRow(idx, 'remarque', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" />
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Global remark */}
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>Remarque générale</span>
            <textarea value={globalRemarque} onChange={(e) => setGlobalRemarque(e.target.value)} rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="Observations générales sur cette maintenance…" />
          </label>

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-colors"
              style={{ background: saving ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)' }}>
              {saving ? 'Enregistrement…' : 'Valider la maintenance'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── PincePreventiveCalendar ───────────────────────────────────────────────────
const PincePreventiveCalendar = ({ searchQuery = '' }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowForm, setRowForm] = useState({ open: false, mode: 'create', group: null, record: null, data: null, saving: false, error: '' });
  const [maintenanceModal, setMaintenanceModal] = useState({ open: false, group: null, saving: false, error: '' });

  useEffect(() => { loadRecords(); }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await pincePreventiveService.getAll();
      setRecords(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erreur chargement maintenance preventive pinces:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizedSearch = normalizeText(searchQuery);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (!normalizedSearch) return true;
      return [
        record.numero_pince, record.reference_more, record.position, record.cosse, record.fil,
        record.traction_minimale_n, record.test_value_1, record.test_value_2, record.test_value_3,
        record.test_value_4, record.test_value_5, record.date_controle, record.date_prochaine,
        record.moyenne, record.statut_verification, record.remarque,
      ].some((field) => normalizeText(field).includes(normalizedSearch));
    });
  }, [records, normalizedSearch]);

  const groupedRecords = useMemo(() => buildGroupedRecords(filteredRecords), [filteredRecords]);

  const overdueCount = useMemo(
    () => filteredRecords.filter((r) => isPastDate(r.date_prochaine)).length,
    [filteredRecords]
  );

  const isEditingRow = rowForm.mode === 'edit';

  const renderMergedCell = (group, field, row, rowIndex, className, renderContent) => {
    const sharedField = group.sharedFields[field];
    if (sharedField?.shared) {
      if (rowIndex !== 0) return null;
      return <td rowSpan={group.rows.length} className={className}>{renderContent(sharedField.value, true)}</td>;
    }
    return <td className={className}>{renderContent(row[field], false)}</td>;
  };

  const renderValues = (record) => {
    const measurementValues = getMeasurementValues(record);
    const hasAverage = record.moyenne !== null && record.moyenne !== undefined && record.moyenne !== '';
    if (measurementValues.length === 0 && !hasAverage) return <span style={{ color: 'var(--text3)' }}>-</span>;
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {measurementValues.map((value, valueIndex) => (
          <span key={`${record.id}-value-${valueIndex}`}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-mono"
            style={{ background: 'var(--ok-soft)', color: 'var(--ok)' }}>
            {value}
          </span>
        ))}
        {hasAverage && (
          <>
            {measurementValues.length > 0 && <span className="text-xs" style={{ color: 'var(--border)' }}>|</span>}
            <span className="text-xs font-bold font-mono" style={{ color: 'var(--ok)' }}>moy. {record.moyenne}</span>
          </>
        )}
      </div>
    );
  };

  const openAddRowModal = (group) => {
    const schedule = getGroupScheduleInfo(group);
    if (!schedule.canAdd) return;
    setRowForm({ open: true, mode: 'create', group, record: null, data: buildNewRowDraft(group), saving: false, error: '' });
  };

  const openEditRowModal = (group, record) => {
    if (!record) return;
    setRowForm({ open: true, mode: 'edit', group, record, data: buildEditRowDraft(record), saving: false, error: '' });
  };

  const closeRowModal = () =>
    setRowForm({ open: false, mode: 'create', group: null, record: null, data: null, saving: false, error: '' });

  const openMaintenanceModal = (group) => {
    const schedule = getGroupScheduleInfo(group);
    if (!schedule.canAdd) return;
    setMaintenanceModal({ open: true, group, saving: false, error: '' });
  };

  const closeMaintenanceModal = () =>
    setMaintenanceModal({ open: false, group: null, saving: false, error: '' });

  const handleDeleteRow = async (record) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer la ligne du ${formatDate(record.date_controle)} pour ${formatValue(record.numero_pince)} ?`
    );
    if (!confirmed) return;
    try {
      await pincePreventiveService.delete(record.id);
      await loadRecords();
    } catch (error) {
      console.error('Erreur suppression ligne preventive:', error);
      alert('Erreur lors de la suppression de la ligne');
    }
  };

  const handleRowFormChange = (event) => {
    const { name, value } = event.target;
    setRowForm((current) => ({ ...current, data: { ...current.data, [name]: value } }));
  };

  const handleRowFormSubmit = async (event) => {
    event.preventDefault();
    if (!rowForm.data) return;
    try {
      setRowForm((current) => ({ ...current, saving: true, error: '' }));
      const payload = buildRowPayload(rowForm.data);
      if (rowForm.mode === 'edit' && rowForm.record?.id) {
        await pincePreventiveService.update(rowForm.record.id, payload);
      } else {
        await pincePreventiveService.create(payload);
      }
      await loadRecords();
      closeRowModal();
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Erreur lors de la sauvegarde';
      setRowForm((current) => ({ ...current, saving: false, error: message }));
    }
  };

  const handleMaintenanceConfirm = async (payload) => {
    setMaintenanceModal((m) => ({ ...m, saving: true, error: '' }));
    try {
      await pincePreventiveService.startMaintenance(payload);
      await loadRecords();
      closeMaintenanceModal();
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Erreur lors de la maintenance';
      setMaintenanceModal((m) => ({ ...m, saving: false, error: message }));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
          <p className="text-sm" style={{ color: 'var(--text3)' }}>Chargement du suivi préventif des pinces…</p>
        </div>
      </div>
    );
  }

  if (groupedRecords.length === 0) {
    return (
      <div className="mt-4 flex min-h-0 flex-col overflow-hidden rounded-[14px]" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border2)' }}>
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <Wrench className="w-4 h-4" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Suivi préventif des pinces</p>
            <p className="text-xs" style={{ color: 'var(--text3)' }}>Aucun enregistrement ne correspond à la recherche.</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-14" style={{ color: 'var(--text3)' }}>
          <Wrench className="w-8 h-8 mb-2 opacity-30" />
          <p className="text-sm">Aucune pince trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px]" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border2)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              <Wrench className="w-4 h-4" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Suivi préventif des pinces</p>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>Groupé par N° pince — valeurs de traction mesurées</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--panel3)', color: 'var(--text2)' }}>{groupedRecords.length} pince(s)</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--panel3)', color: 'var(--text2)' }}>{filteredRecords.length} ligne(s)</span>
            {overdueCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--crit-soft)', color: 'var(--crit)', border: '1px solid var(--crit)' }}>{overdueCount} en retard</span>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                {['N° Pince', 'Date contrôle', 'Référence', 'Position', 'Cosse', 'Fil', 'Traction min.', 'Valeurs', 'Statut', 'Prochaine', 'Remarque', 'Actions'].map((h) => (
                  <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--text3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="">
              {groupedRecords.map((group) =>
                group.rows.map((record, rowIndex) => {
                  const rowKey = record.id ?? `${group.key}-${rowIndex}`;
                  const schedule = getGroupScheduleInfo(group);
                  return (
                    <tr key={rowKey} className="transition-colors hover:bg-[var(--panel3)]" style={{ background: rowIndex % 2 === 0 ? 'var(--panel)' : 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                      {renderMergedCell(group, 'numero_pince', record, rowIndex, 'px-3 py-3 align-top border-l-[3px] border-l-[var(--accent)]', (value) => (
                        <div className="flex flex-col gap-1.5 min-w-[130px]">
                          <span className="font-mono font-bold text-sm" style={{ color: 'var(--accent)' }}>{formatValue(value)}</span>
                          <span className={`inline-flex items-center self-start rounded-full border px-2 py-0.5 text-[11px] font-semibold ${schedule.chipClass}`}>
                            {schedule.label}
                          </span>
                          {group.rows.length > 1 && (
                            <span className="text-[11px]" style={{ color: 'var(--text3)' }}>{group.rows.length} mesures</span>
                          )}
                          {/* Primary action: full maintenance cycle */}
                          <button type="button" onClick={() => openMaintenanceModal(group)} disabled={!schedule.canAdd}
                            title={schedule.canAdd ? 'Démarrer une nouvelle maintenance (archive les anciennes valeurs)' : 'Disponible quand la pince est en retard ou prévue cette semaine'}
                            className="inline-flex items-center gap-1 self-start rounded-[8px] px-2 py-1 text-[11px] font-semibold transition"
                            style={schedule.canAdd
                              ? { background: 'var(--ok-soft)', color: 'var(--ok)', border: '1px solid var(--ok)' }
                              : { background: 'var(--panel3)', color: 'var(--text3)', border: '1px solid var(--border)', cursor: 'not-allowed' }}>
                            <ClipboardList className="w-3 h-3" />
                            Nouvelle maintenance
                          </button>
                          {/* Secondary: add a single row */}
                          <button type="button" onClick={() => openAddRowModal(group)} disabled={!schedule.canAdd}
                            title="Ajouter une ligne isolée"
                            className="inline-flex items-center gap-1 self-start rounded-[8px] px-2 py-1 text-[11px] font-semibold transition"
                            style={schedule.canAdd
                              ? { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }
                              : { background: 'var(--panel3)', color: 'var(--text3)', border: '1px solid var(--border)', cursor: 'not-allowed' }}>
                            <Plus className="w-3 h-3" />
                            Ajouter
                          </button>
                        </div>
                      ))}

                      {renderMergedCell(group, 'date_controle', record, rowIndex, 'px-3 py-3 align-top', (value) => (
                        <span className="text-xs font-medium" style={{ color: 'var(--text2)' }}>{formatDate(value)}</span>
                      ))}

                      {renderMergedCell(group, 'reference_more', record, rowIndex, 'px-3 py-3 align-top', (value) => (
                        <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text)' }}>{formatValue(value)}</span>
                      ))}

                      <td className="px-3 py-3 align-top text-xs font-mono" style={{ color: 'var(--text2)' }}>{formatValue(record.position)}</td>

                      {renderMergedCell(group, 'cosse', record, rowIndex, 'px-3 py-3 align-top', (value) => (
                        <span className="text-xs font-mono font-semibold" style={{ color: 'var(--accent)' }}>{formatValue(value)}</span>
                      ))}

                      <td className="px-3 py-3 align-top text-xs font-mono font-semibold" style={{ color: 'var(--text2)' }}>{formatValue(record.fil)}</td>

                      <td className="px-3 py-3 align-top">
                        {record.traction_minimale_n
                          ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-mono" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                              {record.traction_minimale_n} N
                            </span>
                          : <span style={{ color: 'var(--text3)' }}>—</span>}
                      </td>

                      <td className="px-3 py-3 align-top">{renderValues(record)}</td>

                      <td className="px-3 py-3 align-top text-xs">
                        {record.statut_verification ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{
                              background: record.statut_verification === 'Conforme' ? 'var(--ok-soft)' : record.statut_verification === 'Non-conforme' ? 'var(--crit-soft)' : 'var(--warn-soft)',
                              color: record.statut_verification === 'Conforme' ? 'var(--ok)' : record.statut_verification === 'Non-conforme' ? 'var(--crit)' : 'var(--warn)',
                            }}>
                            {record.statut_verification}
                          </span>
                        ) : <span style={{ color: 'var(--text3)' }}>-</span>}
                      </td>

                      {renderMergedCell(group, 'date_prochaine', record, rowIndex, 'px-3 py-3 align-top text-xs', (value) => (
                        <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold"
                          style={isPastDate(value)
                            ? { background: 'var(--crit-soft)', color: 'var(--crit)' }
                            : { background: 'var(--ok-soft)', color: 'var(--ok)' }}>
                          {formatDate(value)}
                        </span>
                      ))}

                      {renderMergedCell(group, 'remarque', record, rowIndex, 'px-3 py-3 align-top text-xs', (value) => (
                        <span style={{ color: 'var(--text2)' }}>{formatValue(value)}</span>
                      ))}

                      <td className="px-3 py-3 align-top">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => openEditRowModal(group, record)}
                            title="Modifier cette ligne"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                            style={{ color: 'var(--text3)' }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => handleDeleteRow(record)}
                            title="Supprimer cette ligne"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                            style={{ color: 'var(--text3)' }}>
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add/Edit single row modal */}
      {rowForm.open && rowForm.group && rowForm.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[18px] shadow-2xl">
            <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
              style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-4 h-4 text-sky-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {isEditingRow ? 'Modifier une valeur préventive' : 'Ajouter une valeur préventive'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pince {formatValue(rowForm.group.numeroPince)} · {rowForm.group.rows.length} mesure(s) existante(s)
                    {isEditingRow && rowForm.record?.id ? ` · #${rowForm.record.id}` : ''}
                  </p>
                </div>
              </div>
              <button type="button" onClick={closeRowModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRowFormSubmit} className="flex-1 overflow-auto p-6">
              {rowForm.error && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{rowForm.error}</span>
                </div>
              )}

              <div className="mb-5 grid gap-3 md:grid-cols-3">
                {['numero_pince', 'reference_more', 'cosse'].map((field) => (
                  <label key={field} className="block rounded-xl bg-slate-50 px-4 py-3">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>
                      {field === 'numero_pince' ? 'N° Pince' : field === 'reference_more' ? 'Référence' : 'Cosse'}
                    </span>
                    <input type="text" name={field} value={rowForm.data[field]} onChange={handleRowFormChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" />
                  </label>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>Date contrôle</span>
                  <input type="date" name="date_controle" value={rowForm.data.date_controle} onChange={handleRowFormChange}
                    className="w-full rounded-[10px] px-4 py-2 text-sm outline-none" style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>Date prochaine</span>
                  <input type="date" name="date_prochaine" value={rowForm.data.date_prochaine} onChange={handleRowFormChange}
                    className="w-full rounded-[10px] px-4 py-2 text-sm outline-none" style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>Position</span>
                  <input type="text" name="position" value={rowForm.data.position} onChange={handleRowFormChange}
                    className="w-full rounded-[10px] px-4 py-2 text-sm outline-none" style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="ex: 0.75" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>Fil</span>
                  <input type="text" name="fil" value={rowForm.data.fil} onChange={handleRowFormChange}
                    className="w-full rounded-[10px] px-4 py-2 text-sm outline-none" style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="ex: 1" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>Traction minimale</span>
                  <input type="text" name="traction_minimale_n" value={rowForm.data.traction_minimale_n} onChange={handleRowFormChange}
                    className="w-full rounded-[10px] px-4 py-2 text-sm outline-none" style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="ex: 90" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>Statut</span>
                  <select name="statut_verification" value={rowForm.data.statut_verification} onChange={handleRowFormChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none bg-white">
                    {STATUT_OPTIONS.map((s) => <option key={s} value={s}>{s || '— choisir —'}</option>)}
                  </select>
                </label>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-5">
                {[1, 2, 3, 4, 5].map((index) => (
                  <label key={`test_value_${index}`} className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>Valeur {index}</span>
                    <input type="text" name={`test_value_${index}`} value={rowForm.data[`test_value_${index}`]} onChange={handleRowFormChange}
                      className="w-full rounded-[10px] px-4 py-2 text-sm outline-none" style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="0" />
                  </label>
                ))}
              </div>

              <label className="mt-5 block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>Remarque</span>
                <textarea name="remarque" value={rowForm.data.remarque} onChange={handleRowFormChange} rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </label>

              <div className="mt-6 flex gap-3">
                <button type="submit" disabled={rowForm.saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: rowForm.saving ? 'var(--text3)' : 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
                  {rowForm.saving ? 'Sauvegarde…' : isEditingRow ? 'Enregistrer les modifications' : 'Ajouter la ligne'}
                </button>
                <button type="button" onClick={closeRowModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full maintenance cycle modal */}
      {maintenanceModal.open && maintenanceModal.group && (
        <MaintenanceModal
          group={maintenanceModal.group}
          saving={maintenanceModal.saving}
          error={maintenanceModal.error}
          onConfirm={handleMaintenanceConfirm}
          onClose={closeMaintenanceModal}
        />
      )}
    </>
  );
};

export default PincePreventiveCalendar;
