import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { chiffrageService } from '../../services/api';
import { Plus, Search, XCircle, Pencil, Trash2, Factory, Clock, PackageOpen } from 'lucide-react';
import DataLabel from '../../components/ui/DataLabel.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

// Design-token mapped status config
const STATUS_CONFIG = {
  brouillon:  { label: 'Brouillon', variant: 'info'   },
  en_cours:   { label: 'En cours',  variant: 'warn'   },
  valide:     { label: 'Validé',    variant: 'ok'     },
  archive:    { label: 'Archivé',   variant: 'info'   },
};

const formatDate = (v) => v ? new Date(v).toLocaleDateString('fr-FR') : '—';
const calcTotal  = (lignes = []) =>
  lignes.reduce((s, l) => s + Number(l.quantite || 0) * Number(l.prix_unitaire || 0), 0);

const fieldStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };

const IndustrializationIndex = () => {
  const navigate = useNavigate();
  const [chiffrages, setChiffrages] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [creating,   setCreating]   = useState(false);
  const [newData,    setNewData]    = useState({ affaire: '', client: '', reference_article: '' });
  const [saving,     setSaving]     = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await chiffrageService.getAll();
      setChiffrages(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = chiffrages.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (c.affaire || '').toLowerCase().includes(q) ||
           (c.client  || '').toLowerCase().includes(q) ||
           (c.reference_article || '').toLowerCase().includes(q) ||
           (c.titre   || '').toLowerCase().includes(q);
  });

  const handleCreate = async () => {
    if (!newData.affaire.trim() && !newData.reference_article.trim()) return;
    setSaving(true);
    try {
      const c = await chiffrageService.create({
        titre:             newData.affaire.trim() || newData.reference_article.trim(),
        affaire:           newData.affaire.trim()           || null,
        client:            newData.client.trim()            || null,
        reference_article: newData.reference_article.trim() || null,
      });
      navigate(`/industrialization/chiffrage/${c.id}`);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Supprimer le chiffrage "${c.affaire || c.reference_article}" ?`)) return;
    try { await chiffrageService.delete(c.id); load(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="flex-1 overflow-auto px-[26px] pt-6 pb-10 space-y-[18px]" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <motion.div variants={staggerItemVariants} className="flex flex-wrap items-end justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <Factory className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Chiffrage table de test</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>Costing des connecteurs par affaire</p>
          </div>
        </div>
        <button onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
          <Plus className="w-4 h-4" /> Nouveau chiffrage
        </button>
      </motion.div>

      {/* New chiffrage inline form */}
      {creating && (
        <motion.div
          variants={staggerItemVariants}
          className="rounded-[14px] p-4 space-y-3"
          style={{ background: 'var(--panel)', border: '1px solid var(--accent)', boxShadow: '0 0 0 1px var(--accent-soft)' }}
        >
          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Nouveau chiffrage</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { key: 'affaire', label: 'Affaire *', placeholder: 'ex : OP-25_EA1800-01_Ind A', autoFocus: true },
              { key: 'client', label: 'Client', placeholder: 'ex : Perciculture' },
              { key: 'reference_article', label: 'Référence article', placeholder: 'ex : KUPREEA1800-01AP' },
            ].map(({ key, label, placeholder, autoFocus }) => (
              <div key={key}>
                <DataLabel as="label" className="mb-1 block">{label}</DataLabel>
                <input autoFocus={autoFocus} type="text" value={newData[key]}
                  onChange={e => setNewData(d => ({ ...d, [key]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  className="w-full rounded-[10px] px-3 py-2 text-sm outline-none"
                  style={fieldStyle} placeholder={placeholder} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={handleCreate} disabled={saving || (!newData.affaire.trim() && !newData.reference_article.trim())}
              className="px-4 py-2 rounded-[10px] text-sm font-bold text-white disabled:opacity-50 transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
              {saving ? 'Création…' : 'Créer'}
            </button>
            <button onClick={() => { setCreating(false); setNewData({ affaire:'', client:'', reference_article:'' }); }}
              className="px-4 py-2 rounded-[10px] text-sm font-semibold transition-colors hover:bg-[var(--panel3)]"
              style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
              Annuler
            </button>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <motion.div variants={staggerItemVariants} className="relative max-w-[520px]">
        <Search className="absolute left-[13px] top-1/2 -translate-y-1/2 w-[15px] h-[15px] pointer-events-none" style={{ color: 'var(--text3)' }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par affaire, client, référence…"
          className="w-full pl-10 pr-4 py-[11px] rounded-[11px] text-[13px] outline-none transition-colors"
          style={fieldStyle} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text3)' }}>
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      <DataLabel>{loading ? 'Chargement…' : `${filtered.length} chiffrage(s)`}</DataLabel>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--text3)' }}>
          <PackageOpen className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {chiffrages.length === 0 ? 'Aucun chiffrage — créez le premier' : 'Aucun résultat'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}>
          {filtered.map((c) => {
            const total   = calcTotal(c.lignes);
            const status  = STATUS_CONFIG[c.status] || STATUS_CONFIG.brouillon;
            return (
              <motion.div
                key={c.id}
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
                {/* Card header */}
                <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid var(--border2)' }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <StatusBadge variant={status.variant}>{status.label}</StatusBadge>
                    <span className="font-display font-bold text-[19px]" style={{ color: 'var(--text)' }}>
                      {total > 0 ? `${total.toFixed(2)} €` : '—'}
                    </span>
                  </div>
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{c.affaire || c.titre || '—'}</p>
                  {c.client && <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>{c.client}</p>}
                  {c.reference_article && (
                    <p className="font-mono font-semibold text-xs mt-1" style={{ color: 'var(--accent)' }}>{c.reference_article}</p>
                  )}
                </div>
                {/* Card footer info */}
                <div className="px-4 py-2.5 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text3)' }}>
                    <Clock className="w-3.5 h-3.5" strokeWidth={1.8} />
                    {formatDate(c.updatedAt)}
                  </span>
                  <DataLabel>{(c.lignes || []).length} connecteur(s)</DataLabel>
                </div>
                {/* Actions */}
                <div className="flex gap-2 px-4 py-3" style={{ borderTop: '1px solid var(--border2)' }}>
                  <button onClick={() => navigate(`/industrialization/chiffrage/${c.id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-[8px] text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
                    <Pencil className="w-3.5 h-3.5" /> Ouvrir
                  </button>
                  <button onClick={() => handleDelete(c)}
                    className="w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                    style={{ color: 'var(--text3)' }}>
                    <Trash2 className="w-3.5 h-3.5" />
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

export default IndustrializationIndex;
