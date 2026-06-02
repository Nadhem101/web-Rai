import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Pencil, Check, X, Download, Upload,
  ZoomIn, ZoomOut, GitBranch, ChevronLeft, AlertTriangle,
} from 'lucide-react';

// ── Constants ──────────────────────────────────────────────
const STEP_W = 210;
const STEP_H = 84;
const STORAGE_KEY = 'webrai_flowchart';

const SHAPE_CONFIG = {
  'operation':         { label: 'Opération',              color: 'sky',    abbr: 'OP' },
  'operation-control': { label: 'Opération + contrôle',   color: 'indigo', abbr: 'OC' },
  'control':           { label: 'Contrôle',               color: 'amber',  abbr: 'CT' },
  'storage':           { label: 'Stockage',               color: 'slate',  abbr: 'ST' },
};

const COLORS = {
  sky:    { border: 'border-sky-400',    bg: 'bg-sky-50',    badge: 'bg-sky-100 text-sky-700',     ring: 'ring-sky-200'    },
  indigo: { border: 'border-indigo-400', bg: 'bg-indigo-50', badge: 'bg-indigo-100 text-indigo-700',ring: 'ring-indigo-200' },
  amber:  { border: 'border-amber-400',  bg: 'bg-amber-50',  badge: 'bg-amber-100 text-amber-700', ring: 'ring-amber-200'  },
  slate:  { border: 'border-slate-400',  bg: 'bg-slate-100', badge: 'bg-slate-200 text-slate-600', ring: 'ring-slate-200'  },
};

const DEFAULT_STEPS = [
  { id: 's1', number: 1, parentId: null, x: 80,  y: 60,  label: 'Réception matière',    shape: 'operation',         tools: ['Pied à coulisse'], parameters: ['Référence vérifiée', 'Quantité vérifiée', 'Contrôle visuel OK'], photos: [], videos: [] },
  { id: 's2', number: 2, parentId: 's1', x: 80,  y: 200, label: 'Contrôle entrant',     shape: 'control',           tools: ['Pied à coulisse', 'Comparateur'], parameters: ['Contrôle dimensionnel', 'Contrôle surface', 'Étiquette traçabilité'], photos: [], videos: [] },
  { id: 's3', number: 3, parentId: 's2', x: 80,  y: 340, label: 'Stockage',             shape: 'storage',           tools: ['Étiquette rack'], parameters: ['Emplacement défini', 'FIFO respecté', 'Hygrométrie vérifiée'], photos: [], videos: [] },
  { id: 's4', number: 4, parentId: 's3', x: 80,  y: 480, label: 'Coupe fils',           shape: 'operation',         tools: ['ORION MNT635', 'Gabarit coupe'], parameters: ['Longueur coupe', 'Type fil', 'Tolérance'], photos: [], videos: [] },
  { id: 's5', number: 5, parentId: 's4', x: 80,  y: 620, label: 'Dénudage fils',        shape: 'operation-control', tools: ['Komax Alpha 530'], parameters: ['Longueur dénudage', 'Pas de dommage conducteur', 'Isolation retirée proprement'], photos: [], videos: [] },
];

const createId = () => `s-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

// ── Shared styles ──────────────────────────────────────────
const fieldClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors';
const labelClass = 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500';

// ── FlowStepNode ───────────────────────────────────────────
const FlowStepNode = ({ step, selected, onClick, onPointerDown }) => {
  const cfg   = SHAPE_CONFIG[step.shape] || SHAPE_CONFIG.operation;
  const color = COLORS[cfg.color];

  return (
    <button
      type="button"
      onClick={() => onClick(step.id)}
      onPointerDown={(e) => onPointerDown?.(e, step.id)}
      className={`absolute z-10 flex flex-col justify-center rounded-xl border-2 bg-white px-3 py-2 text-left shadow-sm transition-all duration-100 cursor-grab active:cursor-grabbing active:shadow-md
        ${color.border}
        ${selected ? `ring-4 ${color.ring} shadow-md` : 'hover:shadow-md'}
      `}
      style={{ left: step.x, top: step.y, width: STEP_W, height: STEP_H }}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
          {step.number}
        </span>
        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide flex-shrink-0 ${color.badge}`}>
          {cfg.abbr}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">{step.label}</p>
      <p className="mt-0.5 text-[10px] text-slate-500 truncate">{cfg.label}</p>
    </button>
  );
};

