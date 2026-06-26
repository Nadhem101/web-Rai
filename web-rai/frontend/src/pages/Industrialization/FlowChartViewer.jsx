import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { flowchartService } from '../../services/api';
import {
  ChevronLeft, GitBranch, ZoomIn, ZoomOut,
  X, Image, Video, ExternalLink, CheckSquare,
} from 'lucide-react';

// ── Constants ──────────────────────────────────────────────
const STEP_W = 210;
const STEP_H = 84;

const SHAPE_CONFIG = {
  'operation':         { label: 'Opération',             color: 'sky',    abbr: 'OP' },
  'operation-control': { label: 'Opération + contrôle',  color: 'indigo', abbr: 'OC' },
  'control':           { label: 'Contrôle',              color: 'amber',  abbr: 'CT' },
  'storage':           { label: 'Stockage',              color: 'slate',  abbr: 'ST' },
};

const COLORS = {
  sky:    { border: 'border-sky-400',    badge: 'bg-sky-100 text-sky-700',     ring: 'ring-sky-200'    },
  indigo: { border: 'border-indigo-400', badge: 'bg-indigo-100 text-indigo-700',ring: 'ring-indigo-200' },
  amber:  { border: 'border-amber-400',  badge: 'bg-amber-100 text-amber-700', ring: 'ring-amber-200'  },
  slate:  { border: 'border-slate-400',  badge: 'bg-slate-200 text-slate-600', ring: 'ring-slate-200'  },
};

// ── Helpers ────────────────────────────────────────────────
const migrateStep = (s) => ({
  ...s,
  parentIds: s.parentIds ?? (s.parentId ? [s.parentId] : []),
});

const isImageUrl = (url = '') =>
  /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url) ||
  url.includes('drive.google.com') ||
  url.includes('imgur.com');

const getYouTubeId = (url = '') => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
};

