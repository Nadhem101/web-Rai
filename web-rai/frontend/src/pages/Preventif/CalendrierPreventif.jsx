import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipementService, maintenanceEventService } from '../../services/api';
import { EQUIPEMENTS, WEEKS, getCurrentWeek, isMaintenance } from '../../utils/maintenanceSchedule';
import { getMaintenanceMachineTemplate, resolveMaintenanceMachineKeyFromEquipment } from '../../data/maintenanceMachines';
import { Search, Settings2 } from 'lucide-react';
import DataLabel from '../../components/ui/DataLabel.jsx';

const DEFAULT_INTERVALS = [{ type: '1M', freq: 4, start: 1, color: 'blue' }];

const SCHEDULE_LOOKUP = new Map(EQUIPEMENTS.map((equipement) => [equipement.code, equipement]));

const normalizeText = (value = '') =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const normalizeCode = (value = '') => String(value ?? '').replace(/\uFEFF/g, '').trim().toUpperCase();

const isMainCalendarEquipment = (equipement) => {
  const category = normalizeText(equipement?.categorie);
  return category === '' || category === 'equipement';
};

const isStandardCalendarEquipment = (equipement) => {
  return isMainCalendarEquipment(equipement) && !isFerEtBainEquipment(equipement);
};

const isFerEtBainEquipment = (equipement) => {
  const category = normalizeText(equipement?.categorie);
  if (['fer-et-bain', 'fer-a-souder', 'bain-creuset'].includes(category)) return true;
  // Fallback for items not yet re-categorized: catch by designation name
  const designation = normalizeText(equipement?.designation);
  return designation.includes('fer a souder') || designation.includes('bain creuset');
};

const CALENDAR_VIEWS = [
  {
    id: 'assemblage-meca',
    label: 'Assemblage Meca',
    title: 'Calendrier des preventives systematiques — Assemblage Mecanique',
    subtitle: '" KW01 ===> KW53 "',
    reference: 'FQ024/00',
    matches: (equipement) => {
      const zone = normalizeText(equipement?.Zone?.nom_zone || equipement?.zone);
      return isStandardCalendarEquipment(equipement) && ['bobinage', 'embases relais'].includes(zone);
    },
  },
  {
    id: 'faisceau-cable',
    label: 'Faisceau Cable',
    title: 'Calendrier des preventives systematiques — Faisceau Cable',
    subtitle: '" KW01 ===> KW53 "',
    reference: 'FQ024/00',
    matches: (equipement) => {
      const zone = normalizeText(equipement?.Zone?.nom_zone || equipement?.zone);
      return isStandardCalendarEquipment(equipement) && ['club', 'cablage'].includes(zone);
    },
  },
  {
    id: 'electronique',
    label: 'Electronique',
    title: 'Calendrier des preventives systematiques — Electronique',
    subtitle: '" KW01 ===> KW53 "',
    reference: 'FQ024/00',
    matches: (equipement) => {
      const zone = normalizeText(equipement?.Zone?.nom_zone || equipement?.zone);
      return isStandardCalendarEquipment(equipement) && zone === 'electronique';
    },
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    title: 'Calendrier des preventives systematiques — Maintenance',
    subtitle: '" KW01 ===> KW53 "',
    reference: 'FQ024/00',
    matches: (equipement) => {
      const zone = normalizeText(equipement?.Zone?.nom_zone || equipement?.zone);
      return isStandardCalendarEquipment(equipement) && zone === 'maintenance';
    },
  },
  {
    id: 'fer-et-bain',
    label: 'Fer et bain',
    title: 'Calendrier des preventives systematiques de Fer et Bain',
    subtitle: '" KW01 ===> KW53 "',
    reference: 'FQ024/00',
    matches: (equipement) => isFerEtBainEquipment(equipement),
  },
];