// ── Main ───────────────────────────────────────────────────
const FlowChartDetail = () => {
  const navigate    = useNavigate();
  const dragRef     = useRef(null);
  const fileInputRef = useRef(null);

  // Load from localStorage or use defaults
  const [title, setTitle]         = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY))?.title || 'Gamme de fabrication'; } catch { return 'Gamme de fabrication'; }
  });
  const [steps, setSteps]         = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY))?.steps || DEFAULT_STEPS; } catch { return DEFAULT_STEPS; }
  });
  const [selectedId, setSelectedId] = useState(DEFAULT_STEPS[0]?.id || null);
  const [zoom, setZoom]           = useState(1);
  const [editingTitle, setEditingTitle] = useState(false);
  const [pendingTitle, setPendingTitle] = useState('');
  const [panel, setPanel]         = useState('view');   // 'view' | 'edit' | 'add' | 'delete'
  const [draft, setDraft]         = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ── Auto-save ────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, steps }));
  }, [title, steps]);

  // ── Keyboard shortcuts ───────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') &&
          document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA' &&
          selectedId) {
        setConfirmDelete(true);
        setPanel('delete');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedId]);

  // ── Drag ─────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      const ds = dragRef.current;
      if (!ds) return;
      setSteps(prev => prev.map(s => s.id === ds.stepId
        ? { ...s, x: Math.max(0, e.clientX - ds.offsetX), y: Math.max(0, e.clientY - ds.offsetY) }
        : s
      ));
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  }, []);

  const handlePointerDown = useCallback((e, stepId) => {
    if (e.button !== 0) return;
    const s = steps.find(x => x.id === stepId);
    if (!s) return;
    dragRef.current = { stepId, offsetX: e.clientX - s.x, offsetY: e.clientY - s.y };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, [steps]);

  // ── Selected step ─────────────────────────────────────────
  const selectedStep = useMemo(() => steps.find(s => s.id === selectedId) || steps[0], [steps, selectedId]);

  const handleSelect = (id) => {
    setSelectedId(id);
    setPanel('view');
    setConfirmDelete(false);
  };

  // ── Edit ─────────────────────────────────────────────────
  const openEdit = () => {
    if (!selectedStep) return;
    setDraft({
      label:      selectedStep.label,
      shape:      selectedStep.shape,
      tools:      (selectedStep.tools || []).join(', '),
      parameters: (selectedStep.parameters || []).join('\n'),
    });
    setPanel('edit');
  };

  const saveEdit = () => {
    if (!draft || !draft.label.trim()) return;
    setSteps(prev => prev.map(s => s.id === selectedId ? {
      ...s,
      label:      draft.label.trim(),
      shape:      draft.shape,
      tools:      draft.tools.split(',').map(t => t.trim()).filter(Boolean),
      parameters: draft.parameters.split('\n').map(p => p.trim()).filter(Boolean),
    } : s));
    setPanel('view');
  };

  // ── Add ───────────────────────────────────────────────────
  const openAdd = () => {
    setDraft({
      label: '', shape: 'operation',
      parentId: selectedId || (steps[steps.length - 1]?.id ?? ''),
      tools: '', parameters: '',
    });
    setPanel('add');
  };

  const confirmAdd = () => {
    if (!draft?.label.trim()) return;
    const parent = steps.find(s => s.id === draft.parentId) || steps[steps.length - 1];
    const siblings = steps.filter(s => s.parentId === parent?.id).length;
    const xOffsets = [0, 260, -260, 520, -520];
    const newStep = {
      id:         createId(),
      number:     steps.length + 1,
      parentId:   parent?.id || null,
      label:      draft.label.trim(),
      shape:      draft.shape,
      tools:      draft.tools.split(',').map(t => t.trim()).filter(Boolean),
      parameters: draft.parameters.split('\n').map(p => p.trim()).filter(Boolean),
      photos: [], videos: [],
      x:  (parent?.x ?? 80) + (xOffsets[siblings] ?? siblings * 220),
      y:  (parent?.y ?? 60) + 160,
    };
    setSteps(prev => [...prev, newStep]);
    setSelectedId(newStep.id);
    setPanel('view');
  };

  // ── Delete ────────────────────────────────────────────────
  const confirmDeleteStep = () => {
    if (!selectedStep) return;
    const pid = selectedStep.parentId;
    const remaining = steps
      .filter(s => s.id !== selectedStep.id)
      .map(s => s.parentId === selectedStep.id ? { ...s, parentId: pid } : s)
      .map((s, i) => ({ ...s, number: i + 1 }));
    setSteps(remaining);
    const next = remaining.find(s => s.id === pid) || remaining[0];
    setSelectedId(next?.id || null);
    setPanel('view');
    setConfirmDelete(false);
  };

  // ── Export / Import ───────────────────────────────────────
  const handleExport = () => {
    const data = JSON.stringify({ title, steps }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed.steps && Array.isArray(parsed.steps)) {
          setTitle(parsed.title || 'Gamme importée');
          setSteps(parsed.steps);
          setSelectedId(parsed.steps[0]?.id || null);
          setPanel('view');
        }
      } catch { alert('Fichier JSON invalide.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Connectors ────────────────────────────────────────────
  const connectors = steps
    .filter(s => s.parentId)
    .map(s => {
      const p = steps.find(x => x.id === s.parentId);
      if (!p) return null;
      const sx = p.x + STEP_W / 2, sy = p.y + STEP_H;
      const ex = s.x + STEP_W / 2, ey = s.y;
      const my = sy + Math.max(16, (ey - sy) / 2);
      return { id: `${p.id}-${s.id}`, sx, sy, ex, ey, my };
    }).filter(Boolean);

  const stepOptions = useMemo(() => steps.map(s => ({ value: s.id, label: `${s.number}. ${s.label}` })), [steps]);

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden" style={{ background: 'var(--content-bg)' }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-4 px-5 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate('/industrialization')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0">
            <ChevronLeft className="w-3.5 h-3.5" />
            Retour
          </button>
          <div className="w-px h-4 bg-slate-200 flex-shrink-0" />
          <div className="w-5 h-5 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
            <GitBranch className="w-3 h-3 text-white" />
          </div>
          {editingTitle ? (
            <div className="flex items-center gap-2 min-w-0">
              <input
                autoFocus value={pendingTitle}
                onChange={e => setPendingTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { setTitle(pendingTitle); setEditingTitle(false); } if (e.key === 'Escape') setEditingTitle(false); }}
                className="text-sm font-bold text-slate-800 bg-transparent border-b border-sky-400 outline-none min-w-0 w-48"
              />
              <button onClick={() => { setTitle(pendingTitle); setEditingTitle(false); }}
                className="text-emerald-600 hover:text-emerald-700"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditingTitle(false)}
                className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <button onClick={() => { setPendingTitle(title); setEditingTitle(true); }}
              className="flex items-center gap-1.5 group min-w-0">
              <span className="text-sm font-bold text-slate-800 truncate">{title}</span>
              <Pencil className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Zoom */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 py-1">
            <button onClick={() => setZoom(z => Math.max(0.4, +(z - 0.1).toFixed(1)))}
              className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-slate-600 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))}
              className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Import */}
          <button onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <Upload className="w-3.5 h-3.5" /> Importer
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          {/* Export */}
          <button onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <Download className="w-3.5 h-3.5" /> Exporter
          </button>

          {/* Add step */}
          <button onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
            <Plus className="w-3.5 h-3.5" /> Ajouter étape
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Canvas */}
        <div className="flex-1 min-w-0 overflow-auto relative"
          style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', minWidth: 900, minHeight: 1100, position: 'relative' }}>
            <svg className="pointer-events-none absolute inset-0 w-full h-full" aria-hidden>
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0,8 3,0 6" fill="#94a3b8" />
                </marker>
              </defs>
              {connectors.map(c => (
                <g key={c.id}>
                  <path
                    d={`M ${c.sx} ${c.sy} L ${c.sx} ${c.my} L ${c.ex} ${c.my} L ${c.ex} ${c.ey}`}
                    fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)"
                    strokeDasharray={c.sx === c.ex ? 'none' : 'none'}
                  />
                </g>
              ))}
            </svg>
            {steps.map(step => (
              <FlowStepNode key={step.id} step={step} selected={step.id === selectedId}
                onClick={handleSelect} onPointerDown={handlePointerDown} />
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-80 flex-shrink-0 border-l border-slate-200 bg-white overflow-y-auto flex flex-col">

          {/* Panel: VIEW ── */}
          {(panel === 'view' || panel === 'delete') && selectedStep && (
            <div className="flex-1 flex flex-col">
              {/* Step header */}
              <div className="px-4 py-4 border-b border-slate-100"
                style={{ background: '#0f1d35' }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Étape {selectedStep.number}
                    </p>
                    <p className="text-sm font-bold text-white mt-0.5 leading-tight">{selectedStep.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{SHAPE_CONFIG[selectedStep.shape]?.label}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0 mt-0.5">
                    <button onClick={openEdit}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-sky-300 hover:bg-white/10 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { setPanel('delete'); setConfirmDelete(true); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-white/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete confirm */}
              {panel === 'delete' && confirmDelete && (
                <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm font-semibold text-red-700">Supprimer cette étape ?</p>
                  </div>
                  <p className="text-xs text-red-600 mb-3">
                    Les étapes enfants seront rattachées au parent de cette étape.
                  </p>
                  <div className="flex gap-2">
                    <button onClick={confirmDeleteStep}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
                      Supprimer
                    </button>
                    <button onClick={() => { setPanel('view'); setConfirmDelete(false); }}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Step details */}
              <div className="flex-1 p-4 space-y-4">
                {/* Parent */}
                <div>
                  <p className={labelClass}>Vient de</p>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    {selectedStep.parentId
                      ? (() => { const p = steps.find(s => s.id === selectedStep.parentId); return p ? `${p.number}. ${p.label}` : '—'; })()
                      : 'Point de départ'}
                  </div>
                </div>

                {/* Parameters */}
                {selectedStep.parameters?.length > 0 && (
                  <div>
                    <p className={labelClass}>Paramètres</p>
                    <div className="space-y-1.5">
                      {selectedStep.parameters.map((param, i) => (
                        <div key={i} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-1" />
                          {param}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools */}
                {selectedStep.tools?.length > 0 && (
                  <div>
                    <p className={labelClass}>Outils / Matériel</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedStep.tools.map(tool => (
                        <span key={tool} className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photos placeholder */}
                {selectedStep.photos?.length > 0 && (
                  <div>
                    <p className={labelClass}>Photos</p>
                    <div className="space-y-2">
                      {selectedStep.photos.map((photo, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2.5">
                          <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-slate-500">IMG</div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">{photo.title}</p>
                            {photo.description && <p className="text-[11px] text-slate-500 truncate">{photo.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Panel: EDIT ── */}
          {panel === 'edit' && draft && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                <p className="text-sm font-bold text-slate-800">Modifier l'étape</p>
                <button onClick={() => setPanel('view')}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <label className="block">
                  <span className={labelClass}>Libellé <span className="text-red-400">*</span></span>
                  <input type="text" value={draft.label} onChange={e => setDraft(p => ({ ...p, label: e.target.value }))}
                    className={fieldClass} placeholder="Nom de l'étape" />
                </label>
                <label className="block">
                  <span className={labelClass}>Type</span>
                  <select value={draft.shape} onChange={e => setDraft(p => ({ ...p, shape: e.target.value }))} className={fieldClass}>
                    {Object.entries(SHAPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClass}>Outils (séparés par virgule)</span>
                  <input type="text" value={draft.tools} onChange={e => setDraft(p => ({ ...p, tools: e.target.value }))}
                    className={fieldClass} placeholder="Ex: Caliper, Komax" />
                </label>
                <label className="block">
                  <span className={labelClass}>Paramètres (un par ligne)</span>
                  <textarea rows={4} value={draft.parameters} onChange={e => setDraft(p => ({ ...p, parameters: e.target.value }))}
                    className={fieldClass + ' resize-none'} placeholder="Un paramètre par ligne" />
                </label>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-100 flex-shrink-0">
                <button onClick={saveEdit}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
                  <Check className="w-4 h-4 inline mr-1.5" />Enregistrer
                </button>
                <button onClick={() => setPanel('view')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Panel: ADD ── */}
          {panel === 'add' && draft && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                <p className="text-sm font-bold text-slate-800">Nouvelle étape</p>
                <button onClick={() => setPanel('view')}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <label className="block">
                  <span className={labelClass}>Libellé <span className="text-red-400">*</span></span>
                  <input type="text" value={draft.label} onChange={e => setDraft(p => ({ ...p, label: e.target.value }))}
                    className={fieldClass} placeholder="Ex: Sertissage" autoFocus />
                </label>
                <label className="block">
                  <span className={labelClass}>Type</span>
                  <select value={draft.shape} onChange={e => setDraft(p => ({ ...p, shape: e.target.value }))} className={fieldClass}>
                    {Object.entries(SHAPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClass}>Vient de</span>
                  <select value={draft.parentId} onChange={e => setDraft(p => ({ ...p, parentId: e.target.value }))} className={fieldClass}>
                    <option value="">Point de départ</option>
                    {stepOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClass}>Outils (séparés par virgule)</span>
                  <input type="text" value={draft.tools} onChange={e => setDraft(p => ({ ...p, tools: e.target.value }))}
                    className={fieldClass} placeholder="Ex: Caliper, Komax" />
                </label>
                <label className="block">
                  <span className={labelClass}>Paramètres (un par ligne)</span>
                  <textarea rows={4} value={draft.parameters} onChange={e => setDraft(p => ({ ...p, parameters: e.target.value }))}
                    className={fieldClass + ' resize-none'} placeholder="Un paramètre par ligne" />
                </label>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-100 flex-shrink-0">
                <button onClick={confirmAdd} disabled={!draft.label.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-colors"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
                  <Plus className="w-4 h-4 inline mr-1.5" />Ajouter
                </button>
                <button onClick={() => setPanel('view')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="border-t border-slate-100 p-4 flex-shrink-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Légende</p>
            <div className="space-y-1.5">
              {Object.entries(SHAPE_CONFIG).map(([k, v]) => {
                const c = COLORS[v.color];
                return (
                  <div key={k} className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${c.badge}`}>{v.abbr}</span>
                    <span className="text-[11px] text-slate-600">{v.label}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] text-slate-400">
              {steps.length} étape(s) · Auto-sauvegarde active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowChartDetail;
