import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { flowchartService } from '../../services/api';
import {
  Plus, GitBranch, Pencil, Trash2, Eye,
  Search, XCircle, PackageOpen, Clock,
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import DataLabel from '../../components/ui/DataLabel.jsx';
import HudCorner from '../../components/ui/HudCorner.jsx';
import GrowBar from '../../components/motion/GrowBar.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

const formatDate = (v) => {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ── Featured animated stepper for the first published flow chart ──
const FeaturedStepper = ({ fc }) => {
  if (!fc) return null;
  const steps    = Array.isArray(fc.steps) ? fc.steps : [];
  const total    = Math.max(steps.length, 5);
  const doneIdx  = steps.findIndex(s => s.status !== 'done') - 1;
  const current  = doneIdx + 1;
  const done     = Math.max(0, current);

  return (
    <motion.div
      variants={staggerItemVariants}
      className="relative overflow-hidden rounded-[16px] px-6 pb-7 pt-6 mb-4"
      style={{
        background: 'linear-gradient(135deg, var(--panel), var(--panel2))',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <HudCorner position="tl" size={15} glow />
      <HudCorner position="br" size={15} glow />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <StatusBadge variant="ok" pulse>PUBLIÉ</StatusBadge>
          <h3 className="font-display font-semibold text-[15px]" style={{ color: 'var(--text)' }}>{fc.title}</h3>
        </div>
        <DataLabel>{done} / {total} ÉTAPES</DataLabel>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {Array.from({ length: total }).map((_, i) => {
          const isDone    = i < done;
          const isCurrent = i === done;
          const isFuture  = i > done;
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <div className="flex-1 h-[3px] relative overflow-hidden rounded-full" style={{ background: 'var(--panel3)', minWidth: 8 }}>
                  {isDone && (
                    <GrowBar
                      axis="x"
                      delay={0.1 + (i - 1) * 0.12}
                      style={{ position: 'absolute', inset: 0, background: 'var(--accent)', borderRadius: 2 }}
                    />
                  )}
                </div>
              )}
              <div
                className="relative w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold transition-all"
                style={{
                  background: isDone
                    ? 'linear-gradient(135deg, var(--accent3), var(--accent2))'
                    : isCurrent
                    ? 'var(--accent-soft)'
                    : 'var(--panel3)',
                  color: isDone ? '#fff' : isCurrent ? 'var(--accent)' : 'var(--text3)',
                  border: isCurrent ? '2px solid var(--accent)' : '2px solid transparent',
                  boxShadow: isCurrent ? '0 0 0 4px var(--accent-soft), 0 0 8px var(--accent-soft)' : undefined,
                  animation: isCurrent ? 'glow-pulse 2s infinite' : undefined,
                }}
              >
                {isDone ? '✓' : i + 1}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </motion.div>
  );
};

// ── Main ───────────────────────────────────────────────────
const FlowChartsIndex = () => {
  const navigate = useNavigate();
  const [flowcharts, setFlowcharts] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [creating,   setCreating]   = useState(false);
  const [newTitle,   setNewTitle]   = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await flowchartService.getAll();
      setFlowcharts(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = flowcharts.filter(fc =>
    fc.title?.toLowerCase().includes(search.toLowerCase()) ||
    fc.description?.toLowerCase().includes(search.toLowerCase())
  );

  const featuredFc = flowcharts.find(fc => fc.status === 'published') || null;

  const handleCreate = async () => {
    const title = newTitle.trim() || 'Nouveau flow chart';
    try {
      const fc = await flowchartService.create({ title, steps: [] });
      navigate(`/industrialization/flow-chart/${fc.id}`);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (fc) => {
    if (!window.confirm(`Supprimer "${fc.title}" ?`)) return;
    try { await flowchartService.delete(fc.id); load(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="flex-1 overflow-auto px-[26px] pt-6 pb-10 space-y-[18px]" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <motion.div variants={staggerItemVariants} className="flex flex-wrap items-end justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <GitBranch className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Flow Charts</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>Guides visuels opératoires pour les opérateurs</p>
          </div>
        </div>
        <button onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
          <Plus className="w-4 h-4" />
          Nouveau flow chart
        </button>
      </motion.div>

      {/* Featured stepper (first published fc) */}
      {!loading && featuredFc && <FeaturedStepper fc={featuredFc} />}

      {/* New flowchart inline form */}
      {creating && (
        <motion.div
          variants={staggerItemVariants}
          className="rounded-[14px] p-4 flex items-center gap-3"
          style={{ background: 'var(--panel)', border: '1px solid var(--accent)', boxShadow: '0 0 0 1px var(--accent-soft)' }}
        >
          <GitBranch className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          <input
            autoFocus type="text" value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false); }}
            placeholder="Nom du flow chart (ex : Sertissage faisceau VENTA)"
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: 'var(--text)' }}
          />
          <button onClick={handleCreate}
            className="px-3 py-1.5 rounded-[8px] text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
            Créer
          </button>
          <button onClick={() => setCreating(false)}
            className="w-7 h-7 rounded-[8px] flex items-center justify-center transition-colors hover:bg-[var(--panel3)]"
            style={{ color: 'var(--text3)' }}>
            <XCircle className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Search */}
      <motion.div variants={staggerItemVariants} className="relative max-w-[520px]">
        <Search className="absolute left-[13px] top-1/2 -translate-y-1/2 w-[15px] h-[15px] pointer-events-none" style={{ color: 'var(--text3)' }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un flow chart…"
          className="w-full pl-10 pr-4 py-[11px] rounded-[11px] text-[13px] outline-none transition-colors"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text3)' }}>
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      {/* Count */}
      <DataLabel>{loading ? 'Chargement…' : `${filtered.length} flow chart(s)`}</DataLabel>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--text3)' }}>
          <PackageOpen className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {flowcharts.length === 0 ? 'Aucun flow chart — créez le premier' : 'Aucun flow chart trouvé'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}>
          {filtered.map((fc) => {
            const steps = Array.isArray(fc.steps) ? fc.steps : [];
            return (
              <motion.div
                key={fc.id}
                variants={staggerItemVariants}
                className="rounded-[14px] flex flex-col transition-all hover:-translate-y-1"
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow)',
                  transitionProperty: 'transform, border-color, box-shadow',
                  transitionDuration: '0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 10px 30px var(--accent-soft)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid var(--border2)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge variant={fc.status === 'published' ? 'ok' : 'warn'}>
                      {fc.status === 'published' ? 'Publié' : 'Brouillon'}
                    </StatusBadge>
                    {steps.length > 0 && <DataLabel>{steps.length} étape(s)</DataLabel>}
                  </div>
                  <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{fc.title}</h3>
                  {fc.description && (
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text2)' }}>{fc.description}</p>
                  )}
                </div>

                <div className="px-4 py-2.5 flex-1">
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text3)' }}>
                    <Clock className="w-3.5 h-3.5" strokeWidth={1.8} />
                    {formatDate(fc.updatedAt)}
                  </span>
                </div>

                <div className="flex gap-2 px-4 py-3" style={{ borderTop: '1px solid var(--border2)' }}>
                  <button onClick={() => navigate(`/industrialization/flow-chart/${fc.id}/view`)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-[8px] text-xs font-semibold transition-colors hover:bg-[var(--panel3)]"
                    style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
                    <Eye className="w-3.5 h-3.5" strokeWidth={1.8} />
                    Voir
                  </button>
                  <button onClick={() => navigate(`/industrialization/flow-chart/${fc.id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-[8px] text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
                    <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
                    Éditer
                  </button>
                  <button onClick={() => handleDelete(fc)}
                    className="w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)] flex-shrink-0"
                    style={{ color: 'var(--text3)' }}>
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlowChartsIndex;
