import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { flowchartService, procedureService } from '../../services/api';
import {
  Plus, Trash2, Pencil, Check, X, Download, Upload,
  ZoomIn, ZoomOut, GitBranch, ChevronLeft, AlertTriangle,
  Save, Image, Video, BookOpen, Search, ExternalLink,
} from 'lucide-react';

// ── Constants ──────────────────────────────────────────────
const STEP_W = 210;
const STEP_H = 84;

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

const createId = () => `s-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

// ── Shared styles ──────────────────────────────────────────
const fieldCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors';
const labelCls = 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500';

// ── Step node ──────────────────────────────────────────────
const StepNode = ({ step, selected, onClick, onPointerDown }) => {
  const cfg   = SHAPE_CONFIG[step.shape] || SHAPE_CONFIG.operation;
  const color = COLORS[cfg.color];
  const hasMedia = (step.media || []).length > 0;
  return (
    <button type="button"
      onClick={() => onClick(step.id)}
      onPointerDown={e => onPointerDown?.(e, step.id)}
      className={`absolute z-10 flex flex-col justify-center rounded-xl border-2 bg-white px-3 py-2 text-left shadow-sm transition-all duration-100 cursor-grab active:cursor-grabbing
        ${color.border} ${selected ? `ring-4 ${color.ring} shadow-md` : 'hover:shadow-md'}`}
      style={{ left: step.x, top: step.y, width: STEP_W, height: STEP_H }}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
          {step.number}
        </span>
        <div className="flex items-center gap-1">
          {hasMedia && <Image className="w-3 h-3 text-slate-400" />}
          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${color.badge}`}>
            {cfg.abbr}
          </span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">{step.label}</p>
      <p className="mt-0.5 text-[10px] text-slate-500 truncate">{cfg.label}</p>
    </button>
  );
};