// ── Step node (read-only) ──────────────────────────────────
const StepNode = ({ step, selected, onClick }) => {
  const cfg   = SHAPE_CONFIG[step.shape] || SHAPE_CONFIG.operation;
  const color = COLORS[cfg.color];
  const hasMedia = (step.media || []).length > 0;

  return (
    <button type="button" onClick={() => onClick(step)}
      className={`absolute z-10 flex flex-col justify-center rounded-xl border-2 bg-white px-3 py-2 text-left shadow-sm transition-all duration-150 cursor-pointer
        ${color.border} ${selected ? `ring-4 ${color.ring} shadow-lg scale-105` : 'hover:shadow-md hover:scale-[1.02]'}`}
      style={{ left: step.x, top: step.y, width: STEP_W, height: STEP_H }}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white flex-shrink-0">
          {step.number}
        </span>
        <div className="flex items-center gap-1">
          {hasMedia && <Image className="w-3 h-3 text-slate-400" />}
          {(step.subSteps || []).length > 0 && (
            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-1 rounded">
              +{step.subSteps.length}
            </span>
          )}
          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${color.badge}`}>{cfg.abbr}</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">{step.label}</p>
      <p className="mt-0.5 text-[10px] text-slate-500 truncate">{cfg.label}</p>
    </button>
  );
};

// ── Step detail modal ──────────────────────────────────────
const StepModal = ({ step, steps, onClose }) => {
  if (!step) return null;
  const cfg     = SHAPE_CONFIG[step.shape] || SHAPE_CONFIG.operation;
  const color   = COLORS[cfg.color];
  const parents = (step.parentIds || []).map(pid => steps.find(s => s.id === pid)).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="flex max-h-[90vh] min-h-0 w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
          style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700 text-sm font-bold text-white flex-shrink-0">
              {step.number}
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-white leading-tight truncate">{step.label}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${color.badge}`}>{cfg.label}</span>
                {parents.length > 0 && (
                  <span className="text-[11px] text-slate-400">← {parents.map(p => `${p.number}. ${p.label}`).join(', ')}</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">

          {/* Description */}
          {step.description && (
            <p className="text-sm text-slate-600 italic">{step.description}</p>
          )}

          {/* Parameters */}
          {(step.parameters || []).length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <CheckSquare className="w-3.5 h-3.5" /> Points de contrôle
              </h3>
              <div className="space-y-2">
                {step.parameters.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 border-slate-300 bg-white text-[10px] font-bold text-slate-500 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700">{p}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tools */}
          {(step.tools || []).length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Outils / Matériel</h3>
              <div className="flex flex-wrap gap-2">
                {step.tools.map(t => (
                  <span key={t} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Media */}
          {(step.media || []).length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Photos / Vidéos</h3>
              <div className="space-y-4">
                {step.media.map((m, i) => {
                  const ytId = m.type === 'video' ? getYouTubeId(m.url) : null;
                  return (
                    <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
                      {/* Image display */}
                      {m.type === 'image' && m.url && isImageUrl(m.url) && (
                        <img src={m.url} alt={m.title || ''} className="w-full max-h-64 object-contain bg-slate-50" />
                      )}
                      {/* YouTube embed */}
                      {ytId && (
                        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title={m.title || 'Video'}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                      {/* Caption / link fallback */}
                      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${m.type === 'video' ? 'bg-red-50' : 'bg-blue-50'}`}>
                            {m.type === 'video'
                              ? <Video className="w-3.5 h-3.5 text-red-500" />
                              : <Image className="w-3.5 h-3.5 text-blue-500" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">{m.title || (m.type === 'video' ? 'Vidéo' : 'Photo')}</p>
                            {m.duration && <p className="text-[10px] text-slate-400">Durée : {m.duration}</p>}
                          </div>
                        </div>
                        {m.url && (
                          <a href={m.url} target="_blank" rel="noopener noreferrer"
                            className="flex-shrink-0 flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700">
                            Ouvrir <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Sub-steps */}
          {(step.subSteps || []).length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-700">+</span>
                Sous-étapes ({step.subSteps.length})
              </h3>
              <div className="space-y-3">
                {step.subSteps.map((ss, idx) => (
                  <div key={ss.id || idx} className="rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden">
                    <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-100/70 border-b border-emerald-200">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white flex-shrink-0">
                        {step.number}.{ss.number}
                      </span>
                      <p className="text-sm font-bold text-emerald-900 leading-tight">{ss.label}</p>
                    </div>
                    {(ss.description || (ss.tools||[]).length > 0 || (ss.parameters||[]).length > 0) && (
                      <div className="px-4 py-3 space-y-2">
                        {ss.description && (
                          <p className="text-sm text-slate-600 italic">{ss.description}</p>
                        )}
                        {(ss.parameters || []).length > 0 && (
                          <div className="space-y-1.5">
                            {ss.parameters.map((p, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                                <span className="flex h-4 w-4 items-center justify-center rounded border-2 border-slate-300 bg-white text-[9px] font-bold text-slate-500 flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                {p}
                              </div>
                            ))}
                          </div>
                        )}
                        {(ss.tools || []).length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {ss.tools.map(t => (
                              <span key={t} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {(step.parameters || []).length === 0 && (step.tools || []).length === 0 && (step.media || []).length === 0 && (step.subSteps || []).length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <GitBranch className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">Aucun contenu ajouté à cette étape</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Viewer ─────────────────────────────────────────────────
const FlowChartViewer = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dragRef  = useRef(null);

  const [title,       setTitle]       = useState('');
  const [steps,       setSteps]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [zoom,        setZoom]        = useState(1);
  const [activeStep,  setActiveStep]  = useState(null);

  useEffect(() => {
    if (!id) return;
    flowchartService.getById(id)
      .then(fc => {
        setTitle(fc.title || '');
        setSteps(Array.isArray(fc.steps) ? fc.steps.map(migrateStep) : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Allow panning / dragging in view mode too
  useEffect(() => {
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, []);

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
        <p className="text-sm text-slate-400">Chargement du flow chart…</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden" style={{ background: 'var(--content-bg)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-5 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => navigate('/industrialization/flow-chart')}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flow Charts</span>
          </button>
          <div className="w-px h-4 bg-slate-200 flex-shrink-0 hidden sm:block" />
          <GitBranch className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-bold text-slate-800 truncate">{title}</span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 flex-shrink-0">
            Vue opérateur
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Zoom */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 py-1">
            <button onClick={() => setZoom(z => Math.max(0.4, +(z-0.1).toFixed(1)))}
              className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-slate-600 w-8 text-center">{Math.round(zoom*100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, +(z+0.1).toFixed(1)))}
              className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
          <button onClick={() => navigate(`/industrialization/flow-chart/${id}`)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            Éditer
          </button>
        </div>
      </div>

      {/* Instruction banner */}
      <div className="flex-shrink-0 px-5 py-2 bg-sky-50 border-b border-sky-100">
        <p className="text-xs text-sky-700 font-medium">
          Cliquez sur une étape pour voir ses paramètres, outils et documents associés
        </p>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto"
        style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', minWidth: 900, minHeight: 1100, position: 'relative' }}>
          <svg className="pointer-events-none absolute inset-0 w-full h-full" aria-hidden>
            <defs>
              <marker id="arr-view" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill="#94a3b8" />
              </marker>
            </defs>
            {connectors.map(c => (
              <path key={c.id}
                d={`M ${c.sx} ${c.sy} L ${c.sx} ${c.my} L ${c.ex} ${c.my} L ${c.ex} ${c.ey}`}
                fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arr-view)" />
            ))}
          </svg>
          {steps.map(s => (
            <StepNode key={s.id} step={s} selected={activeStep?.id === s.id} onClick={setActiveStep} />
          ))}
          {steps.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
              <GitBranch className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm">Ce flow chart ne contient pas encore d'étapes</p>
            </div>
          )}
        </div>
      </div>

      {/* Step detail modal */}
      {activeStep && (
        <StepModal step={activeStep} steps={steps} onClose={() => setActiveStep(null)} />
      )}
    </div>
  );
};

export default FlowChartViewer;
