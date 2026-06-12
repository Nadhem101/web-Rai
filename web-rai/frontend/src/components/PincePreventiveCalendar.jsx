import React, { useEffect, useMemo, useState } from 'react';
import { pincePreventiveService } from '../services/api';
import { Pencil, Trash2, Plus, X, AlertCircle, Wrench } from 'lucide-react';

const normalizeText = (value = '') =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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

// Normalize pince numbers: purely numeric → prefix with "P"
const normalizePinceNumber = (value) => {
  if (!value) return value;
  const s = String(value).trim();
  return /^\d+$/.test(s) ? `P${s}` : s;
};

const addSixMonths = (dateStr) => {
  const date = parseDateOnly(dateStr);
  if (!date) return '';
  const result = new Date(date);
  result.setMonth(result.getMonth() + 6);
  return formatDateForInput(result);
};

const toNullableValue = (value) => (value === null || value === undefined || value === '' ? null : value);

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

const getGroupScheduleInfo = (group) => {
  // Use the date_prochaine from the most recent record (by date_controle)
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
      buttonClass: 'bg-slate-200 text-slate-400 cursor-not-allowed',
      canAdd: false,
      nextDate: null,
    };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { start, end } = getWeekBounds(today);

  if (nextDate < today) {
    return {
      key: 'overdue',
      label: 'En retard',
      chipClass: 'bg-red-100 text-red-700 border-red-200',
      buttonClass: 'bg-red-600 text-white hover:bg-red-700',
      canAdd: true,
      nextDate,
    };
  }

  if (nextDate >= start && nextDate <= end) {
    return {
      key: 'current-week',
      label: 'Cette semaine',
      chipClass: 'bg-amber-100 text-amber-700 border-amber-200',
      buttonClass: 'bg-amber-600 text-white hover:bg-amber-700',
      canAdd: true,
      nextDate,
    };
  }

  return {
    key: 'future',
    label: 'A venir',
    chipClass: 'bg-slate-100 text-slate-600 border-slate-200',
    buttonClass: 'bg-slate-200 text-slate-400 cursor-not-allowed',
    canAdd: false,
    nextDate,
  };
};

const buildNewRowDraft = (group) => {
  const baseRow = group.rows[0] || {};
  const today = formatDateForInput(new Date());

  return {
    numero_pince: normalizePinceNumber(group.sharedFields.numero_pince?.value || baseRow.numero_pince || ''),
    reference_more: group.sharedFields.reference_more?.value || baseRow.reference_more || '',
    cosse: group.sharedFields.cosse?.value || baseRow.cosse || '',
    date_controle: today,
    date_prochaine: addSixMonths(today),
    position: baseRow.position || '',
    fil: baseRow.fil || '',
    traction_minimale_n: baseRow.traction_minimale_n || '',
    test_value_1: '',
    test_value_2: '',
    test_value_3: '',
    test_value_4: '',
    test_value_5: '',
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
  date_prochaine: toNullableValue(data.date_prochaine),
  remarque: toNullableValue(data.remarque),
});

const getPinceGroupKey = (record) => {
  const normalizedNumero = normalizeText(record.numero_pince);
  if (normalizedNumero) return normalizedNumero;
  return `record-${record.id}`;
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
  const dateCompare = compareText(firstLeftDate, firstRightDate);
  if (dateCompare !== 0) return dateCompare;

  return compareText(left.rows[0]?.id ?? 0, right.rows[0]?.id ?? 0);
};

