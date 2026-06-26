import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipementService, maintenanceEventService } from '../../services/api';
import { EQUIPEMENTS, WEEKS, getCurrentWeek, isMaintenance } from '../../utils/maintenanceSchedule';
import { getMaintenanceMachineTemplate, resolveMaintenanceMachineKeyFromEquipment } from '../../data/maintenanceMachines';

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
  const designation = normalizeText(equipement?.designation);
  const category = normalizeText(equipement?.categorie);
  const zone = normalizeText(equipement?.Zone?.nom_zone || equipement?.zone);

  return (
    category === 'fer-et-bain' ||
    designation.includes('fer a souder') ||
    designation.includes('bain creuset') ||
    zone === 'fer et bain'
  );
};

const CALENDAR_VIEWS = [
  {
    id: 'cablage-electronique',
    label: 'Cablage & Electronique',
    title: 'Calendrier des preventives systematiques de Cablage & Electronique',
    subtitle: '" KW01 ===> KW53 "',
    reference: 'FQ024/00',
    matches: (equipement) => {
      const zone = normalizeText(equipement?.Zone?.nom_zone || equipement?.zone);
      return isStandardCalendarEquipment(equipement) && ['cablage', 'electronique'].includes(zone);
    },
  },
  {
    id: 'bobinage-assemblage',
    label: 'Bobinage & Assemblage mecanique',
    title: 'Calendrier des preventives systematiques de Bobinage & Assemblage Mecanique',
    subtitle: '" KW01 ===> KW53 "',
    reference: 'FQ024/00',
    matches: (equipement) => {
      const zone = normalizeText(equipement?.Zone?.nom_zone || equipement?.zone);
      return isStandardCalendarEquipment(equipement) && ['bobinage', 'assemblage mecanique'].includes(zone);
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

  if (fromSchedule) {
    return {
      ...fromSchedule,
      code,
      code_rai: code,
      designation: item.designation || fromSchedule.designation,
      zone: item.Zone?.nom_zone || item.zone || fromSchedule.zone,
    };
  }

  return {
    code,
    code_rai: code,
    designation: item.designation,
    zone: item.Zone?.nom_zone || item.zone,
    intervals: DEFAULT_INTERVALS,
  };
}

function CellMenu({ popup, onDone, onReschedule, onReset, onOpenMachineSheet, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);
  if (!popup) return null;
  const { x, y, equip, week, intType, currentStatus, machineKey, machineLabel } = popup;
  return (
    <div ref={ref} className="fixed z-50 bg-white border border-slate-200 rounded-xl shadow-2xl py-1 w-60 overflow-hidden" style={{ top: y, left: x }}>
      <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50">
        <div className="font-mono font-bold text-slate-800 text-xs">{equip.code}</div>
        <div className="text-slate-500 text-xs truncate mt-0.5">{equip.designation}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">KW{String(week).padStart(2,'0')}</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">{intType}</span>
        </div>
        {machineKey && (
          <div className="mt-1 text-[11px] text-sky-600 font-medium">{machineLabel || machineKey}</div>
        )}
      </div>
      <div className="py-1">
        {machineKey && (
          <button className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 flex items-center gap-2 text-sky-700 transition-colors" onClick={onOpenMachineSheet}>
            📋 Démarrer la fiche machine
          </button>
        )}
        {currentStatus !== 'done' && (
          <button className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 flex items-center gap-2 text-emerald-700 transition-colors" onClick={onDone}>
            ✓ Marquer comme fait
          </button>
        )}
        {currentStatus !== 'rescheduled' && (
          <button className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 flex items-center gap-2 text-amber-700 transition-colors" onClick={onReschedule}>
            → Reprogrammer
          </button>
        )}
        {currentStatus && (
          <button className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 text-slate-500 transition-colors" onClick={onReset}>
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-80 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#0f1d35' }}>
          <div>
            <p className="text-sm font-bold text-white">Reprogrammer</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className="font-mono text-slate-300">{modal.equip.code}</span> · KW{String(modal.week).padStart(2,'0')} · {modal.intType}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors text-lg">✕</button>
        </div>
        <div className="p-5">
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Nouvelle semaine (1 – 53)</label>
          <div className="flex gap-2 mb-2">
            <input type="number" min={1} max={53} value={newWeek} autoFocus
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              onChange={(e) => { setNewWeek(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()} />
            <span className="text-sm text-slate-500 self-center font-semibold">KW</span>
          </div>
          <input type="range" min={1} max={53} value={newWeek || 1}
            className="w-full accent-sky-500 mb-3"
            onChange={(e) => { setNewWeek(e.target.value); setError(''); }} />
          {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleConfirm}
              className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
              Confirmer
            </button>
            <button onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">
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
    const machineKey = resolveMaintenanceMachineKeyFromEquipment(cellData.equip);
    const machineTemplate = machineKey ? getMaintenanceMachineTemplate(machineKey) : null;

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
    if (!popup?.machineKey) {
      return;
    }

    const targetPath = `/preventif/fiches-maintenance/${popup.machineKey}`;
    setPopup(null);
    navigate(targetPath, {
      state: {
        equipment: popup.equip,
        machineKey: popup.machineKey,
      },
    });
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

  const getCellAppearance = (key, baseColor, isCurrentWeek, rowIdx, isHighlighted) => {
    const state   = cellStates[key];
    const target  = allCells[key]?.isRescheduledTarget;
    const saving  = savingKeys.has(key);
    if (saving)                          return { cls: 'bg-gray-300 cursor-wait animate-pulse', icon: '…' };
    if (state?.status === 'done')        return { cls: 'bg-slate-400 hover:bg-slate-500 cursor-pointer', icon: '✓' };
    if (state?.status === 'rescheduled') return { cls: 'bg-orange-400 hover:bg-orange-500 cursor-pointer', icon: '→' };
    if (target)                          return { cls: 'bg-orange-300 hover:bg-orange-400 cursor-pointer ring-2 ring-orange-500 ring-inset', icon: '!' };
    if (baseColor === 'blue')            return { cls: `bg-blue-500 hover:bg-blue-400 cursor-pointer ${isHighlighted ? 'ring-2 ring-white ring-inset' : ''}`, icon: null };
    if (baseColor === 'green')           return { cls: `bg-green-500 hover:bg-green-400 cursor-pointer ${isHighlighted ? 'ring-2 ring-white ring-inset' : ''}`, icon: null };
    return { cls: '', icon: null };
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 relative" style={{ background: 'var(--content-bg)' }} onClick={() => setPopup(null)}>

      {/* API Error banner */}
      {apiError && (
        <div className="bg-red-50 border-b border-red-200 px-5 py-2 flex items-center justify-between text-xs text-red-700">
          <span className="flex items-center gap-1.5">⚠ {apiError}</span>
          <button className="ml-4 underline text-red-600 hover:text-red-800" onClick={() => setApiError(null)}>Fermer</button>
        </div>
      )}

      {/* Loading overlay */}
      {(loadingEvents || loadingEquipements) && (
        <div className="absolute inset-0 bg-white/80 z-40 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Chargement du calendrier…</p>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">{selectedView.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{selectedView.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { label: 'Date',          value: new Date().toLocaleDateString('fr-FR'), cls: 'bg-sky-50 border-sky-200 text-sky-800' },
              { label: 'Semaine',       value: `KW ${currentWeek}`,                   cls: 'bg-amber-50 border-amber-200 text-amber-800' },
              { label: 'Réf.',          value: selectedView.reference,                cls: 'bg-slate-50 border-slate-200 text-slate-700' },
              { label: 'Sem. courante', value: `${currentWeekDone}/${currentWeekTasks}`, cls: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              { label: 'Total fait',    value: doneCount,                             cls: 'bg-slate-50 border-slate-200 text-slate-700' },
            ].map(({ label, value, cls }) => (
              <div key={label} className={`border rounded-lg px-2.5 py-1 text-center ${cls}`}>
                <div className="text-[9px] font-semibold uppercase tracking-wide opacity-70 leading-none">{label}</div>
                <div className="font-bold mt-0.5">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input type="text" placeholder="Code ou désignation…"
              className="border border-slate-200 rounded-lg pl-6 pr-2 py-1 text-xs w-44 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100 bg-white"
              value={searchCode} onChange={(e) => setSearchCode(e.target.value)} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {CALENDAR_VIEWS.map((view) => (
              <button key={view.id} onClick={() => setViewFilter(view.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewFilter === view.id
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                {view.label}
              </button>
            ))}
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-3 text-xs">
            {[
              { bg: 'bg-blue-500',    label: 'Mensuel' },
              { bg: 'bg-green-500',   label: '6 mois' },
              { bg: 'bg-slate-400',   label: 'Fait' },
              { bg: 'bg-orange-400',  label: 'Reporté' },
              { bg: 'bg-amber-300',   label: 'Sem. en cours' },
            ].map(({ bg, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-slate-500">
                <span className={`w-2.5 h-2.5 rounded ${bg} flex-shrink-0`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="border-collapse text-xs" style={{ minWidth: 'max-content' }}>
          <thead>
            <tr>
              <th className="sticky left-0 z-30 bg-[#0f1d35] text-white border border-white/10 text-center" style={{ width:50, minWidth:50 }}>KW</th>
              <th className="sticky bg-[#0f1d35] text-white border border-white/10 text-center z-20" style={{ left:50, width:38, minWidth:38 }}>Type</th>
              {filteredEquipements.map((equip) => (
                <th key={equip.code}
                  className={`bg-[#0f1d35] border border-white/10 text-white z-10 cursor-pointer select-none transition-colors ${highlightedEquip === equip.code ? 'bg-blue-800' : 'hover:bg-gray-700'}`}
                  style={{ width:34, minWidth:34 }}
                  onClick={(e) => { e.stopPropagation(); setHighlightedEquip(highlightedEquip === equip.code ? null : equip.code); }}>
                  <div style={{ height:130, width:34, display:'flex', alignItems:'flex-end', justifyContent:'center', overflow:'hidden' }}>
                    <div style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', whiteSpace:'nowrap', fontSize:9, lineHeight:1 }}>{equip.designation}</div>
                  </div>
                  <div className="border-t border-white/10 text-yellow-300 font-bold flex items-center justify-center"
                    style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', height:48, fontSize:8 }}>{equip.code}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WEEKS.map((week) => {
              const isCurrentWeek = week === currentWeek;
              return ['1M','6M'].map((intType, rowIdx) => {
                const isFirst = rowIdx === 0;
                return (
                  <tr key={`${week}-${intType}`} className={isFirst ? 'border-t border-gray-300' : ''} style={{ height:18 }}>
                    <td className={`sticky left-0 z-20 border border-gray-300 text-center font-bold select-none ${isCurrentWeek ? 'bg-amber-300 text-amber-900' : 'bg-gray-100 text-gray-700'}`}
                      style={{ fontSize:10, width:50 }}>
                      {isFirst ? `kw${String(week).padStart(2,'0')}` : ''}
                    </td>
                    <td className={`sticky border border-gray-300 text-center font-semibold text-gray-500 select-none ${isCurrentWeek ? 'bg-amber-100' : 'bg-gray-50'}`}
                      style={{ left:50, fontSize:9, width:38, zIndex:19 }}>{intType}</td>
                    {filteredEquipements.map((equip) => {
                      const key      = `${equip.code}__${intType}__${week}`;
                      const cellData = allCells[key];
                      const isHighlighted = highlightedEquip === equip.code;
                      if (!cellData) {
                        const emptyBg = isCurrentWeek ? 'bg-amber-50' : isFirst ? 'bg-white' : 'bg-gray-50';
                        return <td key={equip.code} className={`border border-gray-100 ${emptyBg} ${isHighlighted ? 'bg-blue-50' : ''}`} style={{ width:34, minWidth:34 }} />;
                      }
                      const { cls, icon } = getCellAppearance(key, cellData.color, isCurrentWeek, rowIdx, isHighlighted);
                      const state  = cellStates[key];
                      const tipSuffix = state?.status === 'done' ? '  Fait' : state?.status === 'rescheduled' ? `  Reporte KW${state.newWeek}` : '  Cliquer pour modifier';
                      return (
                        <td key={equip.code}
                          className={`border border-gray-200 text-center text-white font-bold select-none transition-colors ${cls}`}
                          style={{ width:34, minWidth:34, height:18, fontSize:9 }}
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
      <div className="bg-white border-t border-slate-200 px-5 py-1.5 text-xs text-slate-400 flex flex-wrap justify-between gap-1 flex-shrink-0">
        <span>
          {filteredEquipements.length} équipement(s) · {doneCount} marqué(s) fait(s)
          {savingKeys.size > 0 && <span className="ml-3 text-sky-500 animate-pulse font-medium">↻ Sauvegarde…</span>}
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
          onClose={() => setPopup(null)}
        />
      )}
      <RescheduleModal modal={rescheduleModal} onConfirm={handleRescheduleConfirm} onClose={() => setRescheduleModal(null)} />
    </div>
  );
};

export default CalendrierPreventif;
