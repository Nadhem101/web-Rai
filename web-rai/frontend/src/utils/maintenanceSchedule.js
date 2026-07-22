// ─────────────────────────────────────────────────────────────────────────────
// Shared maintenance schedule helpers — driven entirely by each equipement's
// `maintenance_intervals` column (no static/hardcoded schedule).
// Used by Dashboard and CalendrierPreventif.
// ─────────────────────────────────────────────────────────────────────────────

export const WEEKS = Array.from({ length: 53 }, (_, i) => i + 1);

const normalizeCode = (value = '') => String(value ?? '').replace(/﻿/g, '').trim().toUpperCase();

/**
 * Resolves an API equipement row into the shape the schedule/calendar UI needs:
 * { code, code_rai, id, categorie, designation, zone, intervals, machine_template_id, MachineTemplate }
 * `intervals` comes straight from the DB (`maintenance_intervals`); equipements
 * without a configured schedule simply have no intervals — nothing is guessed.
 */
export function resolveEquipement(item) {
  const code = normalizeCode(item.code_rai || item.code);
  const intervals = Array.isArray(item.maintenance_intervals) ? item.maintenance_intervals : [];

  return {
    code,
    code_rai: code,
    id: item.id,
    categorie: item.categorie,
    designation: item.designation,
    zone: item.Zone?.nom_zone || item.zone,
    Zone: item.Zone,
    intervals,
    machine_template_id: item.machine_template_id ?? null,
    MachineTemplate: item.MachineTemplate ?? null,
  };
}

/** Returns the current ISO week number (1-53) */
export function getCurrentWeek() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diff = now - startOfYear;
  return Math.ceil((diff / 86400000 + startOfYear.getDay() + 1) / 7);
}

/** Returns true if `week` is a scheduled maintenance week */
export function isMaintenance(week, freq, start) {
  if (week < start) return false;
  return (week - start) % freq === 0;
}

/**
 * Returns all scheduled maintenance tasks for a given week, across the given
 * (already-resolved) equipements list.
 * Each item: { key, equip, intType, color }
 * key format: `${equip.code}__${intType}__${week}`
 */
export function getTasksForWeek(resolvedEquipements, week) {
  const tasks = [];
  resolvedEquipements.forEach((equip) => {
    (equip.intervals || []).forEach((intv) => {
      if (isMaintenance(week, intv.freq, intv.start)) {
        tasks.push({
          key: `${equip.code}__${intv.type}__${week}`,
          equip,
          intType: intv.type,
          color: intv.color,
        });
      }
    });
  });
  return tasks;
}

/**
 * Returns all scheduled tasks from week 1 up to (but not including) the current week.
 * Used to detect overdue (past, not marked done) tasks.
 */
export function getOverdueTasks(resolvedEquipements, currentWeek) {
  const tasks = [];
  for (let w = 1; w < currentWeek; w++) {
    getTasksForWeek(resolvedEquipements, w).forEach((t) => tasks.push({ ...t, week: w }));
  }
  return tasks;
}
