import React, { useEffect, useMemo, useState } from 'react';
import { applicateurPreventiveService } from '../services/api';
import { Pencil, Trash2, Plus, X, AlertCircle, Zap } from 'lucide-react';

const normalizeText = (value = '') =>
  String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const formatValue = (value) =>
  (value === null || value === undefined || value === '') ? '-' : value;

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

const addSixMonths = (dateStr) => {
  const date = parseDateOnly(dateStr);
  if (!date) return '';
  const result = new Date(date);
  result.setMonth(result.getMonth() + 6);
  return formatDateForInput(result);
};

const normalizeOutilNumber = (value) => {
  if (!value) return value;
  const s = String(value).trim();
  return /^\d+$/.test(s) ? `A${s}` : s;
};

const toNullableValue = (value) =>
  (value === null || value === undefined || value === '') ? null : value;

const isPastDate = (value) => {
  const date = parseDateOnly(value);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

const compareText = (a, b) =>
  String(a ?? '').localeCompare(String(b ?? ''), 'fr', { numeric: true, sensitivity: 'base' });

const getGroupKey = (record) => {
  const no = normalizeText(record.numero_outil);
  if (no) return no;
  return `record-${record.id}`;
};

const getGroupScheduleInfo = (group) => {
  const sortedByControl = [...group.rows].sort((a, b) => {
    const da = parseDateOnly(a.date_controle);
    const db = parseDateOnly(b.date_controle);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db - da;
  });

  const nextDate = sortedByControl
    .map((row) => parseDateOnly(row.date_prochaine))
    .filter(Boolean)[0] ?? null;

  if (!nextDate) {
    return {
      key: 'unknown',
      label: 'Sans date',
      chipClass: 'bg-slate-100 text-slate-600 border-slate-200',
      canAdd: false,
      nextDate: null,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  const offset = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - offset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  if (nextDate < today) {
    return {
      key: 'overdue',
      label: 'En retard',
      chipClass: 'bg-red-100 text-red-700 border-red-200',
      canAdd: true,
      nextDate,
    };
  }

  if (nextDate >= weekStart && nextDate <= weekEnd) {
    return {
      key: 'current-week',
      label: 'Cette semaine',
      chipClass: 'bg-amber-100 text-amber-700 border-amber-200',
      canAdd: true,
      nextDate,
    };
  }

  return {
    key: 'future',
    label: 'A venir',
    chipClass: 'bg-slate-100 text-slate-600 border-slate-200',
    canAdd: false,
    nextDate,
  };
};

const buildGroupedRecords = (records) => {
  const groups = new Map();
  records.forEach((record) => {
    const key = getGroupKey(record);
    if (!groups.has(key)) {
      groups.set(key, { key, numeroOutil: record.numero_outil ?? null, rows: [] });
    }
    groups.get(key).rows.push(record);
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      rows: [...group.rows].sort((a, b) => compareText(b.date_controle, a.date_controle)),
    }))
    .sort((a, b) => compareText(
      normalizeOutilNumber(a.numeroOutil),
      normalizeOutilNumber(b.numeroOutil)
    ));
};

const getMeasurementValues = (record) =>
  [record.test_value_1, record.test_value_2, record.test_value_3, record.test_value_4, record.test_value_5]
    .filter((v) => v !== null && v !== undefined && v !== '');

const buildNewDraft = (group) => {
  const baseRow = group.rows[0] || {};
  const today = formatDateForInput(new Date());
  return {
    numero_outil: normalizeOutilNumber(group.numeroOutil || ''),
    reference_tec: baseRow.reference_tec || '',
    designation: baseRow.designation || '',
    section_mm2: baseRow.section_mm2 || '',
    seuil_n: baseRow.seuil_n || '',
    date_controle: today,
    date_prochaine: addSixMonths(today),
    test_value_1: '',
    test_value_2: '',
    test_value_3: '',
    test_value_4: '',
    test_value_5: '',
    remarque: '',
  };
};

const buildEditDraft = (record) => ({
  numero_outil: record?.numero_outil ?? '',
  reference_tec: record?.reference_tec ?? '',
  designation: record?.designation ?? '',
  section_mm2: record?.section_mm2 ?? '',
  seuil_n: record?.seuil_n ?? '',
  date_controle: record?.date_controle ? formatDateForInput(record.date_controle) : '',
  date_prochaine: record?.date_prochaine ? formatDateForInput(record.date_prochaine) : '',
  test_value_1: record?.test_value_1 ?? '',
  test_value_2: record?.test_value_2 ?? '',
  test_value_3: record?.test_value_3 ?? '',
  test_value_4: record?.test_value_4 ?? '',
  test_value_5: record?.test_value_5 ?? '',
  remarque: record?.remarque ?? '',
});

const buildPayload = (data) => ({
  numero_outil: toNullableValue(data.numero_outil),
  reference_tec: toNullableValue(data.reference_tec),
  designation: toNullableValue(data.designation),
  section_mm2: toNullableValue(data.section_mm2),
  seuil_n: toNullableValue(data.seuil_n),
  date_controle: toNullableValue(data.date_controle),
  date_prochaine: toNullableValue(data.date_prochaine),
  test_value_1: toNullableValue(data.test_value_1),
  test_value_2: toNullableValue(data.test_value_2),
  test_value_3: toNullableValue(data.test_value_3),
  test_value_4: toNullableValue(data.test_value_4),
  test_value_5: toNullableValue(data.test_value_5),
  remarque: toNullableValue(data.remarque),
});

const ApplicateursPreventifTable = ({ searchQuery = '' }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowForm, setRowForm] = useState({
    open: false, mode: 'create', group: null, record: null, data: null, saving: false, error: '',
  });

  useEffect(() => { loadRecords(); }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await applicateurPreventiveService.getAll();
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const normalizedSearch = normalizeText(searchQuery);
  const filteredRecords = useMemo(() =>
    records.filter((r) => {
      if (!normalizedSearch) return true;
      return [r.numero_outil, r.reference_tec, r.designation, r.section_mm2, r.seuil_n, r.date_controle, r.date_prochaine, r.remarque]
        .some((f) => normalizeText(f).includes(normalizedSearch));
    }), [records, normalizedSearch]);

  const groupedRecords = useMemo(() => buildGroupedRecords(filteredRecords), [filteredRecords]);

  const overdueCount = useMemo(
    () => groupedRecords.filter((g) => getGroupScheduleInfo(g).key === 'overdue').length,
    [groupedRecords]
  );

  const isEditingRow = rowForm.mode === 'edit';

  const openAddModal = (group) => {
    const schedule = getGroupScheduleInfo(group);
    if (!schedule.canAdd) return;
    setRowForm({ open: true, mode: 'create', group, record: null, data: buildNewDraft(group), saving: false, error: '' });
  };

  const openEditModal = (group, record) => {
    if (!record) return;
    setRowForm({ open: true, mode: 'edit', group, record, data: buildEditDraft(record), saving: false, error: '' });
  };

  const closeModal = () =>
    setRowForm({ open: false, mode: 'create', group: null, record: null, data: null, saving: false, error: '' });

  const handleDelete = async (record) => {
    if (!window.confirm(`Supprimer cette mesure du ${formatDate(record.date_controle)} pour ${formatValue(normalizeOutilNumber(record.numero_outil))} ?`)) return;
    try {
      await applicateurPreventiveService.delete(record.id);
      await loadRecords();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRowForm((cur) => {
      const updated = { ...cur.data, [name]: value };
      if (name === 'date_controle' && cur.mode === 'create') {
        updated.date_prochaine = addSixMonths(value);
      }
      return { ...cur, data: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rowForm.data) return;
    try {
      setRowForm((cur) => ({ ...cur, saving: true, error: '' }));
      const payload = buildPayload(rowForm.data);
      if (rowForm.mode === 'edit' && rowForm.record?.id) {
        await applicateurPreventiveService.update(rowForm.record.id, payload);
      } else {
        await applicateurPreventiveService.create(payload);
      }
      await loadRecords();
      closeModal();
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Erreur lors de la sauvegarde';
      setRowForm((cur) => ({ ...cur, saving: false, error: message }));
    }
  };

  const renderValues = (record) => {
    const vals = getMeasurementValues(record);
    const hasAvg = record.moyenne !== null && record.moyenne !== undefined && record.moyenne !== '';
    if (vals.length === 0 && !hasAvg) return <span className="text-slate-400">-</span>;
    return (
      <div className="flex items-center gap-2 whitespace-nowrap text-sm">
        {vals.map((v, i) => (
          <span key={i} className="font-medium text-slate-700">{v}</span>
        ))}
        {hasAvg && (
          <>
            {vals.length > 0 && <span className="text-slate-300">|</span>}
            <span className="font-semibold text-slate-900">moy. {record.moyenne}</span>
          </>
        )}
      </div>
    );
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

  if (groupedRecords.length === 0) {
    return (
      <div className="mt-4 flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Suivi préventif des applicateurs</p>
            <p className="text-xs text-slate-400">Aucun enregistrement trouvé. Ajoutez la première mesure via le bouton ci-dessous.</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-14 gap-3">
          <Zap className="w-8 h-8 text-slate-300" />
          <p className="text-sm text-slate-400">Aucun applicateur trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Suivi préventif des applicateurs</p>
              <p className="text-xs text-slate-400">Groupé par N° outil — valeurs de sertissage mesurées</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{groupedRecords.length} outil(s)</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{filteredRecords.length} mesure(s)</span>
            {overdueCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">{overdueCount} en retard</span>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['N° Outil','Date contrôle','Réf. TEC','Désignation','Section','Seuil (N)','Valeurs','Prochaine','Remarque','Actions'].map((h) => (
                  <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {groupedRecords.map((group) =>
                group.rows.map((record, rowIndex) => {
                  const rowKey = record.id ?? `${group.key}-${rowIndex}`;
                  const schedule = getGroupScheduleInfo(group);
                  const isFirst = rowIndex === 0;

                  return (
                    <tr key={rowKey} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-amber-50/20 transition-colors`}>
                      {isFirst && (
                        <td rowSpan={group.rows.length} className="px-3 py-3 align-top border-l-2 border-amber-300">
                          <div className="flex flex-col gap-2 min-w-[110px]">
                            <span className="font-mono font-bold text-amber-700 text-sm">{formatValue(normalizeOutilNumber(group.numeroOutil))}</span>
                            <span className={`inline-flex items-center self-start rounded-full border px-2 py-0.5 text-[11px] font-semibold ${schedule.chipClass}`}>
                              {schedule.label}
                            </span>
                            {group.rows.length > 1 && (
                              <span className="text-[11px] text-slate-400">{group.rows.length} mesures</span>
                            )}
                            <button
                              type="button"
                              onClick={() => openAddModal(group)}
                              disabled={!schedule.canAdd}
                              title={schedule.canAdd ? 'Ajouter une nouvelle mesure' : 'Disponible quand la maintenance est due ou cette semaine'}
                              className={`inline-flex items-center gap-1 self-start rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                                schedule.canAdd
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                              }`}
                            >
                              <Plus className="w-3 h-3" />
                              Ajouter
                            </button>
                          </div>
                        </td>
                      )}

                      <td className="px-3 py-3 align-top text-xs text-slate-600">{formatDate(record.date_controle)}</td>
                      <td className="px-3 py-3 align-top text-xs font-mono text-slate-600">{formatValue(record.reference_tec)}</td>
                      <td className="px-3 py-3 align-top text-xs text-slate-700 max-w-[160px] truncate">{formatValue(record.designation)}</td>
                      <td className="px-3 py-3 align-top text-xs font-mono text-center text-slate-600">{formatValue(record.section_mm2)}</td>
                      <td className="px-3 py-3 align-top text-xs">
                        {record.seuil_n ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                            {record.seuil_n} N
                          </span>
                        ) : <span className="text-slate-400">-</span>}
                      </td>
                      <td className="px-3 py-3 align-top text-xs text-slate-600">{renderValues(record)}</td>

                      {isFirst && (
                        <td rowSpan={group.rows.length} className="px-3 py-3 align-top text-xs">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            isPastDate(group.rows[0]?.date_prochaine) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {formatDate(group.rows[0]?.date_prochaine)}
                          </span>
                        </td>
                      )}

                      <td className="px-3 py-3 align-top text-xs text-slate-600 max-w-[120px] truncate">{formatValue(record.remarque)}</td>

                      <td className="px-3 py-3 align-top">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => openEditModal(group, record)}
                            title="Modifier"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => handleDelete(record)}
                            title="Supprimer"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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

      {rowForm.open && rowForm.group && rowForm.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
              style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {isEditingRow ? 'Modifier une valeur préventive' : 'Ajouter une valeur préventive'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Applicateur {formatValue(normalizeOutilNumber(rowForm.group.numeroOutil))} · {rowForm.group.rows.length} mesure(s) existante(s)
                  </p>
                </div>
              </div>
              <button type="button" onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
              {rowForm.error && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{rowForm.error}</span>
                </div>
              )}

              <div className="mb-5 grid gap-3 md:grid-cols-3">
                <label className="block rounded-xl bg-slate-50 px-4 py-3">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">N° Outil</span>
                  <input type="text" name="numero_outil" value={rowForm.data.numero_outil} onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100" />
                </label>
                <label className="block rounded-xl bg-slate-50 px-4 py-3">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Réf. TEC</span>
                  <input type="text" name="reference_tec" value={rowForm.data.reference_tec} onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100" />
                </label>
                <label className="block rounded-xl bg-slate-50 px-4 py-3">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Désignation</span>
                  <input type="text" name="designation" value={rowForm.data.designation} onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date contrôle</span>
                  <input type="date" name="date_controle" value={rowForm.data.date_controle} onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date prochaine</span>
                  <input type="date" name="date_prochaine" value={rowForm.data.date_prochaine} onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Section mm²</span>
                  <input type="text" name="section_mm2" value={rowForm.data.section_mm2} onChange={handleFormChange}
                    placeholder="ex: 0.75"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Seuil (N)</span>
                  <input type="text" name="seuil_n" value={rowForm.data.seuil_n} onChange={handleFormChange}
                    placeholder="ex: 90"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100" />
                </label>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-5">
                {[1, 2, 3, 4, 5].map((index) => (
                  <label key={index} className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Valeur {index}</span>
                    <input type="text" name={`test_value_${index}`} value={rowForm.data[`test_value_${index}`]} onChange={handleFormChange}
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100" />
                  </label>
                ))}
              </div>

              <label className="mt-5 block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Remarque</span>
                <textarea name="remarque" value={rowForm.data.remarque} onChange={handleFormChange}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  placeholder="Commentaires sur cette mesure…" />
              </label>

              <div className="mt-6 flex gap-3">
                <button type="submit" disabled={rowForm.saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: rowForm.saving ? '#94a3b8' : 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  {rowForm.saving ? 'Sauvegarde…' : isEditingRow ? 'Enregistrer les modifications' : 'Ajouter la mesure'}
                </button>
                <button type="button" onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicateursPreventifTable;