const buildGroupedRecords = (records) => {
  const groups = new Map();

  records.forEach((record) => {
    const groupKey = getPinceGroupKey(record);

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        key: groupKey,
        numeroPince: record.numero_pince ?? null,
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
  [
    record.test_value_1,
    record.test_value_2,
    record.test_value_3,
    record.test_value_4,
    record.test_value_5,
  ].filter((value) => value !== null && value !== undefined && value !== '');

const PincePreventiveCalendar = ({ searchQuery = '' }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowForm, setRowForm] = useState({
    open: false,
    mode: 'create',
    group: null,
    record: null,
    data: null,
    saving: false,
    error: '',
  });

  useEffect(() => {
    loadRecords();
  }, []);

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
        record.numero_pince,
        record.reference_more,
        record.position,
        record.cosse,
        record.fil,
        record.traction_minimale_n,
        record.test_value_1,
        record.test_value_2,
        record.test_value_3,
        record.test_value_4,
        record.test_value_5,
        record.date_controle,
        record.date_prochaine,
        record.moyenne,
        record.remarque,
      ].some((field) => normalizeText(field).includes(normalizedSearch));
    });
  }, [records, normalizedSearch]);

  const groupedRecords = useMemo(() => buildGroupedRecords(filteredRecords), [filteredRecords]);

  const overdueCount = useMemo(() => {
    return groupedRecords.filter((group) => getGroupScheduleInfo(group).key === 'overdue').length;
  }, [groupedRecords]);

  const isEditingRow = rowForm.mode === 'edit';

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

  const renderValues = (record) => {
    const measurementValues = getMeasurementValues(record);
    const hasAverage = record.moyenne !== null && record.moyenne !== undefined && record.moyenne !== '';

    if (measurementValues.length === 0 && !hasAverage) {
      return <span className="text-slate-400">-</span>;
    }

    return (
      <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto text-sm text-slate-700">
        {measurementValues.map((value, valueIndex) => (
          <span key={`${record.id}-value-${valueIndex}`} className="font-medium text-slate-700">
            {value}
          </span>
        ))}
        {hasAverage && (
          <>
            {measurementValues.length > 0 && <span className="text-slate-300">|</span>}
            <span className="font-semibold text-slate-900">moy. {record.moyenne}</span>
          </>
        )}
      </div>
    );
  };

  const openAddRowModal = (group) => {
    const schedule = getGroupScheduleInfo(group);
    if (!schedule.canAdd) return;

    setRowForm({
      open: true,
      mode: 'create',
      group,
      record: null,
      data: buildNewRowDraft(group),
      saving: false,
      error: '',
    });
  };

  const openEditRowModal = (group, record) => {
    if (!record) return;

    setRowForm({
      open: true,
      mode: 'edit',
      group,
      record,
      data: buildEditRowDraft(record),
      saving: false,
      error: '',
    });
  };

  const closeRowModal = () => {
    setRowForm({
      open: false,
      mode: 'create',
      group: null,
      record: null,
      data: null,
      saving: false,
      error: '',
    });
  };

  const handleDeleteRow = async (record) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer la ligne du ${formatDate(record.date_controle)} pour ${formatValue(
        record.numero_pince
      )} ?`
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
    setRowForm((current) => {
      const updated = { ...current.data, [name]: value };
      if (name === 'date_controle' && current.mode === 'create') {
        updated.date_prochaine = addSixMonths(value);
      }
      return { ...current, data: updated };
    });
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
      const message =
        error?.response?.data?.message ||
        error.message ||
        (rowForm.mode === 'edit' ? 'Erreur lors de la modification de la ligne' : 'Erreur lors de la création de la ligne');
      console.error('Erreur ligne preventive:', error);
      setRowForm((current) => ({ ...current, saving: false, error: message }));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Chargement du suivi préventif des pinces…</p>
        </div>
      </div>
    );
  }

  if (groupedRecords.length === 0) {
    return (
      <div className="mt-4 flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
            <Wrench className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Suivi préventif des pinces</p>
            <p className="text-xs text-slate-400">Aucun enregistrement ne correspond à la recherche.</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-14">
          <Wrench className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-sm text-slate-400">Aucune pince trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
            <Wrench className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Suivi préventif des pinces</p>
            <p className="text-xs text-slate-400">Groupé par N° pince — valeurs de traction mesurées</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{groupedRecords.length} pince(s)</span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{filteredRecords.length} ligne(s)</span>
          {overdueCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">{overdueCount} en retard</span>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['N° Pince','Date contrôle','Référence','Position','Cosse','Fil','Traction min.','Valeurs','Prochaine','Remarque','Actions'].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {groupedRecords.map((group) =>
              group.rows.map((record, rowIndex) => {
                const rowKey = record.id ?? `${group.key}-${rowIndex}`;
                const schedule = getGroupScheduleInfo(group);

                return (
                  <tr key={rowKey} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-sky-50/30 transition-colors`}>
                    {renderMergedCell(group, 'numero_pince', record, rowIndex, 'px-3 py-3 align-top border-l-2 border-sky-200', (value) => (
                      <div className="flex flex-col gap-2 min-w-[110px]">
                        <span className="font-mono font-bold text-sky-700 text-sm">{formatValue(normalizePinceNumber(value))}</span>
                        <span className={`inline-flex items-center self-start rounded-full border px-2 py-0.5 text-[11px] font-semibold ${schedule.chipClass}`}>
                          {schedule.label}
                        </span>
                        {group.rows.length > 1 && (
                          <span className="text-[11px] text-slate-400">{group.rows.length} mesures</span>
                        )}
                        <button
                          type="button"
                          onClick={() => openAddRowModal(group)}
                          disabled={!schedule.canAdd}
                          title={schedule.canAdd ? 'Ajouter une nouvelle mesure' : 'Disponible quand la pince est en retard ou prévue cette semaine'}
                          className={`inline-flex items-center gap-1 self-start rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                            schedule.canAdd
                              ? 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                          Ajouter
                        </button>
                      </div>
                    ))}

                    {renderMergedCell(group, 'date_controle', record, rowIndex, 'px-3 py-3 align-top text-xs text-slate-600', (value) => (
                      <span>{formatDate(value)}</span>
                    ))}

                    {renderMergedCell(group, 'reference_more', record, rowIndex, 'px-3 py-3 align-top text-xs text-slate-600', (value) => (
                      <span>{formatValue(value)}</span>
                    ))}

                    <td className="px-3 py-3 align-top text-xs text-slate-600">{formatValue(record.position)}</td>

                    {renderMergedCell(group, 'cosse', record, rowIndex, 'px-3 py-3 align-top text-xs text-slate-600', (value) => (
                      <span>{formatValue(value)}</span>
                    ))}

                    <td className="px-3 py-3 align-top text-xs text-slate-600">{formatValue(record.fil)}</td>

                    <td className="px-3 py-3 align-top text-xs font-mono text-slate-600">{formatValue(record.traction_minimale_n)}</td>

                    <td className="px-3 py-3 align-top text-xs text-slate-600">{renderValues(record)}</td>

                    {renderMergedCell(group, 'date_prochaine', record, rowIndex, 'px-3 py-3 align-top text-xs', (value) => (
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          isPastDate(value) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {formatDate(value)}
                      </span>
                    ))}

                    {renderMergedCell(group, 'remarque', record, rowIndex, 'px-3 py-3 align-top text-xs text-slate-600', (value) => (
                      <span>{formatValue(value)}</span>
                    ))}

                    <td className="px-3 py-3 align-top">
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => openEditRowModal(group, record)}
                          title="Modifier cette ligne"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => handleDeleteRow(record)}
                          title="Supprimer cette ligne"
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
              <label className="block rounded-xl bg-slate-50 px-4 py-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">N° Pince</span>
                <input
                  type="text"
                  name="numero_pince"
                  value={rowForm.data.numero_pince}
                  onChange={handleRowFormChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="block rounded-xl bg-slate-50 px-4 py-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Référence</span>
                <input
                  type="text"
                  name="reference_more"
                  value={rowForm.data.reference_more}
                  onChange={handleRowFormChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="block rounded-xl bg-slate-50 px-4 py-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cosse</span>
                <input
                  type="text"
                  name="cosse"
                  value={rowForm.data.cosse}
                  onChange={handleRowFormChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date contrôle</span>
                <input
                  type="date"
                  name="date_controle"
                  value={rowForm.data.date_controle}
                  onChange={handleRowFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date prochaine</span>
                <input
                  type="date"
                  name="date_prochaine"
                  value={rowForm.data.date_prochaine}
                  onChange={handleRowFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Position</span>
                <input
                  type="text"
                  name="position"
                  value={rowForm.data.position}
                  onChange={handleRowFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="ex: 0.75"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Fil</span>
                <input
                  type="text"
                  name="fil"
                  value={rowForm.data.fil}
                  onChange={handleRowFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="ex: 1"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Traction minimale</span>
                <input
                  type="text"
                  name="traction_minimale_n"
                  value={rowForm.data.traction_minimale_n}
                  onChange={handleRowFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="ex: 90"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-5">
              {[1, 2, 3, 4, 5].map((index) => (
                <label key={`test_value_${index}`} className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Valeur {index}</span>
                  <input
                    type="text"
                    name={`test_value_${index}`}
                    value={rowForm.data[`test_value_${index}`]}
                      onChange={handleRowFormChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder="0"
                  />
                </label>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Remarque</span>
              <textarea
                name="remarque"
                value={rowForm.data.remarque}
                onChange={handleRowFormChange}
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="Commentaires sur cette nouvelle mesure..."
              />
            </label>

            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={rowForm.saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: rowForm.saving ? '#94a3b8' : 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
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
    </>
  );
};

export default PincePreventiveCalendar;