import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { flowchartService, procedureService } from '../../services/api';
import {
  Plus, Trash2, Pencil, Check, X, Download, Upload,
  ZoomIn, ZoomOut, GitBranch, ChevronLeft, AlertTriangle,
  Save, Image, Video, BookOpen, Search, ExternalLink, Printer,
  FileText,
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

// Migrate legacy single parentId to parentIds array
const migrateStep = (s) => ({
  ...s,
  parentIds: s.parentIds ?? (s.parentId ? [s.parentId] : []),
});

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
          {(step.parentIds || []).length > 1 && (
            <span className="text-[9px] font-bold text-slate-400">↙{(step.parentIds||[]).length}</span>
          )}
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
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
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
const MediaItem = ({ item, index, onRemove, onTitleChange, readOnly }) => (
  <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
    <div className="flex items-center gap-2.5 p-2.5">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        item.type === 'video' ? 'bg-red-50' : item.type === 'document' ? 'bg-orange-50' : 'bg-blue-50'}`}>
        {item.type === 'video'    ? <Video  className="w-4 h-4 text-red-500" />
        : item.type === 'document'? <span className="text-[9px] font-bold text-orange-600">DOC</span>
        :                           <Image  className="w-4 h-4 text-blue-500" />}
      </div>
      <div className="min-w-0 flex-1">
        {readOnly ? (
          <p className="text-xs font-semibold text-slate-700 truncate">{item.title || 'Sans titre'}</p>
        ) : (
          <input
            type="text"
            value={item.title || ''}
            onChange={e => onTitleChange?.(index, e.target.value)}
            placeholder="Titre de la photo / vidéo…"
            className="w-full text-xs font-semibold text-slate-700 bg-transparent border-b border-slate-200 focus:border-sky-400 outline-none pb-0.5 placeholder-slate-300"
          />
        )}
        {item.duration && <p className="text-[10px] text-slate-400 mt-0.5">Durée : {item.duration}</p>}
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
    {/* Image preview (read-only) */}
    {readOnly && item.type === 'image' && item.url && (
      <img src={item.url} alt={item.title || ''} className="w-full max-h-48 object-contain border-t border-slate-100" />
    )}
  </div>
);

// ── Multi-parent selector (checkboxes) ─────────────────────
const ParentSelector = ({ stepOptions, selectedIds, onChange }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 max-h-44 overflow-y-auto divide-y divide-slate-100">
    <label className="flex items-center gap-2.5 px-3 py-2 hover:bg-white cursor-pointer">
      <input type="checkbox"
        checked={selectedIds.length === 0}
        onChange={() => onChange([])}
        className="accent-sky-500 flex-shrink-0" />
      <span className="text-xs font-semibold text-slate-500 italic">Point de départ (aucun)</span>
    </label>
    {stepOptions.map(o => (
      <label key={o.value} className="flex items-center gap-2.5 px-3 py-2 hover:bg-white cursor-pointer">
        <input type="checkbox"
          checked={selectedIds.includes(o.value)}
          onChange={e => {
            if (e.target.checked) onChange([...selectedIds, o.value]);
            else onChange(selectedIds.filter(id => id !== o.value));
          }}
          className="accent-sky-500 flex-shrink-0" />
        <span className="text-xs text-slate-700 truncate">{o.label}</span>
      </label>
    ))}
    {stepOptions.length === 0 && (
      <p className="px-3 py-2 text-xs text-slate-400 italic">Aucune étape disponible</p>
    )}
  </div>
);

// ── Main editor ────────────────────────────────────────────
const FlowChartEditor = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dragRef  = useRef(null);
  const fileRef  = useRef(null);

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
  const [newParam,     setNewParam]     = useState('');
  const [newTool,      setNewTool]      = useState('');
  const [uploadingFile,setUploadingFile]= useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const mediaFileRef = useRef(null);
  const canvasRef    = useRef(null);

  // ── Load from DB ─────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const fc = await flowchartService.getById(id);
        setTitle(fc.title || '');
        setDescription(fc.description || '');
        setStatus(fc.status || 'draft');
        const loadedSteps = (Array.isArray(fc.steps) ? fc.steps : []).map(migrateStep);
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
  const stepOptions  = useMemo(() => steps
    .filter(s => s.id !== selectedId)
    .map(s => ({ value: s.id, label: `${s.number}. ${s.label}` })), [steps, selectedId]);

  const handleSelect = (id) => { setSelectedId(id); setPanel('view'); setConfirmDel(false); };

  // ── Edit step ─────────────────────────────────────────────
  const openEdit = () => {
    if (!selectedStep) return;
    setDraft({
      label:       selectedStep.label,
      shape:       selectedStep.shape,
      description: selectedStep.description || '',
      parentIds:   [...(selectedStep.parentIds || [])],
      tools:       [...(selectedStep.tools || [])],
      parameters:  [...(selectedStep.parameters || [])],
      media:       [...(selectedStep.media || [])],
      saveToLib:   false,
    });
    setNewParam(''); setNewTool('');
    setPanel('edit');
  };

  const saveEdit = async () => {
    if (!draft?.label.trim()) return;
    const updated = {
      ...selectedStep,
      label: draft.label.trim(), shape: draft.shape,
      description: draft.description,
      parentIds: draft.parentIds || [],
      tools: draft.tools || [], parameters: draft.parameters || [], media: draft.media,
    };
    const nextSteps = steps.map(s => s.id === selectedId ? updated : s);
    setSteps(nextSteps);
    if (draft.saveToLib) {
      try {
        await procedureService.create({
          label: draft.label.trim(), shape: draft.shape,
          description: draft.description,
          tools: draft.tools, parameters: draft.parameters, media: draft.media,
        });
      } catch (err) { console.error('Erreur bibliothèque:', err); }
    }
    await save(nextSteps);
    setPanel('view');
  };

  // ── Add step ──────────────────────────────────────────────
  const openAdd = () => {
    const defaultParent = selectedId ? [selectedId] : (steps[steps.length - 1]?.id ? [steps[steps.length - 1].id] : []);
    setDraft({
      label: '', shape: 'operation', description: '',
      parentIds: defaultParent,
      tools: [], parameters: [], media: [], saveToLib: false,
    });
    setNewParam(''); setNewTool('');
    setPanel('add');
  };

  const handleSelectProcedure = (proc) => {
    setDraft(d => ({
      ...d,
      label:       proc.label,
      shape:       proc.shape,
      description: proc.description || '',
      tools:       [...(proc.tools || [])],
      parameters:  [...(proc.parameters || [])],
      media:       [...(proc.media || [])],
      procedure_id: proc.id,
    }));
  };

  const confirmAdd = async () => {
    if (!draft?.label.trim()) return;
    const firstParentId = (draft.parentIds || [])[0] || '';
    const parent = steps.find(s => s.id === firstParentId) || steps[steps.length - 1];
    const siblings = steps.filter(s => (s.parentIds || []).includes(parent?.id)).length;
    const xOff = [0, 260, -260, 520, -520];
    const newStep = {
      id: createId(), number: steps.length + 1,
      parentIds: draft.parentIds || [],
      label: draft.label.trim(), shape: draft.shape,
      description: draft.description,
      tools: draft.tools || [], parameters: draft.parameters || [], media: draft.media,
      procedure_id: draft.procedure_id || null,
      x: (parent?.x ?? 80) + (xOff[siblings] ?? siblings * 220),
      y: (parent?.y ?? 60) + 160,
    };
    const nextSteps = [...steps, newStep];
    setSteps(nextSteps);
    setSelectedId(newStep.id);
    if (draft.saveToLib && !draft.procedure_id) {
      try {
        await procedureService.create({ label: newStep.label, shape: newStep.shape, description: newStep.description, tools: newStep.tools, parameters: newStep.parameters, media: newStep.media });
      } catch (err) { console.error(err); }
    }
    await save(nextSteps);
    setPanel('view');
  };

  // ── Delete step ───────────────────────────────────────────
  const confirmDeleteStep = async () => {
    if (!selectedStep) return;
    const deletedId = selectedStep.id;
    const nextSteps = steps
      .filter(s => s.id !== deletedId)
      .map(s => ({ ...s, parentIds: (s.parentIds || []).filter(pid => pid !== deletedId) }))
      .map((s, i) => ({ ...s, number: i + 1 }));
    setSteps(nextSteps);
    const next = nextSteps[0] || null;
    setSelectedId(next?.id || null);
    setPanel('view'); setConfirmDel(false);
    await save(nextSteps);
  };

  // ── Media helpers ─────────────────────────────────────────
  const removeMedia = (i) => setDraft(d => ({ ...d, media: d.media.filter((_, idx) => idx !== i) }));
  const updateMediaTitle = (i, title) => setDraft(d => ({
    ...d,
    media: d.media.map((m, idx) => idx === i ? { ...m, title } : m),
  }));

  // ── Parameter helpers ─────────────────────────────────────
  const addParamToDraft = () => {
    if (!newParam.trim()) return;
    setDraft(d => ({ ...d, parameters: [...(d.parameters || []), newParam.trim()] }));
    setNewParam('');
  };
  const removeParamFromDraft = (i) =>
    setDraft(d => ({ ...d, parameters: (d.parameters || []).filter((_, idx) => idx !== i) }));

  // ── Tool helpers ───────────────────────────────────────────
  const addToolToDraft = () => {
    if (!newTool.trim()) return;
    setDraft(d => ({ ...d, tools: [...(d.tools || []), newTool.trim()] }));
    setNewTool('');
  };
  const removeToolFromDraft = (i) =>
    setDraft(d => ({ ...d, tools: (d.tools || []).filter((_, idx) => idx !== i) }));

  // ── File upload to Supabase Storage ───────────────────────
  const uploadFile = async (file) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      alert('Supabase non configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.');
      return null;
    }
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const path = `flowchart-media/${id || 'draft'}/${safeFileName}`;
    const { data, error } = await supabase.storage.from('flowchart-media').upload(path, file, { upsert: false });
    if (error) { alert('Erreur upload : ' + error.message); return null; }
    const { data: { publicUrl } } = supabase.storage.from('flowchart-media').getPublicUrl(data.path);
    return publicUrl;
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []); if (!files.length) return;
    setUploadingFile(true);
    try {
      for (const file of files) {
        const url = await uploadFile(file);
        if (url) {
          const type = file.type.startsWith('image/') ? 'image'
            : file.type.startsWith('video/') ? 'video'
            : 'document';
          // Default title = filename without extension; user can edit inline
          const defaultTitle = file.name.replace(/\.[^/.]+$/, '');
          setDraft(d => ({
            ...d,
            media: [...(d.media || []), { type, title: defaultTitle, url, duration: '' }],
          }));
        }
      }
    } finally { setUploadingFile(false); e.target.value = ''; }
  };

  // ── Detailed PDF export (text-based, all procedures) ──────
  const exportDetailedPDF = async () => {
    setExportingPdf(true);
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const PW = pdf.internal.pageSize.getWidth();
      const PH = pdf.internal.pageSize.getHeight();
      const MARGIN = 15;
      const COL = PW - MARGIN * 2;
      let y = MARGIN;

      const checkPage = (needed = 10) => {
        if (y + needed > PH - MARGIN) {
          pdf.addPage();
          y = MARGIN;
        }
      };

      const drawLine = () => {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(MARGIN, y, PW - MARGIN, y);
        y += 4;
      };

      // Cover
      pdf.setFillColor(15, 29, 53);
      pdf.rect(0, 0, PW, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title || 'Flow Chart', MARGIN, 20);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')} — ${steps.length} étape(s)`, MARGIN, 30);
      if (description) {
        pdf.setTextColor(180, 200, 220);
        pdf.text(description, MARGIN, 36);
      }
      y = 50;

      // Steps
      for (const step of [...steps].sort((a, b) => a.number - b.number)) {
        checkPage(30);
        const cfg = SHAPE_CONFIG[step.shape] || SHAPE_CONFIG.operation;

        // Step header bar
        pdf.setFillColor(241, 245, 249);
        pdf.roundedRect(MARGIN, y, COL, 10, 2, 2, 'F');
        pdf.setTextColor(15, 29, 53);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Étape ${step.number} — ${step.label}`, MARGIN + 3, y + 7);
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(cfg.label, PW - MARGIN - 3, y + 7, { align: 'right' });
        y += 13;

        // Parents
        const parentLabels = (step.parentIds || [])
          .map(pid => { const p = steps.find(s => s.id === pid); return p ? `${p.number}. ${p.label}` : null; })
          .filter(Boolean);
        if (parentLabels.length > 0) {
          pdf.setFontSize(8);
          pdf.setTextColor(100, 116, 139);
          pdf.setFont('helvetica', 'italic');
          checkPage(6);
          pdf.text(`Après : ${parentLabels.join(', ')}`, MARGIN + 2, y);
          y += 5;
        }

        // Description
        if (step.description) {
          checkPage(10);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(51, 65, 85);
          const lines = pdf.splitTextToSize(step.description, COL - 4);
          pdf.text(lines, MARGIN + 2, y);
          y += lines.length * 4.5 + 2;
        }

        // Parameters
        if ((step.parameters || []).length > 0) {
          checkPage(8);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(14, 165, 233);
          pdf.text('Paramètres :', MARGIN + 2, y); y += 4;
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(51, 65, 85);
          for (const param of step.parameters) {
            checkPage(5);
            const lines = pdf.splitTextToSize(`• ${param}`, COL - 8);
            pdf.text(lines, MARGIN + 5, y);
            y += lines.length * 4 + 1;
          }
          y += 1;
        }

        // Tools
        if ((step.tools || []).length > 0) {
          checkPage(8);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(245, 158, 11);
          pdf.text('Outils / Matériel :', MARGIN + 2, y); y += 4;
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(51, 65, 85);
          const toolText = step.tools.join(' · ');
          const lines = pdf.splitTextToSize(toolText, COL - 6);
          pdf.text(lines, MARGIN + 5, y);
          y += lines.length * 4 + 2;
        }

        // Media
        if ((step.media || []).length > 0) {
          checkPage(8);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(99, 102, 241);
          pdf.text('Photos / Vidéos / Documents :', MARGIN + 2, y); y += 4;
          for (const m of step.media) {
            checkPage(5);
            const icon = m.type === 'video' ? '[Vidéo]' : m.type === 'document' ? '[Doc]' : '[Image]';
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(51, 65, 85);
            const mLine = `${icon} ${m.title || 'Sans titre'}`;
            const lines = pdf.splitTextToSize(mLine, COL - 8);
            pdf.text(lines, MARGIN + 5, y);
            y += lines.length * 4 + 1;
            if (m.url) {
              pdf.setFontSize(7);
              pdf.setTextColor(148, 163, 184);
              pdf.textWithLink(m.url.slice(0, 70) + (m.url.length > 70 ? '…' : ''), MARGIN + 8, y, { url: m.url });
              y += 4;
              pdf.setFontSize(8);
            }
          }
          y += 1;
        }

        drawLine();
      }

      // Footer on last page
      pdf.setFontSize(7);
      pdf.setTextColor(148, 163, 184);
      pdf.text(`WEB-RAI — ${title} — Page ${pdf.internal.getCurrentPageInfo().pageNumber}`, MARGIN, PH - 8);

      pdf.save(`${(title || 'flowchart').replace(/\s+/g, '_')}_procedures.pdf`);
    } catch (err) {
      console.error('Erreur export PDF:', err);
      alert('Erreur lors de la génération du PDF');
    } finally { setExportingPdf(false); }
  };

  // ── Canvas screenshot PDF (visual diagram) ────────────────
  const exportDiagramPDF = async () => {
    if (!canvasRef.current) return;
    setExportingPdf(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const canvas = await html2canvas(canvasRef.current, { scale: 1.5, useCORS: true, backgroundColor: '#f1f5f9', logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const W = pdf.internal.pageSize.getWidth();
      const H = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(14); pdf.setTextColor(15, 29, 53);
      pdf.text(title || 'Flow Chart', 10, 12);
      pdf.setFontSize(8); pdf.setTextColor(100, 116, 139);
      pdf.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 10, 18);
      const imgH = (canvas.height * (W - 20)) / canvas.width;
      const maxH = H - 25;
      const finalH = Math.min(imgH, maxH);
      const finalW = imgH > maxH ? ((W - 20) * maxH) / imgH : W - 20;
      pdf.addImage(imgData, 'PNG', 10, 22, finalW, finalH);
      pdf.save(`${(title || 'flowchart').replace(/\s+/g, '_')}_diagramme.pdf`);
    } catch (err) {
      console.error('Erreur export PDF diagramme:', err);
      alert('Erreur lors de la génération du PDF');
    } finally { setExportingPdf(false); }
  };

  // ── Word export (HTML blob — opens in Word) ───────────────
  const exportWord = () => {
    const escape = (s = '') => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const sorted = [...steps].sort((a, b) => a.number - b.number);

    const stepsHtml = sorted.map(step => {
      const cfg = SHAPE_CONFIG[step.shape] || SHAPE_CONFIG.operation;
      const parentLabels = (step.parentIds || [])
        .map(pid => { const p = steps.find(s => s.id === pid); return p ? `${p.number}. ${escape(p.label)}` : null; })
        .filter(Boolean);

      const paramsHtml = (step.parameters || []).length > 0
        ? `<p style="font-weight:bold;color:#0ea5e9;margin:8px 0 4px;">Paramètres :</p><ul style="margin:0;padding-left:20px;">${
            step.parameters.map(p => `<li style="font-size:10pt;">${escape(p)}</li>`).join('')
          }</ul>` : '';

      const toolsHtml = (step.tools || []).length > 0
        ? `<p style="font-weight:bold;color:#f59e0b;margin:8px 0 4px;">Outils / Matériel :</p><p style="font-size:10pt;margin:0;">${
            step.tools.map(escape).join(' · ')
          }</p>` : '';

      const mediaHtml = (step.media || []).length > 0
        ? `<p style="font-weight:bold;color:#6366f1;margin:8px 0 4px;">Photos / Vidéos / Documents :</p>${
            step.media.map(m => {
              const icon = m.type === 'video' ? '🎬' : m.type === 'document' ? '📄' : '📷';
              const imgTag = m.type === 'image' && m.url
                ? `<br/><img src="${m.url}" style="max-width:400px;max-height:250px;display:block;margin:4px 0;border:1px solid #e2e8f0;" />`
                : '';
              return `<p style="font-size:10pt;margin:2px 0;">${icon} <strong>${escape(m.title || 'Sans titre')}</strong>${imgTag}</p>`;
            }).join('')
          }` : '';

      return `
        <div style="page-break-inside:avoid;margin-bottom:24px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          <div style="background:#0f1d35;color:white;padding:10px 14px;">
            <span style="font-size:13pt;font-weight:bold;">Étape ${step.number} — ${escape(step.label)}</span>
            <span style="float:right;font-size:9pt;color:#94a3b8;">${escape(cfg.label)}</span>
          </div>
          <div style="padding:12px 14px;">
            ${parentLabels.length > 0 ? `<p style="font-size:9pt;color:#64748b;margin:0 0 6px;font-style:italic;">Après : ${parentLabels.join(', ')}</p>` : ''}
            ${step.description ? `<p style="font-size:10pt;color:#334155;margin:0 0 6px;">${escape(step.description)}</p>` : ''}
            ${paramsHtml}
            ${toolsHtml}
            ${mediaHtml}
          </div>
        </div>`;
    }).join('');

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8"/>
        <title>${escape(title)}</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; margin: 20mm; }
          h1 { color: #0f1d35; font-size: 18pt; }
          p { line-height: 1.5; }
        </style>
      </head>
      <body>
        <h1>${escape(title || 'Flow Chart')}</h1>
        <p style="color:#64748b;font-size:9pt;">Exporté le ${new Date().toLocaleDateString('fr-FR')} · ${steps.length} étape(s) · WEB-RAI</p>
        ${description ? `<p style="font-style:italic;color:#475569;">${escape(description)}</p>` : ''}
        <hr style="margin:16px 0;border:1px solid #e2e8f0;"/>
        ${stepsHtml}
      </body>
      </html>`;

    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'flowchart').replace(/\s+/g, '_')}_procedures.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Export / Import JSON ──────────────────────────────────
  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ title, description, steps }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
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
          setSteps(p.steps.map(migrateStep));
          setSelectedId(p.steps[0]?.id || null);
          setPanel('view');
        }
      } catch { alert('Fichier JSON invalide.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Connectors — support multiple parents ─────────────────
  const connectors = steps.flatMap(s =>
    (s.parentIds || []).map(pid => {
      const p = steps.find(x => x.id === pid); if (!p) return null;
      const sx = p.x + STEP_W/2, sy = p.y + STEP_H;
      const ex = s.x + STEP_W/2, ey = s.y;
      const my = sy + Math.max(16, (ey - sy) / 2);
      return { id: `${p.id}-${s.id}`, sx, sy, ex, ey, my };
    })
  ).filter(Boolean);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400">Chargement de la gamme…</p>
      </div>
    </div>
  );

  // ── Shared edit form sections (used in both ADD and EDIT panels)
  const renderFormBody = () => (
    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
      {panel === 'add' && (
        <div>
          <span className={labelCls}>Libellé * <span className="normal-case font-normal text-slate-400">(recherche dans la bibliothèque)</span></span>
          <ProcedureSearch
            value={draft.label}
            onChange={v => setDraft(d => ({ ...d, label: v, procedure_id: null }))}
            onSelect={handleSelectProcedure}
          />
        </div>
      )}
      {panel === 'edit' && (
        <label className="block">
          <span className={labelCls}>Libellé *</span>
          <input type="text" value={draft.label} onChange={e => setDraft(d => ({ ...d, label: e.target.value }))} className={fieldCls} />
        </label>
      )}

      <label className="block">
        <span className={labelCls}>Type</span>
        <select value={draft.shape} onChange={e => setDraft(d => ({ ...d, shape: e.target.value }))} className={fieldCls}>
          {Object.entries(SHAPE_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </label>

      {/* Multiple parents */}
      <div>
        <span className={labelCls}>Vient de (après quelles étapes)</span>
        <ParentSelector
          stepOptions={stepOptions}
          selectedIds={draft.parentIds || []}
          onChange={ids => setDraft(d => ({ ...d, parentIds: ids }))}
        />
        {(draft.parentIds || []).length > 1 && (
          <p className="mt-1 text-[10px] text-sky-600 font-medium">
            ✓ Cette étape démarre après {draft.parentIds.length} étapes terminées
          </p>
        )}
      </div>

      <label className="block">
        <span className={labelCls}>Description</span>
        <textarea rows={2} value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} className={fieldCls + ' resize-none'} placeholder="Description courte…" />
      </label>

      {/* Tools */}
      <div>
        <span className={labelCls}>Équipements / Outils ({(draft.tools||[]).length})</span>
        <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
          {(draft.tools||[]).map((t,i) => (
            <div key={i} className="flex items-center gap-2 bg-amber-50 rounded-lg border border-amber-200 px-3 py-2">
              <span className="text-xs text-amber-800 flex-1">{t}</span>
              <button type="button" onClick={() => removeToolFromDraft(i)}
                className="w-5 h-5 flex items-center justify-center text-amber-400 hover:text-red-500"><X className="w-3 h-3" /></button>
            </div>
          ))}
          {!(draft.tools||[]).length && <p className="text-xs text-slate-400 italic px-1">Aucun équipement</p>}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newTool} onChange={e=>setNewTool(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addToolToDraft();}}}
            className={fieldCls} placeholder="Équipement / outil… (Entrée)" />
          <button type="button" onClick={addToolToDraft} disabled={!newTool.trim()}
            className="flex-shrink-0 px-3 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 disabled:opacity-40">+</button>
        </div>
      </div>

      {/* Parameters */}
      <div>
        <span className={labelCls}>Paramètres ({(draft.parameters||[]).length})</span>
        <div className="space-y-1.5 mb-2 max-h-40 overflow-y-auto">
          {(draft.parameters||[]).map((p,i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg border border-slate-200 px-3 py-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-100 text-[9px] font-bold text-sky-700 flex-shrink-0">{i+1}</span>
              <span className="flex-1 text-xs text-slate-700">{p}</span>
              <button type="button" onClick={() => removeParamFromDraft(i)}
                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
            </div>
          ))}
          {!(draft.parameters||[]).length && <p className="text-xs text-slate-400 italic px-1">Aucun paramètre</p>}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newParam} onChange={e=>setNewParam(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addParamToDraft();}}}
            className={fieldCls} placeholder="Nouveau paramètre… (Entrée)" />
          <button type="button" onClick={addParamToDraft} disabled={!newParam.trim()}
            className="flex-shrink-0 px-3 rounded-xl bg-sky-500 text-white text-sm font-bold hover:bg-sky-600 disabled:opacity-40">+</button>
        </div>
      </div>

      {/* Media with editable titles */}
      <div>
        <p className={labelCls}>Photos / Vidéos ({(draft.media||[]).length}) — donnez un titre à chaque fichier</p>
        <div className="space-y-2 mb-2">
          {(draft.media || []).map((m, i) => (
            <MediaItem key={i} item={m} index={i}
              onRemove={() => removeMedia(i)}
              onTitleChange={updateMediaTitle} />
          ))}
        </div>
        <button type="button" onClick={() => mediaFileRef.current?.click()}
          disabled={uploadingFile}
          className="w-full py-2.5 rounded-xl text-xs font-semibold border-2 border-dashed border-slate-300 text-slate-500 hover:border-sky-400 hover:text-sky-600 transition-colors disabled:opacity-50">
          {uploadingFile ? '⏳ Upload en cours…' : '📎 Ajouter fichier — image · vidéo · PDF · Word'}
        </button>
        <input ref={mediaFileRef} type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={handleFileUpload} />
      </div>

      {/* Save to library */}
      {(panel === 'edit' || !draft.procedure_id) && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={draft.saveToLib || false} onChange={e => setDraft(d => ({ ...d, saveToLib: e.target.checked }))}
            className="rounded border-slate-300 text-sky-500" />
          <span className="text-xs text-slate-600">Sauvegarder dans la bibliothèque de procédures</span>
        </label>
      )}
      {panel === 'add' && draft.procedure_id && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-emerald-700">Procédure de la bibliothèque</span>
        </div>
      )}
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
            className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border focus:outline-none focus:ring-1 focus:ring-sky-200 cursor-pointer ${
              status === 'published' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50">
            <Upload className="w-3.5 h-3.5" /> Importer
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          <button onClick={handleExport}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50">
            <Download className="w-3.5 h-3.5" /> JSON
          </button>

          {/* Diagram PDF */}
          <button onClick={exportDiagramPDF} disabled={exportingPdf}
            title="PDF du diagramme visuel"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 bg-white hover:bg-red-50 disabled:opacity-50">
            <Printer className="w-3.5 h-3.5" />
            Diagramme
          </button>

          {/* Detailed PDF */}
          <button onClick={exportDetailedPDF} disabled={exportingPdf}
            title="PDF avec détail de toutes les procédures"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50">
            <FileText className="w-3.5 h-3.5" />
            {exportingPdf ? 'Export…' : 'PDF fiches'}
          </button>

          {/* Word export */}
          <button onClick={exportWord}
            title="Exporter en Word (toutes les procédures avec photos)"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50">
            <Download className="w-3.5 h-3.5" />
            Word
          </button>

          {/* Save */}
          <button onClick={() => save()} disabled={saving}
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
      <div className="flex flex-1 min-h-0 overflow-hidden flex-col md:flex-row">

        {/* Canvas */}
        <div className="flex-1 min-w-0 overflow-auto relative"
          style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div ref={canvasRef} style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', minWidth: 900, minHeight: 1100, position: 'relative' }}>
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
        <div className="w-full md:w-80 flex-shrink-0 border-t md:border-t-0 md:border-l border-slate-200 bg-white overflow-y-auto flex flex-col max-h-[45vh] md:max-h-none">

          {/* VIEW */}
          {(panel === 'view' || panel === 'delete') && (
            <div className="flex-1 flex flex-col">
              {selectedStep ? (
                <>
                  <div className="px-4 py-4 border-b border-slate-100 flex-shrink-0" style={{ background: '#0f1d35' }}>
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
                    {(selectedStep.parameters || []).length > 0 && (
                      <div>
                        <p className={labelCls}>Paramètres</p>
                        <div className="space-y-1.5">
                          {selectedStep.parameters.map((p, i) => (
                            <div key={i} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-1" />{p}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                    {(selectedStep.media || []).length > 0 && (
                      <div>
                        <p className={labelCls}>Photos / Vidéos</p>
                        <div className="space-y-2">
                          {selectedStep.media.map((m, i) => <MediaItem key={i} item={m} index={i} readOnly />)}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className={labelCls}>Vient de</p>
                      {(selectedStep.parentIds || []).length === 0 ? (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 italic">Point de départ</div>
                      ) : (
                        <div className="space-y-1.5">
                          {(selectedStep.parentIds || []).map(pid => {
                            const p = steps.find(s => s.id === pid);
                            return p ? (
                              <div key={pid} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                {p.number}. {p.label}
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
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
                <button onClick={() => setPanel('view')} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200"><X className="w-4 h-4" /></button>
              </div>
              {renderFormBody()}
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
                <button onClick={() => setPanel('view')} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200"><X className="w-4 h-4" /></button>
              </div>
              {renderFormBody()}
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
            <div className="mt-2 text-[10px] text-slate-400 space-y-0.5">
              <p>📄 <strong>PDF fiches</strong> — toutes les procédures imprimables</p>
              <p>📐 <strong>Diagramme</strong> — capture du schéma visuel</p>
              <p>📝 <strong>Word</strong> — document modifiable avec photos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowChartEditor;