// ── Procedure search dropdown ──────────────────────────────
const ProcedureSearch = ({ value, onChange, onSelect }) => {
  const [results,    setResults]    = useState([]);
  const [searching,  setSearching]  = useState(false);
  const [showDrop,   setShowDrop]   = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!value.trim()) { setResults([]); setShowDrop(false); return; }
    timerRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await procedureService.getAll({ q: value });
        setResults(Array.isArray(data) ? data.slice(0, 8) : []);
        setShowDrop(true);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => value.trim() && setShowDrop(true)}
          onBlur={() => setTimeout(() => setShowDrop(false), 200)}
          className={fieldCls + ' pl-8'} placeholder="Nom de la procédure…" autoFocus />
      </div>
      {showDrop && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" /> Procédures existantes
            </p>
          </div>
          {results.map(p => {
            const c = COLORS[SHAPE_CONFIG[p.shape]?.color || 'sky'];
            return (
              <button key={p.id} type="button"
                onMouseDown={e => { e.preventDefault(); onSelect(p); setShowDrop(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-sky-50 transition-colors border-b border-slate-50 last:border-0">
                <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${c.badge} flex-shrink-0`}>
                  {SHAPE_CONFIG[p.shape]?.abbr || 'OP'}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{p.label}</p>
                  {p.description && <p className="text-[10px] text-slate-400 truncate">{p.description}</p>}
                  {(p.parameters || []).length > 0 && (
                    <p className="text-[10px] text-slate-400">{p.parameters.length} paramètre(s)</p>
                  )}
                </div>
                <span className="text-[10px] text-sky-500 font-semibold flex-shrink-0 ml-auto">Utiliser →</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Media item ─────────────────────────────────────────────
const MediaItem = ({ item, onRemove, readOnly }) => (
  <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === 'video' ? 'bg-red-50' : 'bg-blue-50'}`}>
      {item.type === 'video'
        ? <Video className="w-4 h-4 text-red-500" />
        : <Image className="w-4 h-4 text-blue-500" />}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold text-slate-700 truncate">{item.title || 'Sans titre'}</p>
      {item.duration && <p className="text-[10px] text-slate-400">Durée : {item.duration}</p>}
    </div>
    <div className="flex items-center gap-1 flex-shrink-0">
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-sky-600 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
      {!readOnly && (
        <button type="button" onClick={onRemove}
          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

// ── Main editor ────────────────────────────────────────────
const FlowChartEditor = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const dragRef   = useRef(null);
  const fileRef   = useRef(null);

  const [title,        setTitle]        = useState('');
  const [description,  setDescription]  = useState('');
  const [status,       setStatus]       = useState('draft');
  const [steps,        setSteps]        = useState([]);
  const [selectedId,   setSelectedId]   = useState(null);
  const [zoom,         setZoom]         = useState(1);
  const [panel,        setPanel]        = useState('view');
  const [draft,        setDraft]        = useState(null);
  const [confirmDel,   setConfirmDel]   = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [loading,      setLoading]      = useState(Boolean(id));
  const [editTitle,    setEditTitle]    = useState(false);
  const [pendingTitle, setPendingTitle] = useState('');
  // For new media row in edit/add panel
  const [newMedia,     setNewMedia]     = useState({ type: 'image', title: '', url: '', duration: '' });

  // ── Load from DB ─────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const fc = await flowchartService.getById(id);
        setTitle(fc.title || '');
        setDescription(fc.description || '');
        setStatus(fc.status || 'draft');
        const loadedSteps = Array.isArray(fc.steps) ? fc.steps : [];
        setSteps(loadedSteps);
        setSelectedId(loadedSteps[0]?.id || null);
      } catch (err) {
        console.error('Erreur chargement flowchart:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Save to DB ───────────────────────────────────────────
  const save = useCallback(async (nextSteps = steps, nextTitle = title, nextStatus = status) => {
    setSaving(true);
    try {
      if (id) {
        await flowchartService.update(id, { title: nextTitle, description, steps: nextSteps, status: nextStatus });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
    } finally {
      setSaving(false);
    }
  }, [id, title, description, steps, status]);

  // ── Keyboard shortcuts ───────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') &&
          !['INPUT','TEXTAREA'].includes(document.activeElement.tagName) && selectedId) {
        setConfirmDel(true); setPanel('delete');
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [selectedId]);

  // ── Drag ─────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      const ds = dragRef.current; if (!ds) return;
      setSteps(prev => prev.map(s => s.id === ds.id
        ? { ...s, x: Math.max(0, e.clientX - ds.ox), y: Math.max(0, e.clientY - ds.oy) }
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
    dragRef.current = { id: stepId, ox: e.clientX - s.x, oy: e.clientY - s.y };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, [steps]);

  // ── Derived ───────────────────────────────────────────────
  const selectedStep = useMemo(() => steps.find(s => s.id === selectedId), [steps, selectedId]);
  const stepOptions  = useMemo(() => steps.map(s => ({ value: s.id, label: `${s.number}. ${s.label}` })), [steps]);

  // ── Select ────────────────────────────────────────────────
  const handleSelect = (id) => {
    setSelectedId(id); setPanel('view'); setConfirmDel(false);
  };

  // ── Edit step ─────────────────────────────────────────────
  const openEdit = () => {
    if (!selectedStep) return;
    setDraft({
      label:       selectedStep.label,
      shape:       selectedStep.shape,
      description: selectedStep.description || '',
      tools:       (selectedStep.tools || []).join(', '),
      parameters:  (selectedStep.parameters || []).join('\n'),
      media:       [...(selectedStep.media || [])],
      saveToLib:   false,
    });
    setNewMedia({ type: 'image', title: '', url: '', duration: '' });
    setPanel('edit');
  };

  const saveEdit = async () => {
    if (!draft?.label.trim()) return;
    const tools      = draft.tools.split(',').map(t => t.trim()).filter(Boolean);
    const parameters = draft.parameters.split('\n').map(p => p.trim()).filter(Boolean);
    const updated    = {
      ...selectedStep,
      label: draft.label.trim(), shape: draft.shape,
      description: draft.description,
      tools, parameters, media: draft.media,
    };
    const nextSteps = steps.map(s => s.id === selectedId ? updated : s);
    setSteps(nextSteps);
    // Optionally save procedure to library
    if (draft.saveToLib) {
      try {
        await procedureService.create({
          label: draft.label.trim(), shape: draft.shape,
          description: draft.description,
          tools, parameters, media: draft.media,
        });
      } catch (err) { console.error('Erreur sauvegarde bibliothèque:', err); }
    }
    await save(nextSteps);
    setPanel('view');
  };

  // ── Add step ──────────────────────────────────────────────
  const openAdd = () => {
    setDraft({
      label: '', shape: 'operation', description: '',
      parentId: selectedId || steps[steps.length - 1]?.id || '',
      tools: '', parameters: '', media: [], saveToLib: false,
    });
    setNewMedia({ type: 'image', title: '', url: '', duration: '' });
    setPanel('add');
  };

  const handleSelectProcedure = (proc) => {
    setDraft(d => ({
      ...d,
      label:       proc.label,
      shape:       proc.shape,
      description: proc.description || '',
      tools:       (proc.tools || []).join(', '),
      parameters:  (proc.parameters || []).join('\n'),
      media:       [...(proc.media || [])],
      procedure_id: proc.id,
    }));
  };

  const confirmAdd = async () => {
    if (!draft?.label.trim()) return;
    const parent   = steps.find(s => s.id === draft.parentId) || steps[steps.length - 1];
    const siblings = steps.filter(s => s.parentId === parent?.id).length;
    const xOff     = [0, 260, -260, 520, -520];
    const tools      = draft.tools.split(',').map(t => t.trim()).filter(Boolean);
    const parameters = draft.parameters.split('\n').map(p => p.trim()).filter(Boolean);
    const newStep = {
      id: createId(), number: steps.length + 1,
      parentId: parent?.id || null,
      label: draft.label.trim(), shape: draft.shape,
      description: draft.description,
      tools, parameters, media: draft.media,
      procedure_id: draft.procedure_id || null,
      x: (parent?.x ?? 80) + (xOff[siblings] ?? siblings * 220),
      y: (parent?.y ?? 60) + 160,
    };
    const nextSteps = [...steps, newStep];
    setSteps(nextSteps);
    setSelectedId(newStep.id);
    if (draft.saveToLib && !draft.procedure_id) {
      try {
        await procedureService.create({ label: newStep.label, shape: newStep.shape, description: newStep.description, tools, parameters, media: newStep.media });
      } catch (err) { console.error(err); }
    }
    await save(nextSteps);
    setPanel('view');
  };

  // ── Delete step ───────────────────────────────────────────
  const confirmDeleteStep = async () => {
    if (!selectedStep) return;
    const pid = selectedStep.parentId;
    const nextSteps = steps
      .filter(s => s.id !== selectedStep.id)
      .map(s => s.parentId === selectedStep.id ? { ...s, parentId: pid } : s)
      .map((s, i) => ({ ...s, number: i + 1 }));
    setSteps(nextSteps);
    const next = nextSteps.find(s => s.id === pid) || nextSteps[0];
    setSelectedId(next?.id || null);
    setPanel('view'); setConfirmDel(false);
    await save(nextSteps);
  };

  // ── Media helpers ─────────────────────────────────────────
  const addMedia = () => {
    if (!newMedia.url.trim()) return;
    setDraft(d => ({ ...d, media: [...(d.media || []), { ...newMedia }] }));
    setNewMedia({ type: 'image', title: '', url: '', duration: '' });
  };
  const removeMedia = (i) => setDraft(d => ({ ...d, media: d.media.filter((_, idx) => idx !== i) }));

  // ── Export / Import ───────────────────────────────────────
  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ title, description, steps }, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${title.replace(/\s+/g,'_')}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const handleImport = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const p = JSON.parse(ev.target.result);
        if (p.steps && Array.isArray(p.steps)) {
          setTitle(p.title || title);
          setSteps(p.steps);
          setSelectedId(p.steps[0]?.id || null);
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
      const p = steps.find(x => x.id === s.parentId); if (!p) return null;
      const sx = p.x + STEP_W/2, sy = p.y + STEP_H;
      const ex = s.x + STEP_W/2, ey = s.y;
      const my = sy + Math.max(16, (ey - sy) / 2);
      return { id: `${p.id}-${s.id}`, sx, sy, ex, ey, my };
    }).filter(Boolean);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400">Chargement de la gamme…</p>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden" style={{ background: 'var(--content-bg)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-5 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate('/industrialization/flow-chart')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0">
            <ChevronLeft className="w-3.5 h-3.5" /> Flow Charts
          </button>
          <div className="w-px h-4 bg-slate-200 flex-shrink-0" />
          {editTitle ? (
            <div className="flex items-center gap-2 min-w-0">
              <input autoFocus value={pendingTitle} onChange={e => setPendingTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { setTitle(pendingTitle); setEditTitle(false); } if (e.key === 'Escape') setEditTitle(false); }}
                className="text-sm font-bold text-slate-800 bg-transparent border-b border-sky-400 outline-none w-48" />
              <button onClick={() => { setTitle(pendingTitle); setEditTitle(false); }} className="text-emerald-600"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditTitle(false)} className="text-slate-400"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <button onClick={() => { setPendingTitle(title); setEditTitle(true); }}
              className="flex items-center gap-1.5 group min-w-0">
              <GitBranch className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-sm font-bold text-slate-800 truncate">{title || 'Sans titre'}</span>
              <Pencil className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          )}
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="text-[11px] font-semibold rounded-full px-2.5 py-1 border focus:outline-none focus:ring-1 focus:ring-sky-200 cursor-pointer
            ${status === 'published' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Zoom */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 py-1">
            <button onClick={() => setZoom(z => Math.max(0.4, +(z-0.1).toFixed(1)))}
              className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-slate-600 w-10 text-center">{Math.round(zoom*100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, +(z+0.1).toFixed(1)))}
              className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50">
            <Upload className="w-3.5 h-3.5" /> Importer
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50">
            <Download className="w-3.5 h-3.5" /> Exporter
          </button>
          {/* Save */}
          <button onClick={() => save()}  disabled={saving}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              saved ? 'bg-emerald-500 text-white' : 'text-white'}`}
            style={saved ? {} : { background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Sauvegardé</> : saving ? 'Sauvegarde…' : <><Save className="w-3.5 h-3.5" /> Sauvegarder</>}
          </button>
          <button onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50">
            <Plus className="w-3.5 h-3.5" /> Étape
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Canvas */}
        <div className="flex-1 min-w-0 overflow-auto relative"
          style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', minWidth: 900, minHeight: 1100, position: 'relative' }}>
            <svg className="pointer-events-none absolute inset-0 w-full h-full" aria-hidden>
              <defs>
                <marker id="arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0,8 3,0 6" fill="#94a3b8" />
                </marker>
              </defs>
              {connectors.map(c => (
                <path key={c.id}
                  d={`M ${c.sx} ${c.sy} L ${c.sx} ${c.my} L ${c.ex} ${c.my} L ${c.ex} ${c.ey}`}
                  fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arr)" />
              ))}
            </svg>
            {steps.map(s => (
              <StepNode key={s.id} step={s} selected={s.id === selectedId}
                onClick={handleSelect} onPointerDown={handlePointerDown} />
            ))}
            {steps.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
                <GitBranch className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">Cliquez sur «&nbsp;Étape&nbsp;» pour commencer</p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-80 flex-shrink-0 border-l border-slate-200 bg-white overflow-y-auto flex flex-col">

          {/* VIEW */}
          {(panel === 'view' || panel === 'delete') && (
            <div className="flex-1 flex flex-col">
              {selectedStep ? (
                <>
                  <div className="px-4 py-4 border-b border-slate-100 flex-shrink-0"
                    style={{ background: '#0f1d35' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Étape {selectedStep.number}</p>
                        <p className="text-sm font-bold text-white mt-0.5 leading-tight">{selectedStep.label}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{SHAPE_CONFIG[selectedStep.shape]?.label}</p>
                        {selectedStep.description && <p className="text-[11px] text-slate-400 mt-1 italic">{selectedStep.description}</p>}
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0 mt-0.5">
                        <button onClick={openEdit}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-sky-300 hover:bg-white/10 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setPanel('delete'); setConfirmDel(true); }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-white/10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {panel === 'delete' && confirmDel && (
                    <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <p className="text-sm font-semibold text-red-700">Supprimer cette étape ?</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={confirmDeleteStep}
                          className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700">Supprimer</button>
                        <button onClick={() => { setPanel('view'); setConfirmDel(false); }}
                          className="flex-1 py-2 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50">Annuler</button>
                      </div>
                    </div>
                  )}

                  <div className="flex-1 p-4 space-y-4">
                    {/* Parameters */}
                    {(selectedStep.parameters || []).length > 0 && (
                      <div>
                        <p className={labelCls}>Paramètres</p>
                        <div className="space-y-1.5">
                          {selectedStep.parameters.map((p, i) => (
                            <div key={i} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-1" />
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tools */}
                    {(selectedStep.tools || []).length > 0 && (
                      <div>
                        <p className={labelCls}>Outils / Matériel</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedStep.tools.map(t => (
                            <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Media */}
                    {(selectedStep.media || []).length > 0 && (
                      <div>
                        <p className={labelCls}>Photos / Vidéos</p>
                        <div className="space-y-2">
                          {selectedStep.media.map((m, i) => (
                            <MediaItem key={i} item={m} readOnly />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Parent */}
                    <div>
                      <p className={labelCls}>Vient de</p>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                        {selectedStep.parentId
                          ? (() => { const p = steps.find(s => s.id === selectedStep.parentId); return p ? `${p.number}. ${p.label}` : '—'; })()
                          : 'Point de départ'}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400">
                  <GitBranch className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs text-center">Sélectionnez ou ajoutez une étape</p>
                </div>
              )}
            </div>
          )}

          {/* EDIT */}
          {panel === 'edit' && draft && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                <p className="text-sm font-bold text-slate-800">Modifier l'étape</p>
                <button onClick={() => setPanel('view')} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <label className="block">
                  <span className={labelCls}>Libellé *</span>
                  <input type="text" value={draft.label} onChange={e => setDraft(d => ({ ...d, label: e.target.value }))} className={fieldCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>Type</span>
                  <select value={draft.shape} onChange={e => setDraft(d => ({ ...d, shape: e.target.value }))} className={fieldCls}>
                    {Object.entries(SHAPE_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className={labelCls}>Description</span>
                  <textarea rows={2} value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} className={fieldCls + ' resize-none'} placeholder="Description courte…" />
                </label>
                <label className="block">
                  <span className={labelCls}>Outils (séparés par virgule)</span>
                  <input type="text" value={draft.tools} onChange={e => setDraft(d => ({ ...d, tools: e.target.value }))} className={fieldCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>Paramètres (un par ligne)</span>
                  <textarea rows={4} value={draft.parameters} onChange={e => setDraft(d => ({ ...d, parameters: e.target.value }))} className={fieldCls + ' resize-none'} />
                </label>

                {/* Media */}
                <div>
                  <p className={labelCls}>Photos / Vidéos</p>
                  <div className="space-y-2 mb-2">
                    {(draft.media || []).map((m, i) => <MediaItem key={i} item={m} onRemove={() => removeMedia(i)} />)}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Ajouter un média</p>
                    <div className="flex gap-2">
                      <select value={newMedia.type} onChange={e => setNewMedia(m => ({ ...m, type: e.target.value }))}
                        className="flex-shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none">
                        <option value="image">Image</option>
                        <option value="video">Vidéo</option>
                      </select>
                      <input type="text" value={newMedia.title} onChange={e => setNewMedia(m => ({ ...m, title: e.target.value }))}
                        placeholder="Titre" className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:border-sky-400" />
                    </div>
                    <input type="url" value={newMedia.url} onChange={e => setNewMedia(m => ({ ...m, url: e.target.value }))}
                      placeholder="URL (image ou lien YouTube…)" className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:border-sky-400" />
                    {newMedia.type === 'video' && (
                      <input type="text" value={newMedia.duration} onChange={e => setNewMedia(m => ({ ...m, duration: e.target.value }))}
                        placeholder="Durée (ex : 02:30)" className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:border-sky-400" />
                    )}
                    <button type="button" onClick={addMedia} disabled={!newMedia.url.trim()}
                      className="w-full py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-40 transition-colors">
                      + Ajouter
                    </button>
                  </div>
                </div>

                {/* Save to library */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={draft.saveToLib || false} onChange={e => setDraft(d => ({ ...d, saveToLib: e.target.checked }))}
                    className="rounded border-slate-300 text-sky-500" />
                  <span className="text-xs text-slate-600">Sauvegarder dans la bibliothèque de procédures</span>
                </label>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-100 flex-shrink-0">
                <button onClick={saveEdit}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
                  <Check className="w-4 h-4 inline mr-1.5" />Enregistrer
                </button>
                <button onClick={() => setPanel('view')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Annuler</button>
              </div>
            </div>
          )}

          {/* ADD */}
          {panel === 'add' && draft && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                <p className="text-sm font-bold text-slate-800">Nouvelle étape</p>
                <button onClick={() => setPanel('view')} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <div>
                  <span className={labelCls}>Libellé * <span className="normal-case font-normal text-slate-400">(recherche dans la bibliothèque)</span></span>
                  <ProcedureSearch
                    value={draft.label}
                    onChange={v => setDraft(d => ({ ...d, label: v, procedure_id: null }))}
                    onSelect={handleSelectProcedure}
                  />
                </div>
                <label className="block">
                  <span className={labelCls}>Type</span>
                  <select value={draft.shape} onChange={e => setDraft(d => ({ ...d, shape: e.target.value }))} className={fieldCls}>
                    {Object.entries(SHAPE_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className={labelCls}>Vient de</span>
                  <select value={draft.parentId} onChange={e => setDraft(d => ({ ...d, parentId: e.target.value }))} className={fieldCls}>
                    <option value="">Point de départ</option>
                    {stepOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className={labelCls}>Description</span>
                  <textarea rows={2} value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} className={fieldCls + ' resize-none'} placeholder="Description courte…" />
                </label>
                <label className="block">
                  <span className={labelCls}>Outils (séparés par virgule)</span>
                  <input type="text" value={draft.tools} onChange={e => setDraft(d => ({ ...d, tools: e.target.value }))} className={fieldCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>Paramètres (un par ligne)</span>
                  <textarea rows={3} value={draft.parameters} onChange={e => setDraft(d => ({ ...d, parameters: e.target.value }))} className={fieldCls + ' resize-none'} />
                </label>

                {/* Media */}
                <div>
                  <p className={labelCls}>Photos / Vidéos</p>
                  <div className="space-y-2 mb-2">
                    {(draft.media || []).map((m, i) => <MediaItem key={i} item={m} onRemove={() => removeMedia(i)} />)}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Ajouter un média</p>
                    <div className="flex gap-2">
                      <select value={newMedia.type} onChange={e => setNewMedia(m => ({ ...m, type: e.target.value }))}
                        className="flex-shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none">
                        <option value="image">Image</option>
                        <option value="video">Vidéo</option>
                      </select>
                      <input type="text" value={newMedia.title} onChange={e => setNewMedia(m => ({ ...m, title: e.target.value }))}
                        placeholder="Titre" className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:border-sky-400" />
                    </div>
                    <input type="url" value={newMedia.url} onChange={e => setNewMedia(m => ({ ...m, url: e.target.value }))}
                      placeholder="URL (image ou lien YouTube…)" className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:border-sky-400" />
                    {newMedia.type === 'video' && (
                      <input type="text" value={newMedia.duration} onChange={e => setNewMedia(m => ({ ...m, duration: e.target.value }))}
                        placeholder="Durée (ex : 02:30)" className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:border-sky-400" />
                    )}
                    <button type="button" onClick={addMedia} disabled={!newMedia.url.trim()}
                      className="w-full py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-40 transition-colors">
                      + Ajouter
                    </button>
                  </div>
                </div>

                {/* Save to library — only if not reusing existing */}
                {!draft.procedure_id && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={draft.saveToLib || false} onChange={e => setDraft(d => ({ ...d, saveToLib: e.target.checked }))}
                      className="rounded border-slate-300 text-sky-500" />
                    <span className="text-xs text-slate-600">Sauvegarder dans la bibliothèque de procédures</span>
                  </label>
                )}
                {draft.procedure_id && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-emerald-700">Procédure de la bibliothèque</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-100 flex-shrink-0">
                <button onClick={confirmAdd} disabled={!draft.label.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
                  <Plus className="w-4 h-4 inline mr-1.5" />Ajouter
                </button>
                <button onClick={() => setPanel('view')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Annuler</button>
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
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${c.badge}`}>{v.abbr}</span>
                    <span className="text-[11px] text-slate-600">{v.label}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] text-slate-400">{steps.length} étape(s)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowChartEditor;