function resolveEquipement(item) {
  const code = normalizeCode(item.code_rai || item.code);
  const fromSchedule = SCHEDULE_LOOKUP.get(code);

  // DB intervals take priority over the static schedule when explicitly set
  const dbIntervals = Array.isArray(item.maintenance_intervals) && item.maintenance_intervals.length > 0
    ? item.maintenance_intervals
    : null;

  if (fromSchedule) {
    return {
      ...fromSchedule,
      code,
      code_rai: code,
      id: item.id,
      categorie: item.categorie,
      designation: item.designation || fromSchedule.designation,
      zone: item.Zone?.nom_zone || item.zone || fromSchedule.zone,
      intervals: dbIntervals ?? fromSchedule.intervals,
      machine_template_id: item.machine_template_id ?? null,
      MachineTemplate: item.MachineTemplate ?? null,
    };
  }

  return {
    code,
    code_rai: code,
    id: item.id,
    categorie: item.categorie,
    designation: item.designation,
    zone: item.Zone?.nom_zone || item.zone,
    intervals: dbIntervals ?? DEFAULT_INTERVALS,
    machine_template_id: item.machine_template_id ?? null,
    MachineTemplate: item.MachineTemplate ?? null,
  };
}

const SCHEDULE_PRESETS = [
  {
    id: 'monthly',
    label: 'Mensuel',
    badge: '1M',
    desc: 'Toutes les 4 semaines',
    make: (start) => [{ type: '1M', freq: 4, start, color: 'blue' }],
  },
  {
    id: 'quarterly',
    label: 'Trimestriel',
    badge: '3M',
    desc: 'Toutes les 13 semaines',
    make: (start) => [{ type: '3M', freq: 13, start, color: 'green' }],
  },
  {
    id: 'semiannual',
    label: 'Semestriel',
    badge: '6M',
    desc: 'Toutes les 26 semaines',
    make: (start) => [{ type: '6M', freq: 26, start, color: 'green' }],
  },
  {
    id: 'both',
    label: 'Mensuel + Semestriel',
    badge: '1M+6M',
    desc: 'Planning mensuel (4 sem.) et semestriel (26 sem.)',
    make: (start) => [
      { type: '1M', freq: 4, start, color: 'blue' },
      { type: '6M', freq: 26, start, color: 'green' },
    ],
  },
  {
    id: 'none',
    label: 'Retirer du calendrier',
    badge: '—',
    desc: 'Aucune maintenance planifiée',
    make: () => [],
  },
];

function detectPreset(intervals) {
  if (!intervals || intervals.length === 0) return 'none';
  const types = intervals.map((i) => i.type).sort().join('+');
  if (types === '1M') return 'monthly';
  if (types === '3M') return 'quarterly';
  if (types === '6M') return 'semiannual';
  if (types === '1M+6M' || types === '6M+1M') return 'both';
  return null;
}

