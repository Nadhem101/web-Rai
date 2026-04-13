import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { maintenanceEventService } from '../../services/api';
import { EQUIPEMENTS, WEEKS, getCurrentWeek, isMaintenance } from '../../utils/maintenanceSchedule';

const DEFAULT_INTERVALS = [{ type: '1M', freq: 4, start: 1, color: 'blue' }];

const CALENDAR_VIEWS = [
  {
    id: 'cablage-electronique',
    label: 'Cablage & Electronique',
    title: 'Calendrier des preventives systematiques de Cablage & Electronique',
    subtitle: '" KW01 ===> KW53 "',
    reference: 'FQ024/00',
    items: [
      { code: 'EQUIP347', designation: 'Machine de coupe', zone: 'Cablage' },
      { code: 'EQUIP210', designation: 'Marquage a chaud', zone: 'Cablage' },
      { code: 'EQUIP395', designation: 'Machine de coupe', zone: 'Cablage' },
      { code: 'EQUIP432', designation: 'Machine de coupe', zone: 'Cablage' },
      { code: 'EQUIP355', designation: 'Machine de coupe', zone: 'Cablage' },
      { code: 'EQUIP349', designation: 'Machine de marquage', zone: 'Cablage' },
      { code: 'EQUIP451', designation: 'Machine de marquage', zone: 'Cablage' },
      { code: 'EQUIP476', designation: 'Machine de degraissage', zone: 'Cablage' },
      { code: 'EQUIP475', designation: 'Machine de coupe', zone: 'Cablage' },
      { code: 'EQUIP353', designation: 'Bottleuse', zone: 'Cablage' },
      { code: 'EQUIP457', designation: 'Bottleuse', zone: 'Cablage' },
      { code: 'EQUIP444', designation: 'Machine de sertissage', zone: 'Cablage' },
      { code: 'EQUIP386', designation: 'Press manuel', zone: 'Cablage' },
      { code: 'EQUIP405', designation: 'Machine de sertissage', zone: 'Cablage' },
      { code: 'EQUIP342', designation: 'Machine de sertissage', zone: 'Cablage' },
      { code: 'EQUIP343', designation: 'Machine de sertissage', zone: 'Cablage' },
      { code: 'EQUIP450', designation: 'Machine de sertissage', zone: 'Cablage' },
      { code: 'EQUIP194', designation: 'Machine de sertissage', zone: 'Cablage' },
      { code: 'EQUIP391', designation: 'Machine coupe gain', zone: 'Cablage' },
      { code: 'EQUIP458', designation: 'Machine de sertissage', zone: 'Cablage' },
      { code: 'EQUIP340', designation: 'Machine de denudage', zone: 'Cablage' },
      { code: 'EQUIP463', designation: 'Machine de denudage', zone: 'Cablage' },
      { code: 'EQUIP459', designation: 'Machine de denudage', zone: 'Cablage' },
      { code: 'EQUIP460', designation: 'Machine de denudage', zone: 'Cablage' },
      { code: 'EQUIP461', designation: 'Machine de denudage', zone: 'Cablage' },
      { code: 'EQUIP462', designation: 'Machine de denudage', zone: 'Cablage' },
      { code: 'EQUIP464', designation: 'Machine de denudage', zone: 'Cablage' },
      { code: 'EQUIP341', designation: 'Machine insertion embout', zone: 'Electronique' },
      { code: 'EQUIP384', designation: 'Machine ULTRASON', zone: 'Electronique' },
      { code: 'EQUIP473', designation: 'Machine ULTRASON', zone: 'Electronique' },
      { code: 'EQUIP346', designation: 'Machine Vague', zone: 'Electronique' },
      { code: 'EQUIP466', designation: 'Machine de lavage', zone: 'Electronique' },
      { code: 'EQUIP495', designation: 'Machine de coupe PCB', zone: 'Electronique' },
      { code: 'EQUIP005', designation: 'Insertion cosse', zone: 'Electronique' },
    ],
  },
  {
    id: 'bobinage-assemblage',
    label: 'Bobinage & Assemblage mecanique',
    title: 'Calendrier des preventives systematiques de Bobinage & Assemblage Mecanique',
    subtitle: '" KW01 ===> KW53 "',
    reference: 'FQ024/00',
    items: [
      { code: 'EQUIP151', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP152', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP154', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP155', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP156', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP157', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP158', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP159', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP161', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP162', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP168', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP230', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP231', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP367', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP308', designation: 'Soudure a ultrasons', zone: 'Bobinage' },
      { code: 'EQUIP148', designation: 'Machine de bobinage', zone: 'Bobinage' },
      { code: 'EQUIP094', designation: 'Soudeuse electrique', zone: 'Assemblage mecanique' },
      { code: 'EQUIP297', designation: 'Poste coupe lame', zone: 'Assemblage mecanique' },
      { code: 'EQUIP147', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP144', designation: 'Poste marquage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP061', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP254', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP039', designation: 'Presse sertissage broche', zone: 'Assemblage mecanique' },
      { code: 'EQUIP046', designation: 'Presse insertion broche CA', zone: 'Assemblage mecanique' },
      { code: 'EQUIP082', designation: 'Presse montage volet CAP', zone: 'Assemblage mecanique' },
      { code: 'EQUIP092', designation: 'Machine soudage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP090', designation: 'Marquage a chaud', zone: 'Assemblage mecanique' },
      { code: 'EQUIP312', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP038', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP057', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP316', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP196', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP197', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP198', designation: 'Presse de sertissage Torniquet', zone: 'Assemblage mecanique' },
      { code: 'EQUIP193', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP189', designation: 'Poste d insertion', zone: 'Assemblage mecanique' },
      { code: 'EQUIP191', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP202', designation: 'Perseuse noyau', zone: 'Assemblage mecanique' },
      { code: 'EQUIP203', designation: 'Poste d insertion noyau', zone: 'Assemblage mecanique' },
      { code: 'EQUIP201', designation: 'Presse de sertissage Torniquet', zone: 'Assemblage mecanique' },
      { code: 'EQUIP199', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP200', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
      { code: 'EQUIP220', designation: 'Presse de sertissage', zone: 'Assemblage mecanique' },
    ],
  },
];

function resolveEquipement(item) {
  const fromSchedule = EQUIPEMENTS.find((eq) => eq.code === item.code);
  if (fromSchedule) {
    return {
      ...fromSchedule,
      designation: item.designation || fromSchedule.designation,
      zone: item.zone || fromSchedule.zone,
    };
  }

  return {
    code: item.code,
    designation: item.designation,
    zone: item.zone,
    intervals: DEFAULT_INTERVALS,
  };
}

function CellMenu({ popup, onDone, onReschedule, onReset, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);
  if (!popup) return null;
  const { x, y, equip, week, intType, currentStatus } = popup;
  return (
    <div ref={ref} className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-56" style={{ top: y, left: x }}>
      <div className="px-3 py-2 border-b border-gray-100 text-xs">
        <div className="font-bold text-gray-800">{equip.code}</div>
        <div className="text-gray-500 truncate">{equip.designation}</div>
        <div className="text-gray-400 mt-0.5">KW{String(week).padStart(2,'0')}  {intType}</div>
      </div>
      <div className="py-1">
        {currentStatus !== 'done' && (
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-green-50 flex items-center gap-2 text-green-700" onClick={onDone}>
            <span></span> Marquer comme fait
          </button>
        )}
        {currentStatus !== 'rescheduled' && (
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 flex items-center gap-2 text-orange-700" onClick={onReschedule}>
            <span></span> Reprogrammer
          </button>
        )}
        {currentStatus && (
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-600" onClick={onReset}>
            <span></span> Reinitialiser
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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-80 p-6">
        <h3 className="text-base font-bold text-gray-800 mb-1">Reprogrammer</h3>
        <p className="text-xs text-gray-500 mb-4">
          <span className="font-medium">{modal.equip.code}</span>  {modal.equip.designation}<br />
          Actuel : KW{String(modal.week).padStart(2,'0')}  {modal.intType}
        </p>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nouvelle semaine (153)</label>
        <div className="flex gap-2 mb-2">
          <input type="number" min={1} max={53}
            className="border rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={newWeek}
            onChange={(e) => { setNewWeek(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            autoFocus />
          <span className="text-sm text-gray-500 self-center">KW</span>
        </div>
        <input type="range" min={1} max={53} value={newWeek || 1}
          className="w-full accent-orange-500 mb-3"
          onChange={(e) => { setNewWeek(e.target.value); setError(''); }} />
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        <div className="flex gap-2 mt-2">
          <button className="flex-1 bg-orange-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-orange-600" onClick={handleConfirm}>Confirmer</button>
          <button className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

const CalendrierPreventif = () => {
  const currentWeek = getCurrentWeek();
  const currentYear = new Date().getFullYear();

  const [viewFilter, setViewFilter]             = useState(CALENDAR_VIEWS[0].id);
  const [searchCode, setSearchCode]             = useState('');
  const [highlightedEquip, setHighlightedEquip] = useState(null);
  const [cellStates, setCellStates]             = useState({});
  const [popup, setPopup]                       = useState(null);
  const [rescheduleModal, setRescheduleModal]   = useState(null);
  const [loadingEvents, setLoadingEvents]       = useState(true);
  const [savingKeys, setSavingKeys]             = useState(new Set());
  const [apiError, setApiError]                 = useState(null);

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
    return selectedView.items.map(resolveEquipement);
  }, [selectedView]);

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
        if (original) cells[newKey] = { ...original, week: state.newWeek, isRescheduledTarget: true, originalKey: key };
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
    setPopup({ key, equip: cellData.equip, week: cellData.week, intType: cellData.intType, currentStatus: cellStates[key]?.status || null, x, y });
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
    <div className="flex flex-col flex-1 bg-gray-50 min-h-0 relative" onClick={() => setPopup(null)}>

      {/* API Error banner */}
      {apiError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between text-xs text-red-700">
          <span>⚠ {apiError}</span>
          <button className="ml-4 underline" onClick={() => setApiError(null)}>Fermer</button>
        </div>
      )}

      {/* Loading overlay */}
      {loadingEvents && (
        <div className="absolute inset-0 bg-white/70 z-40 flex items-center justify-center">
          <div className="text-sm text-gray-500 animate-pulse">Chargement des evenements…</div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white border-b shadow-sm px-4 py-2 flex-shrink-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight sm:text-base">{selectedView.title}</h1>
            <p className="text-xs text-gray-500">{selectedView.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { label: 'Date',          value: new Date().toLocaleDateString('fr-FR'), bg: 'bg-blue-50 border-blue-200 text-blue-800' },
              { label: 'Semaine',       value: `KW ${currentWeek}`,                   bg: 'bg-amber-50 border-amber-200 text-amber-800' },
              { label: 'Ref.',          value: selectedView.reference,                bg: 'bg-gray-50 border-gray-200 text-gray-700' },
              { label: 'Cette semaine', value: `${currentWeekDone}/${currentWeekTasks} faits`, bg: 'bg-green-50 border-green-200 text-green-800' },
              { label: 'Total fait',    value: doneCount,                             bg: 'bg-slate-50 border-slate-200 text-slate-800' },
            ].map(({ label, value, bg }) => (
              <div key={label} className={`border rounded px-2 py-0.5 text-center ${bg}`}>
                <div className="text-gray-500 leading-none" style={{fontSize:9}}>{label}</div>
                <div className="font-bold">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input type="text" placeholder="Rechercher code ou designation..."
            className="border rounded px-2 py-0.5 text-xs w-40 sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchCode} onChange={(e) => setSearchCode(e.target.value)} />
          <div className="flex gap-1 flex-wrap">
            {CALENDAR_VIEWS.map((view) => (
              <button key={view.id} onClick={() => setViewFilter(view.id)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${viewFilter === view.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {view.label}
              </button>
            ))}
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2 text-xs flex-wrap">
            {[
              { bg: 'bg-blue-500',   label: 'Mensuel'  },
              { bg: 'bg-green-500',  label: '6 mois'   },
              { bg: 'bg-slate-400',  label: 'Fait '   },
              { bg: 'bg-orange-400', label: 'Reporte'  },
              { bg: 'bg-amber-300',  label: 'Sem. courante' },
            ].map(({ bg, label }) => (
              <span key={label} className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded ${bg} inline-block`} /> {label}
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
              <th className="sticky left-0 z-30 bg-gray-800 text-white border border-gray-600 text-center" style={{ width:50, minWidth:50 }}>KW</th>
              <th className="sticky bg-gray-800 text-white border border-gray-600 text-center z-20" style={{ left:50, width:38, minWidth:38 }}>Type</th>
              {filteredEquipements.map((equip) => (
                <th key={equip.code}
                  className={`bg-gray-800 border border-gray-600 text-white z-10 cursor-pointer select-none transition-colors ${highlightedEquip === equip.code ? 'bg-blue-800' : 'hover:bg-gray-700'}`}
                  style={{ width:34, minWidth:34 }}
                  onClick={(e) => { e.stopPropagation(); setHighlightedEquip(highlightedEquip === equip.code ? null : equip.code); }}>
                  <div style={{ height:130, width:34, display:'flex', alignItems:'flex-end', justifyContent:'center', overflow:'hidden' }}>
                    <div style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', whiteSpace:'nowrap', fontSize:9, lineHeight:1 }}>{equip.designation}</div>
                  </div>
                  <div className="border-t border-gray-600 text-yellow-300 font-bold flex items-center justify-center"
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
      <div className="bg-white border-t px-4 py-1 text-xs text-gray-400 flex flex-wrap justify-between gap-1 flex-shrink-0">
        <span>
          {filteredEquipements.length} equipement(s) · {doneCount} marque(s) fait(s)
          {savingKeys.size > 0 && <span className="ml-3 text-blue-500 animate-pulse">↻ Sauvegarde…</span>}
        </span>
        <span>Annee {currentYear}  KW01 a KW53</span>
      </div>

      {popup && (
        <CellMenu popup={popup} onDone={handleMarkDone} onReschedule={handleOpenReschedule} onReset={handleReset} onClose={() => setPopup(null)} />
      )}
      <RescheduleModal modal={rescheduleModal} onConfirm={handleRescheduleConfirm} onClose={() => setRescheduleModal(null)} />
    </div>
  );
};

export default CalendrierPreventif;
