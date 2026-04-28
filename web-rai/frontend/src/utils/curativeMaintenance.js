export const FISCAL_MONTHS = [
  { month: 4, label: 'Avril' },
  { month: 5, label: 'Mai' },
  { month: 6, label: 'Juin' },
  { month: 7, label: 'Juillet' },
  { month: 8, label: 'Août' },
  { month: 9, label: 'Septembre' },
  { month: 10, label: 'Octobre' },
  { month: 11, label: 'Novembre' },
  { month: 12, label: 'Décembre' },
  { month: 1, label: 'Janvier' },
  { month: 2, label: 'Février' },
  { month: 3, label: 'Mars' },
];

export const normalizeSearchValue = (value = '') =>
  String(value ?? '')
    .replace(/\uFEFF/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const buildEquipmentLabel = (equipment = {}) => {
  const code = String(equipment.code_rai ?? equipment.equipement_code ?? equipment.code ?? '').trim();
  const designation = String(equipment.designation ?? equipment.equipement_label ?? '').trim();

  if (!code && !designation) {
    return '';
  }

  if (!designation) {
    return code;
  }

  if (!code) {
    return designation;
  }

  return `${code} • ${designation}`;
};

const parseTimeToMinutes = (value) => {
  const normalized = String(value ?? '').replace(/\uFEFF/g, '').trim();
  if (!normalized) return null;

  const match = normalized.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || 0);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return null;
  }

  return (hours * 60) + minutes + (seconds / 60);
};

const computeRangeMinutes = (startValue, endValue) => {
  const start = parseTimeToMinutes(startValue);
  const end = parseTimeToMinutes(endValue);

  if (start === null || end === null) {
    return null;
  }

  let duration = end - start;
  if (duration < 0) {
    duration += 24 * 60;
  }

  return Number(duration.toFixed(2));
};

export const computeCurativeDurations = ({ requestTime, startedTime, finishedTime }) => {
  const responseMinutes = computeRangeMinutes(requestTime, startedTime);
  const downtimeMinutes = computeRangeMinutes(startedTime, finishedTime);

  return {
    responseMinutes,
    downtimeMinutes,
  };
};

export const formatMinutes = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const number = Number(value);
  if (!Number.isFinite(number)) {
    return '-';
  }

  const rounded = Number(number.toFixed(2));
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toString()} min`;
};

export const parseDateOnly = (value) => {
  const normalized = String(value ?? '').replace(/\uFEFF/g, '').trim();
  if (!normalized) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  const parts = normalized.split(/[/-]/).map((part) => part.trim());
  if (parts.length !== 3) return '';

  const [first, second, third] = parts;
  if (first.length === 4) {
    return `${first}-${String(second).padStart(2, '0')}-${String(third).padStart(2, '0')}`;
  }

  return `${third}-${String(second).padStart(2, '0')}-${String(first).padStart(2, '0')}`;
};

export const getIsoWeekNumber = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
};

export const buildWeekLabel = (value) => {
  const weekNumber = getIsoWeekNumber(value);
  return weekNumber ? `KW ${String(weekNumber).padStart(2, '0')}` : '';
};

export const getFiscalYearStart = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const month = date.getMonth() + 1;
  return month >= 4 ? date.getFullYear() : date.getFullYear() - 1;
};

export const getFiscalYearLabel = (yearStart) => `${yearStart}/${yearStart + 1}`;