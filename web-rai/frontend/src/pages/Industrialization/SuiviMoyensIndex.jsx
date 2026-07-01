import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { suiviMoyenService } from '../../services/api';
import { Plus, Trash2, ChevronRight, Activity, User, Calendar } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import DataLabel from '../../components/ui/DataLabel.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR');
};

const SuiviMoyensIndex = () => {
  const navigate = useNavigate();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await suiviMoyenService.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const created = await suiviMoyenService.create({
        titre: 'Suivi création + réception des moyens',
        pilote: '',
        date_debut: today,
        status: 'actif',
      });
      navigate(`/industrialization/suivi-moyens/${created.id}`);
    } catch { alert('Erreur lors de la création'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (item, e) => {
    e.stopPropagation();
    if (!window.confirm(`Supprimer "${item.titre}" ?`)) return;
    try { await suiviMoyenService.delete(item.id); load(); }
    catch { alert('Erreur lors de la suppression'); }
  };

  return (
    <div className="flex-1 overflow-auto px-[26px] pt-6 pb-10" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <motion.div variants={staggerItemVariants} className="flex flex-wrap items-end justify-between gap-3.5 mb-[18px]">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <Activity className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Suivi des moyens</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>Création + réception des moyens · Département Industrialisation</p>
          </div>
        </div>
        <button onClick={handleCreate} disabled={creating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white disabled:opacity-50 transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
          <Plus className="w-4 h-4" />
          {creating ? 'Création…' : 'Nouveau suivi'}
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--text3)' }}>
          <Activity className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">Aucun suivi — créez le premier</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              variants={staggerItemVariants}
              onClick={() => navigate(`/industrialization/suivi-moyens/${item.id}`)}
              className="group cursor-pointer rounded-[14px] p-5 transition-all hover:-translate-y-1"
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
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                  <Activity className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge variant={item.status === 'actif' ? 'ok' : 'info'}>
                    {item.status === 'actif' ? 'Actif' : 'Archivé'}
                  </StatusBadge>
                  <button onClick={e => handleDelete(item, e)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                    style={{ color: 'var(--text3)' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-bold leading-tight mb-2 line-clamp-2" style={{ color: 'var(--text)' }}>{item.titre}</p>
              <div className="space-y-1 mt-2">
                {item.pilote && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text2)' }}>
                    <User className="w-3 h-3" strokeWidth={1.8} /> {item.pilote}
                  </div>
                )}
                {item.date_debut && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text2)' }}>
                    <Calendar className="w-3 h-3" strokeWidth={1.8} /> Début : {fmtDate(item.date_debut)}
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <DataLabel>Créé le {fmtDate(item.createdAt)}</DataLabel>
                <ChevronRight className="w-4 h-4 transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--text3)' }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuiviMoyensIndex;
