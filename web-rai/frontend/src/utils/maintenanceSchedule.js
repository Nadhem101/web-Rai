// ─────────────────────────────────────────────────────────────────────────────
// Shared maintenance schedule data and helpers
// Used by Dashboard and CalendrierPreventif
// ─────────────────────────────────────────────────────────────────────────────

export const EQUIPEMENTS = [
  { code: 'EQUIP347', designation: 'Machine de coupe',       zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 2, color: 'blue'  }] },
  { code: 'EQUIP210', designation: 'Marquage a chaud',       zone: 'Electronique', intervals: [{ type: '6M', freq: 26, start: 3, color: 'green' }] },
  { code: 'EQUIP395', designation: 'Machine de coupe',       zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 3, color: 'blue'  }] },
  { code: 'EQUIP432', designation: 'Machine de coupe',       zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 4, color: 'blue'  }] },
  { code: 'EQUIP355', designation: 'Machine de coupe',       zone: 'Cablage',      intervals: [{ type: '6M', freq: 26, start: 2, color: 'green' }] },
  { code: 'EQUIP349', designation: 'Machine de marquage',    zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 1, color: 'blue'  }] },
  { code: 'EQUIP451', designation: 'Machine de marquage',    zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 2, color: 'blue'  }] },
  { code: 'EQUIP476', designation: 'Machine de degraissage', zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 1, color: 'blue'  }, { type: '6M', freq: 26, start: 1, color: 'green' }] },
  { code: 'EQUIP75',  designation: 'Machine de coupe',       zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 2, color: 'blue'  }] },
  { code: 'EQUIP353', designation: 'Bottleuse',              zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 3, color: 'blue'  }] },
  { code: 'EQUIP457', designation: 'Bottleuse',              zone: 'Cablage',      intervals: [{ type: '6M', freq: 26, start: 4, color: 'green' }] },
  { code: 'EQUIP444', designation: 'Pressmanuel',            zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 1, color: 'blue'  }, { type: '6M', freq: 26, start: 1, color: 'green' }] },
  { code: 'EQUIP86',  designation: 'Machine de sertissage',  zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 4, color: 'blue'  }] },
  { code: 'EQUIP405', designation: 'Machine de sertissage',  zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 1, color: 'blue'  }] },
  { code: 'EQUIP342', designation: 'Machine de sertissage',  zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 2, color: 'blue'  }] },
  { code: 'EQUIP343', designation: 'Machine de sertissage',  zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 3, color: 'blue'  }] },
  { code: 'EQUIP450', designation: 'Machine de sertissage',  zone: 'Cablage',      intervals: [{ type: '6M', freq: 26, start: 2, color: 'green' }] },
  { code: 'EQUIP194', designation: 'Machine de sertissage',  zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 4, color: 'blue'  }] },
  { code: 'EQUIP85',  designation: 'Machine coupe gain',     zone: 'Electronique', intervals: [{ type: '1M', freq: 4,  start: 1, color: 'blue'  }, { type: '6M', freq: 26, start: 1, color: 'green' }] },
  { code: 'EQUIP391', designation: 'Machine de sertissage',  zone: 'Cablage',      intervals: [{ type: '6M', freq: 26, start: 5, color: 'green' }] },
  { code: 'EQUIP458', designation: 'Machine de sertissage',  zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 2, color: 'blue'  }] },
  { code: 'EQUIP340', designation: 'Machine de denudage',    zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 3, color: 'blue'  }] },
  { code: 'EQUIP63',  designation: 'Machine de denudage',    zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 4, color: 'blue'  }] },
  { code: 'EQUIP459', designation: 'Machine de denudage',    zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 1, color: 'blue'  }] },
  { code: 'EQUIP460', designation: 'Machine de denudage',    zone: 'Cablage',      intervals: [{ type: '6M', freq: 26, start: 3, color: 'green' }] },
  { code: 'EQUIP461', designation: 'Machine de denudage',    zone: 'Cablage',      intervals: [{ type: '1M', freq: 4,  start: 2, color: 'blue'  }] },
  { code: 'EQUIP462', designation: 'Machine de denudage',    zone: 'Cablage',      intervals: [{ type: '6M', freq: 26, start: 1, color: 'green' }] },
  { code: 'EQUIP341', designation: 'Machine insertion',      zone: 'Electronique', intervals: [{ type: '1M', freq: 4,  start: 4, color: 'blue'  }, { type: '6M', freq: 26, start: 4, color: 'green' }] },
  { code: 'EQUIP384', designation: 'Machine ULTRASON',       zone: 'Electronique', intervals: [{ type: '1M', freq: 4,  start: 1, color: 'blue'  }] },
  { code: 'EQUIP473', designation: 'Machine ULTRASON',       zone: 'Electronique', intervals: [{ type: '6M', freq: 26, start: 2, color: 'green' }] },
  { code: 'EQUIP46',  designation: 'Machine Vague',          zone: 'Electronique', intervals: [{ type: '1M', freq: 4,  start: 3, color: 'blue'  }, { type: '6M', freq: 26, start: 3, color: 'green' }] },
  { code: 'EQUIP466', designation: 'Machine de lavage',      zone: 'Electronique', intervals: [{ type: '1M', freq: 4,  start: 2, color: 'blue'  }] },
  { code: 'EQUIP95',  designation: 'Machine de coupe PCB',   zone: 'Electronique', intervals: [{ type: '6M', freq: 26, start: 4, color: 'green' }] },
  { code: 'EQUIP65',  designation: 'Insertion cross',        zone: 'Electronique', intervals: [{ type: '1M', freq: 4,  start: 1, color: 'blue'  }, { type: '6M', freq: 26, start: 27, color: 'green' }] },
];

export const WEEKS = Array.from({ length: 53 }, (_, i) => i + 1);

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
 * Returns all scheduled maintenance tasks for a given week.
 * Each item: { key, equip, intType, color }
 * key format: `${equip.code}__${intType}__${week}`
 */
export function getTasksForWeek(week) {
  const tasks = [];
  EQUIPEMENTS.forEach((equip) => {
    equip.intervals.forEach((intv) => {
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
export function getOverdueTasks(currentWeek) {
  const tasks = [];
  for (let w = 1; w < currentWeek; w++) {
    getTasksForWeek(w).forEach((t) => tasks.push({ ...t, week: w }));
  }
  return tasks;
}
