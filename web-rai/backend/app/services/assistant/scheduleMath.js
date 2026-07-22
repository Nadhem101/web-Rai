// Ported verbatim from frontend/src/utils/maintenanceSchedule.js — same math,
// so the assistant's answers about préventif schedules can't drift from what
// the dashboard/calendar actually show. Pure, dependency-free functions only.

const normalizeCode = (value = '') => String(value ?? '').replace(/﻿/g, '').trim().toUpperCase();

/**
 * Resolves an API equipement row (with maintenance_intervals + optional Zone
 * include) into { code, designation, zone, intervals }. Equipements without a
 * configured schedule simply have no intervals — nothing is guessed.
 */
function resolveEquipement(item) {
  const code = normalizeCode(item.code_rai || item.code);
  const intervals = Array.isArray(item.maintenance_intervals) ? item.maintenance_intervals : [];
  return {
    code,
    code_rai: code,
    id: item.id,
    categorie: item.categorie,
    designation: item.designation,
    zone: item.Zone?.nom_zone || item.zone || null,
    intervals,
  };
}

/** Returns the current ISO week number (1-53) */
function getCurrentWeek() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diff = now - startOfYear;
  return Math.ceil((diff / 86400000 + startOfYear.getDay() + 1) / 7);
}

/** Returns true if `week` is a scheduled maintenance week */
function isMaintenance(week, freq, start) {
  if (week < start) return false;
  return (week - start) % freq === 0;
}

/** All scheduled tasks for one week across the given resolved equipements. */
function getTasksForWeek(resolvedEquipements, week) {
  const tasks = [];
  resolvedEquipements.forEach((equip) => {
    (equip.intervals || []).forEach((intv) => {
      if (isMaintenance(week, intv.freq, intv.start)) {
        tasks.push({ key: `${equip.code}__${intv.type}__${week}`, equip, intType: intv.type, week });
      }
    });
  });
  return tasks;
}

/** All scheduled tasks from week 1 up to (but not including) the current week. */
function getOverdueTasks(resolvedEquipements, currentWeek) {
  const tasks = [];
  for (let w = 1; w < currentWeek; w++) {
    getTasksForWeek(resolvedEquipements, w).forEach((t) => tasks.push(t));
  }
  return tasks;
}

module.exports = { resolveEquipement, getCurrentWeek, isMaintenance, getTasksForWeek, getOverdueTasks };