function ScheduleModal({ modal, onSave, onClose }) {
  const [preset,    setPreset]    = useState(null);
  const [startWeek, setStartWeek] = useState(1);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    if (!modal) return;
    const intervals = modal.equip?.intervals || [];
    setPreset(detectPreset(intervals));
    setStartWeek(intervals[0]?.start ?? 1);
    setSaving(false);
    setError('');
  }, [modal]);

  if (!modal) return null;

  const selectedPreset = SCHEDULE_PRESETS.find((p) => p.id === preset);

  const handleSave = async () => {
    if (!selectedPreset) { setError('Veuillez choisir un planning.'); return; }
    const start = parseInt(startWeek, 10) || 1;
    setSaving(true);
    setError('');
    try {
      await onSave(modal.equip, selectedPreset.make(start));
    } catch {
      setError('Erreur lors de la sauvegarde.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-[16px] shadow-2xl w-[400px] overflow-hidden" style={{ background: 'var(--panel)' }}>
        {/* Header */}
        <div className="px-5 py-4 flex items-start justify-between" style={{ background: 'linear-gradient(135deg, #0d1828, #0a2820)' }}>
          <div>
            <p className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Settings2 className="w-4 h-4 opacity-70" /> Configurer le planning
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className="font-mono text-slate-300">{modal.equip.code}</span>
              <span className="mx-1.5 opacity-40">·</span>
              <span className="truncate">{modal.equip.designation}</span>
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-base flex-shrink-0">✕</button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          {/* Presets */}
          <div className="space-y-1.5">
            {SCHEDULE_PRESETS.map((p) => {
              const active = preset === p.id;
              return (
                <button key={p.id} onClick={() => setPreset(p.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left transition-colors"
                  style={active
                    ? { background: 'var(--accent-soft)', border: '1.5px solid var(--accent)' }
                    : { border: '1px solid var(--border)', background: 'var(--panel2)' }}>
                  <span className="inline-flex items-center justify-center min-w-[46px] h-6 rounded px-1.5 text-[10px] font-bold font-mono flex-shrink-0"
                    style={{ background: active ? 'var(--accent)' : 'var(--panel3)', color: active ? '#fff' : 'var(--text3)' }}>
                    {p.badge}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: active ? 'var(--accent)' : 'var(--text)' }}>{p.label}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>{p.desc}</p>
                  </div>
                  {active && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />}
                </button>
              );
            })}
          </div>

          {/* Start week — hide for 'none' */}
          {preset !== 'none' && (
            <div className="pt-1">
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text3)' }}>
                Semaine de départ (1 – 53)
              </label>
              <div className="flex items-center gap-3">
                <input type="number" min={1} max={53} value={startWeek}
                  onChange={(e) => setStartWeek(e.target.value)}
                  className="w-20 rounded-[10px] px-3 py-2 text-sm outline-none"
                  style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                <input type="range" min={1} max={53} value={startWeek || 1}
                  className="flex-1" style={{ accentColor: 'var(--accent)' }}
                  onChange={(e) => setStartWeek(e.target.value)} />
                <span className="text-xs font-mono font-bold w-8 text-right" style={{ color: 'var(--text3)' }}>KW{String(startWeek || 1).padStart(2, '0')}</span>
              </div>
            </div>
          )}

          {error && <p className="text-xs" style={{ color: 'var(--crit)' }}>{error}</p>}

          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={saving || !preset}
              className="flex-1 py-2 rounded-[10px] text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
              {saving ? 'Sauvegarde…' : 'Confirmer'}
            </button>
            <button onClick={onClose}
              className="flex-1 py-2 rounded-[10px] text-sm font-semibold transition-colors hover:bg-[var(--panel3)]"
              style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CellMenu({ popup, onDone, onReschedule, onReset, onOpenMachineSheet, onOpenFerBain, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);
  if (!popup) return null;
  const { x, y, equip, week, intType, currentStatus, machineKey, machineLabel, isFerBain } = popup;
  return (
    <div
      ref={ref}
      className="fixed z-50 rounded-[12px] py-1 w-60 overflow-hidden"
      style={{ top: y, left: x, background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
    >
      <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border2)', background: 'var(--panel2)' }}>
        <div className="font-mono font-bold text-xs" style={{ color: 'var(--text)' }}>{equip.code}</div>
        <div className="text-xs truncate mt-0.5" style={{ color: 'var(--text2)' }}>{equip.designation}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>KW{String(week).padStart(2,'0')}</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: 'var(--panel3)', color: 'var(--text2)' }}>{intType}</span>
        </div>
        {machineKey && !isFerBain && (
          <div className="mt-1 text-[11px] font-medium" style={{ color: 'var(--accent)' }}>{machineLabel || machineKey}</div>
        )}
      </div>
      <div className="py-1">
        {isFerBain && (
          <button className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors hover:bg-[var(--accent-soft)]" style={{ color: 'var(--accent)' }} onClick={onOpenFerBain}>
            🌡 Enregistrer une valeur
          </button>
        )}
        {machineKey && !isFerBain && (
          <button className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors hover:bg-[var(--accent-soft)]" style={{ color: 'var(--accent)' }} onClick={onOpenMachineSheet}>
            📋 Démarrer la fiche machine
          </button>
        )}
        {currentStatus !== 'done' && (
          <button className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors hover:bg-[var(--ok-soft)]" style={{ color: 'var(--ok)' }} onClick={onDone}>
            ✓ Marquer comme fait
          </button>
        )}
        {currentStatus !== 'rescheduled' && (
          <button className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors hover:bg-[var(--warn-soft)]" style={{ color: 'var(--warn)' }} onClick={onReschedule}>
            → Reprogrammer
          </button>
        )}
        {currentStatus && (
          <button className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors hover:bg-[var(--panel3)]" style={{ color: 'var(--text3)' }} onClick={onReset}>
            ↺ Réinitialiser
          </button>
        )}
      </div>
    </div>
  );
}

function RescheduleModal({ modal, onConfirm, onClose }) {
  const [newWeek, setNewWeek] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { if (modal) setNewWeek(String(modal.week)); }, [modal]);
  if (!modal) return null;
  const handleConfirm = () => {
    const w = parseInt(newWeek, 10);
    if (!w || w < 1 || w > 53) { setError('Entrez une semaine entre 1 et 53'); return; }
    onConfirm(w);
    setError('');
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-[16px] shadow-2xl w-80 overflow-hidden" style={{ background: 'var(--panel)' }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0d1828, #0a2820)' }}>
          <div>
            <p className="text-sm font-bold text-white font-display">Reprogrammer</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className="font-mono text-slate-300">{modal.equip.code}</span> · KW{String(modal.week).padStart(2,'0')} · {modal.intType}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-lg">✕</button>
        </div>
        <div className="p-5">
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text3)' }}>Nouvelle semaine (1 – 53)</label>
          <div className="flex gap-2 mb-2">
            <input type="number" min={1} max={53} value={newWeek} autoFocus
              className="flex-1 rounded-[10px] px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              onChange={(e) => { setNewWeek(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()} />
            <span className="text-sm self-center font-semibold" style={{ color: 'var(--text2)' }}>KW</span>
          </div>
          <input type="range" min={1} max={53} value={newWeek || 1}
            className="w-full mb-3" style={{ accentColor: 'var(--accent)' }}
            onChange={(e) => { setNewWeek(e.target.value); setError(''); }} />
          {error && <p className="text-xs mb-3" style={{ color: 'var(--crit)' }}>{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleConfirm}
              className="flex-1 py-2 rounded-[10px] text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
              Confirmer
            </button>
            <button onClick={onClose}
              className="flex-1 py-2 rounded-[10px] text-sm font-semibold transition-colors hover:bg-[var(--panel3)]"
              style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CalendrierPreventif = () => {
  const navigate = useNavigate();
  const currentWeek = getCurrentWeek();
  const currentYear = new Date().getFullYear();

  const [viewFilter, setViewFilter]             = useState(CALENDAR_VIEWS[0].id);
  const [equipements, setEquipements]           = useState([]);
  const [searchCode, setSearchCode]             = useState('');
  const [highlightedEquip, setHighlightedEquip] = useState(null);
  const [cellStates, setCellStates]             = useState({});
  const [popup, setPopup]                       = useState(null);
  const [rescheduleModal, setRescheduleModal]   = useState(null);
  const [scheduleModal, setScheduleModal]       = useState(null);
  const [loadingEquipements, setLoadingEquipements] = useState(true);
  const [loadingEvents, setLoadingEvents]       = useState(true);
  const [savingKeys, setSavingKeys]             = useState(new Set());
  const [apiError, setApiError]                 = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoadingEquipements(true);

    equipementService
      .getAll()
      .then(({ data }) => {
        if (cancelled) return;
        setEquipements(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (cancelled) return;
        setEquipements([]);
        setApiError('Impossible de charger les equipements du calendrier.');
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingEquipements(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Load saved events from DB on mount
  useEffect(() => {
    setLoadingEvents(true);
    maintenanceEventService.getByYear(currentYear)
      .then(({ data }) => {
        const states = {};
        data.forEach(({ equip_code, interval_type, week, status, new_week }) => {
          const key = `${equip_code}__${interval_type}__${week}`;
          states[key] = { status, newWeek: new_week || undefined };
        });
        setCellStates(states);
      })
      .catch(() => setApiError('Impossible de charger les evenements. Les modifications ne seront pas sauvegardees.'))
      .finally(() => setLoadingEvents(false));
  }, [currentYear]);

  // Helper to parse key back to API fields
  const keyToFields = (key) => {
    const [equip_code, interval_type, weekStr] = key.split('__');
    return { equip_code, interval_type, week: parseInt(weekStr, 10), year: currentYear };
  };

  const selectedView = useMemo(() => {
    return CALENDAR_VIEWS.find((view) => view.id === viewFilter) || CALENDAR_VIEWS[0];
  }, [viewFilter]);

  const viewEquipements = useMemo(() => {
    return equipements
      .filter((equipement) => selectedView.matches(equipement))
      .slice()
      .sort((left, right) =>
        String(left.code_rai || '').localeCompare(String(right.code_rai || ''), 'fr', {
          numeric: true,
          sensitivity: 'base',
        })
      )
      .map(resolveEquipement);
  }, [equipements, selectedView]);

  const filteredEquipements = useMemo(() => {
    return viewEquipements.filter((e) => {
      const matchCode = searchCode === '' ||
        e.code.toLowerCase().includes(searchCode.toLowerCase()) ||
        e.designation.toLowerCase().includes(searchCode.toLowerCase());
      return matchCode;
    });
  }, [viewEquipements, searchCode]);

  const scheduledCells = useMemo(() => {
    const index = {};
    filteredEquipements.forEach((equip) => {
      equip.intervals.forEach((intv) => {
        WEEKS.forEach((w) => {
          if (isMaintenance(w, intv.freq, intv.start)) {
            index[`${equip.code}__${intv.type}__${w}`] = { color: intv.color, equip, week: w, intType: intv.type };
          }
        });
      });
    });
    return index;
  }, [filteredEquipements]);

  const allCells = useMemo(() => {
    const cells = { ...scheduledCells };
    Object.entries(cellStates).forEach(([key, state]) => {
      if (state.status === 'rescheduled' && state.newWeek) {
        const parts = key.split('__');
        const equipCode = parts[0];
        const intType   = parts[1];
        const newKey    = `${equipCode}__${intType}__${state.newWeek}`;
        const original  = scheduledCells[key];
        // Only inject the target if that week isn't already its own scheduled maintenance
        if (original && !scheduledCells[newKey]) {
          cells[newKey] = { ...original, week: state.newWeek, isRescheduledTarget: true, originalKey: key };
        }
      }
    });
    return cells;
  }, [scheduledCells, cellStates]);

  const doneCount         = Object.values(cellStates).filter(s => s.status === 'done').length;
  const currentWeekTasks  = Object.keys(allCells).filter(k => k.endsWith(`__${currentWeek}`)).length;
  const currentWeekDone   = Object.entries(cellStates).filter(([k, s]) => k.endsWith(`__${currentWeek}`) && s.status === 'done').length;

  const handleCellClick = useCallback((e, key, cellData) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(rect.right + 4, window.innerWidth - 234);
    const y = Math.min(rect.top, window.innerHeight - 210);
    // DB assignment takes priority; fall back to text-matching for equipment without explicit assignment
    const dbTemplate = cellData.equip?.MachineTemplate;
    const machineKey = dbTemplate?.machineKey ?? resolveMaintenanceMachineKeyFromEquipment(cellData.equip);
    const machineTemplate = dbTemplate ?? (machineKey ? getMaintenanceMachineTemplate(machineKey) : null);

    // Rescheduled target cells must redirect to the original key so that
    // Done / Reset / Reschedule all operate on the correct DB record.
    const activeKey = (cellData.isRescheduledTarget && cellData.originalKey) ? cellData.originalKey : key;
    const [, activeIntType, activeWeekStr] = activeKey.split('__');

    setPopup({
      key: activeKey,
      equip: cellData.equip,
      week: parseInt(activeWeekStr, 10),
      intType: activeIntType,
      currentStatus: cellStates[activeKey]?.status || null,
      machineKey,
      machineLabel: machineTemplate?.machineLabel || null,
      isFerBain: isFerEtBainEquipment(cellData.equip),
      x,
      y,
    });
  }, [cellStates]);

  const handleMarkDone = () => {
    const { key, equip, week, intType } = popup;
    setPopup(null);
    // Optimistic update
    setCellStates(p => ({ ...p, [key]: { status: 'done' } }));
    setSavingKeys(s => new Set(s).add(key));
    maintenanceEventService
      .upsert({ ...keyToFields(key), status: 'done', new_week: null })
      .catch(() => {
        // Rollback
        setCellStates(p => { const n = { ...p }; delete n[key]; return n; });
        setApiError(`Erreur sauvegarde pour ${equip.code} KW${week}`);
      })
      .finally(() => setSavingKeys(s => { const n = new Set(s); n.delete(key); return n; }));
  };

  const handleOpenReschedule = () => {
    setRescheduleModal({ key: popup.key, equip: popup.equip, week: popup.week, intType: popup.intType });
    setPopup(null);
  };

  const handleOpenMachineSheet = () => {
    if (!popup?.machineKey) return;
    const targetPath = `/preventif/fiches-maintenance/${popup.machineKey}`;
    setPopup(null);
    navigate(targetPath, { state: { equipment: popup.equip, machineKey: popup.machineKey } });
  };

  const handleOpenFerBain = () => {
    const equip = popup?.equip;
    setPopup(null);
    navigate('/preventif/suivi-fer-bain', { state: { equipId: equip?.id, equipCode: equip?.code } });
  };

  const handleReset = () => {
    const { key, equip, week } = popup;
    setPopup(null);
    const prev = cellStates[key];
    // Optimistic update
    setCellStates(p => { const n = { ...p }; delete n[key]; return n; });
    setSavingKeys(s => new Set(s).add(key));
    maintenanceEventService
      .remove(keyToFields(key))
      .catch(() => {
        // Rollback
        if (prev) setCellStates(p => ({ ...p, [key]: prev }));
        setApiError(`Erreur reinitialisation pour ${equip.code} KW${week}`);
      })
      .finally(() => setSavingKeys(s => { const n = new Set(s); n.delete(key); return n; }));
  };

  const handleRescheduleConfirm = (newWeek) => {
    const { key, equip, week } = rescheduleModal;
    setRescheduleModal(null);
    const prev = cellStates[key];
    // Optimistic update
    setCellStates(p => ({ ...p, [key]: { status: 'rescheduled', newWeek } }));
    setSavingKeys(s => new Set(s).add(key));
    maintenanceEventService
      .upsert({ ...keyToFields(key), status: 'rescheduled', new_week: newWeek })
      .catch(() => {
        // Rollback
        setCellStates(p => { const n = { ...p };
          if (prev) n[key] = prev; else delete n[key];
          return n;
        });
        setApiError(`Erreur reprogrammation pour ${equip.code} KW${week}`);
      })
      .finally(() => setSavingKeys(s => { const n = new Set(s); n.delete(key); return n; }));
  };

  const handleSaveSchedule = async (equip, intervals) => {
    if (!equip.id) throw new Error('ID équipement manquant');
    await equipementService.update(equip.id, { maintenance_intervals: intervals.length ? intervals : null });
    setEquipements((prev) => prev.map((e) =>
      normalizeCode(e.code_rai || e.code) === equip.code
        ? { ...e, maintenance_intervals: intervals.length ? intervals : null }
        : e
    ));
    setScheduleModal(null);
    setHighlightedEquip(null);
  };

  const activeIntervalTypes = useMemo(() => {
    const seen = new Set();
    filteredEquipements.forEach((eq) => eq.intervals.forEach((intv) => seen.add(intv.type)));
    const order = ['1M', '3M', '6M'];
    const result = order.filter((t) => seen.has(t));
    seen.forEach((t) => { if (!order.includes(t)) result.push(t); });
    return result.length > 0 ? result : ['1M', '6M'];
  }, [filteredEquipements]);

  const getCellAppearance = (key, baseColor, isCurrentWeek, rowIdx, isHighlighted) => {
    const state  = cellStates[key];
    const saving = savingKeys.has(key);
    if (saving)                   return { style: { background: 'var(--text3)', cursor: 'wait', opacity: 0.6 }, icon: '…' };
    if (state?.status === 'done') return { style: { background: 'var(--text3)', cursor: 'pointer' }, icon: '✓' };
    if (state?.status === 'rescheduled') {
      // Original slot looks empty — maintenance moved to another week
      const emptyBg = isCurrentWeek ? 'var(--warn-soft)' : rowIdx === 0 ? 'var(--panel)' : 'var(--panel2)';
      return { style: { background: emptyBg, cursor: 'default' }, icon: null };
    }
    // Target cell and normal scheduled cells: same appearance
    if (baseColor === 'blue')  return { style: { background: 'var(--accent)', cursor: 'pointer', boxShadow: isHighlighted ? 'inset 0 0 0 2px #fff' : undefined }, icon: null };
    if (baseColor === 'green') return { style: { background: 'var(--ok)', cursor: 'pointer', boxShadow: isHighlighted ? 'inset 0 0 0 2px #fff' : undefined }, icon: null };
    return { style: {}, icon: null };
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 relative" style={{ background: 'var(--bg)' }} onClick={() => setPopup(null)}>

      {/* API Error banner */}
      {apiError && (
        <div
          className="px-5 py-2 flex items-center justify-between text-xs"
          style={{ background: 'var(--crit-soft)', borderBottom: '1px solid var(--crit)', color: 'var(--crit)' }}
        >
          <span className="flex items-center gap-1.5">⚠ {apiError}</span>
          <button className="ml-4 underline hover:opacity-80" onClick={() => setApiError(null)}>Fermer</button>
        </div>
      )}

      {/* Loading overlay */}
      {(loadingEvents || loadingEquipements) && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3" style={{ background: 'rgba(7,11,19,0.05)', backdropFilter: 'blur(2px)' }}>
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text3)' }}>Chargement du calendrier…</p>
        </div>
      )}

      {/* HEADER */}
      <div className="px-5 py-3 flex-shrink-0" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-sm font-bold leading-tight" style={{ color: 'var(--text)' }}>{selectedView.title}</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{selectedView.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { label: 'Date',          value: new Date().toLocaleDateString('fr-FR'), color: 'var(--info)' },
              { label: 'Semaine',       value: `KW ${currentWeek}`,                   color: 'var(--warn)' },
              { label: 'Réf.',          value: selectedView.reference,                color: 'var(--text2)' },
              { label: 'Sem. courante', value: `${currentWeekDone}/${currentWeekTasks}`, color: 'var(--ok)' },
              { label: 'Total fait',    value: doneCount,                             color: 'var(--text2)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-[9px] px-2.5 py-1 text-center" style={{ border: '1px solid var(--border)', background: 'var(--panel2)' }}>
                <DataLabel className="!text-[8px] leading-none">{label}</DataLabel>
                <div className="font-bold mt-0.5" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text3)' }} />
            <input type="text" placeholder="Code ou désignation…"
              className="rounded-[8px] pl-7 pr-2 py-1 text-xs w-44 outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--panel2)', color: 'var(--text)' }}
              value={searchCode} onChange={(e) => setSearchCode(e.target.value)} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {CALENDAR_VIEWS.map((view) => (
              <button key={view.id} onClick={() => setViewFilter(view.id)}
                className="px-2.5 py-1 rounded-[8px] text-xs font-semibold transition-colors"
                style={viewFilter === view.id
                  ? { background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', color: '#fff' }
                  : { background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                {view.label}
              </button>
            ))}
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-3 text-xs">
            {[
              { bg: 'var(--accent)', label: 'Mensuel' },
              { bg: 'var(--ok)',     label: 'Semi-annuel' },
              { bg: 'var(--text3)',  label: 'Fait' },
            ].map(({ bg, label }, i) => (
              <span key={`${label}-${i}`} className="flex items-center gap-1.5" style={{ color: 'var(--text3)' }}>
                <span className="w-2.5 h-2.5 rounded flex-shrink-0" style={{ background: bg }} />
                {label}
              </span>
            ))}
            <span className="flex items-center gap-1.5" style={{ color: 'var(--text3)' }}>
              <Settings2 className="w-3 h-3 flex-shrink-0" />
              Clic colonne = planning
            </span>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="border-collapse text-xs" style={{ minWidth: 'max-content' }}>
          <thead>
            <tr>
              <th className="sticky left-0 z-30 text-white text-center font-mono" style={{ width:50, minWidth:50, background:'#0d1828', border:'1px solid rgba(255,255,255,0.08)' }}>KW</th>
              <th className="sticky text-white text-center z-20 font-mono" style={{ left:50, width:38, minWidth:38, background:'#0d1828', border:'1px solid rgba(255,255,255,0.08)' }}>Type</th>
              {filteredEquipements.map((equip) => (
                <th key={equip.code}
                  className="text-white z-10 cursor-pointer select-none transition-colors"
                  title={`${equip.code} — Cliquer pour configurer le planning`}
                  style={{ width:34, minWidth:34, background: highlightedEquip === equip.code ? 'var(--accent2)' : '#0d1828', border:'1px solid rgba(255,255,255,0.08)' }}
                  onClick={(e) => { e.stopPropagation(); setHighlightedEquip(equip.code); setScheduleModal({ equip }); }}>
                  <div style={{ height:130, width:34, display:'flex', alignItems:'flex-end', justifyContent:'center', overflow:'hidden' }}>
                    <div style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', whiteSpace:'nowrap', fontSize:9, lineHeight:1, color: '#cbd5e1' }}>{equip.designation}</div>
                  </div>
                  <div className="font-bold flex items-center justify-center font-mono"
                    style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', height:48, fontSize:8, borderTop:'1px solid rgba(255,255,255,0.1)', color: 'var(--accent3)' }}>{equip.code}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WEEKS.map((week) => {
              const isCurrentWeek = week === currentWeek;
              return activeIntervalTypes.map((intType, rowIdx) => {
                const isFirst = rowIdx === 0;
                return (
                  <tr key={`${week}-${intType}`} style={{ height:18, borderTop: isFirst ? '1px solid var(--border)' : undefined }}>
                    <td className="sticky left-0 z-20 text-center font-bold select-none font-mono"
                      style={{ fontSize:10, width:50, border:'1px solid var(--border2)', background: isCurrentWeek ? 'var(--warn-soft)' : 'var(--panel2)', color: isCurrentWeek ? 'var(--warn)' : 'var(--text2)' }}>
                      {isFirst ? `kw${String(week).padStart(2,'0')}` : ''}
                    </td>
                    <td className="sticky text-center font-semibold select-none font-mono"
                      style={{ left:50, fontSize:9, width:38, zIndex:19, border:'1px solid var(--border2)', background: isCurrentWeek ? 'var(--warn-soft)' : 'var(--panel2)', color: 'var(--text3)' }}>{intType}</td>
                    {filteredEquipements.map((equip) => {
                      const key      = `${equip.code}__${intType}__${week}`;
                      const cellData = allCells[key];
                      const isHighlighted = highlightedEquip === equip.code;
                      if (!cellData) {
                        const emptyBg = isCurrentWeek ? 'var(--warn-soft)' : isFirst ? 'var(--panel)' : 'var(--panel2)';
                        return <td key={equip.code} style={{ width:34, minWidth:34, border:'1px solid var(--border2)', background: isHighlighted ? 'var(--accent-soft)' : emptyBg }} />;
                      }
                      const { style, icon } = getCellAppearance(key, cellData.color, isCurrentWeek, rowIdx, isHighlighted);
                      const state  = cellStates[key];
                      const tipSuffix = state?.status === 'done' ? '  Fait' : '  Cliquer pour modifier';
                      return (
                        <td key={equip.code}
                          className="text-center text-white font-bold select-none transition-colors"
                          style={{ width:34, minWidth:34, height:18, fontSize:9, border:'1px solid var(--border2)', ...style }}
                          title={`${equip.code}  ${equip.designation}  KW${week}  ${intType}${tipSuffix}`}
                          onClick={(e) => handleCellClick(e, key, cellData)}>
                          {icon && <span style={{ fontSize:9 }}>{icon}</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="px-5 py-1.5 text-xs flex flex-wrap justify-between gap-1 flex-shrink-0" style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)', color: 'var(--text3)' }}>
        <span>
          {filteredEquipements.length} équipement(s) · {doneCount} marqué(s) fait(s)
          {savingKeys.size > 0 && <span className="ml-3 animate-pulse font-medium" style={{ color: 'var(--accent)' }}>↻ Sauvegarde…</span>}
        </span>
        <span>Année {currentYear} · KW01 – KW53</span>
      </div>

      {popup && (
        <CellMenu
          popup={popup}
          onDone={handleMarkDone}
          onReschedule={handleOpenReschedule}
          onReset={handleReset}
          onOpenMachineSheet={handleOpenMachineSheet}
          onOpenFerBain={handleOpenFerBain}
          onClose={() => setPopup(null)}
        />
      )}
      <RescheduleModal modal={rescheduleModal} onConfirm={handleRescheduleConfirm} onClose={() => setRescheduleModal(null)} />
      <ScheduleModal
        modal={scheduleModal}
        onSave={handleSaveSchedule}
        onClose={() => { setScheduleModal(null); setHighlightedEquip(null); }}
      />
    </div>
  );
};

export default CalendrierPreventif;
