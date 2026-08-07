import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gammeService } from '../../services/api';
import {
  Plus, ScrollText, Pencil, Trash2, Search, XCircle, PackageOpen, Clock, Layers, Package,
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import DataLabel from '../../components/ui/DataLabel.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

const formatDate = (v) => {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Sum of étapes / outillages across every processus this gamme contains.
const etapeCountOf = (g) => (g.processus || []).reduce((s, p) => s + (p.etapes || []).length, 0);
const outillageCountOf = (g) => (g.processus || []).reduce(
  (s, p) => s + (p.etapes || []).reduce((s2, e) => s2 + (e.gammeOutillages || []).length, 0), 0);

const GammeFabricationIndex = () => {
  const navigate = useNavigate();
  const [gammes,   setGammes]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [creating, setCreating] = useState(false);
  const [newNom,   setNewNom]   = useState('');
  const [saving,   setSaving]   = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await gammeService.getAll();
      setGammes(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = gammes.filter((g) => g.nom?.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async () => {
    if (!newNom.trim()) return;
    setSaving(true);
    try {
      const g = await gammeService.create({ nom: newNom.trim() });
      navigate(`/industrialization/gamme-fab/${g.id}`);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (g) => {
    if (!window.confirm(`Supprimer "${g.nom}" et tout son contenu (processus, étapes, outillages liés) ?`)) return;
    try { await gammeService.delete(g.id); load(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="flex-1 overflow-auto px-[26px] pt-6 pb-10 space-y-[18px]" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <motion.div variants={staggerItemVariants} className="flex flex-wrap items-end justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <ScrollText className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Gestion outillages</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>Gammes de fabrication — processus, étapes et outillages</p>
          </div>
        </div>
        <button onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
          <Plus className="w-4 h-4" />
          Nouvelle gamme
        </button>
      </motion.div>

      {/* New gamme inline form */}
      {creating && (
        <motion.div
          variants={staggerItemVariants}
          className="rounded-[14px] p-4 flex items-center gap-3"
          style={{ background: 'var(--panel)', border: '1px solid var(--accent)', boxShadow: '0 0 0 1px var(--accent-soft)' }}
        >
          <ScrollText className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          <input
            autoFocus type="text" value={newNom}
            onChange={(e) => setNewNom(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false); }}
            placeholder="Nom de la gamme de fabrication (ex : Sertissage faisceau VENTA)"
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: 'var(--text)' }}
          />
          <button onClick={handleCreate} disabled={saving || !newNom.trim()}
            className="px-3 py-1.5 rounded-[8px] text-xs font-bold text-white disabled:opacity-50 transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
            {saving ? 'Création…' : 'Créer'}
          </button>
          <button onClick={() => { setCreating(false); setNewNom(''); }}
            className="w-7 h-7 rounded-[8px] flex items-center justify-center transition-colors hover:bg-[var(--panel3)]"
            style={{ color: 'var(--text3)' }}>
            <XCircle className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Search */}
      <motion.div variants={staggerItemVariants} className="relative max-w-[520px]">
        <Search className="absolute left-[13px] top-1/2 -translate-y-1/2 w-[15px] h-[15px] pointer-events-none" style={{ color: 'var(--text3)' }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une gamme de fabrication…"
          className="w-full pl-10 pr-4 py-[11px] rounded-[11px] text-[13px] outline-none transition-colors"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text3)' }}>
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      {/* Count */}
      <DataLabel>{loading ? 'Chargement…' : `${filtered.length} gamme(s)`}</DataLabel>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--text3)' }}>
          <PackageOpen className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {gammes.length === 0 ? 'Aucune gamme — créez la première' : 'Aucun résultat'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}>
          {filtered.map((g) => {
            const procCount = (g.processus || []).length;
            const etapeCount = etapeCountOf(g);
            const outCount   = outillageCountOf(g);
            return (
              <motion.div
                key={g.id}
                variants={staggerItemVariants}
                className="rounded-[14px] flex flex-col transition-all hover:-translate-y-1"
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow)',
                  transitionProperty: 'transform, border-color, box-shadow',
                  transitionDuration: '0.18s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 10px 30px var(--accent-soft)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid var(--border2)' }}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <StatusBadge variant={procCount > 0 ? 'ok' : 'warn'}>
                      {procCount} processus
                    </StatusBadge>
                    {etapeCount > 0 && <DataLabel>{etapeCount} étape(s)</DataLabel>}
                    {outCount > 0 && <DataLabel>{outCount} outillage(s)</DataLabel>}
                  </div>
                  <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{g.nom}</h3>
                </div>

                <div className="px-4 py-2.5 flex-1">
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text3)' }}>
                    <Clock className="w-3.5 h-3.5" strokeWidth={1.8} />
                    {formatDate(g.updatedAt)}
                  </span>
                </div>

                <div className="flex gap-2 px-4 py-3" style={{ borderTop: '1px solid var(--border2)' }}>
                  <button onClick={() => navigate(`/industrialization/gamme-fab/${g.id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-[8px] text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
                    <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
                    Ouvrir
                  </button>
                  <button onClick={() => handleDelete(g)}
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

export default GammeFabricationIndex;
