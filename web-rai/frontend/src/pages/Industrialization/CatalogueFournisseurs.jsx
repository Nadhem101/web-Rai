import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fournisseurCatalogueService } from '../../services/api';
import { Plus, Pencil, Trash2, Search, XCircle, Truck, Check, AlertCircle } from 'lucide-react';
import DataLabel from '../../components/ui/DataLabel.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

const fieldCls  = 'w-full rounded-[10px] px-3 py-2 text-sm outline-none transition-colors';
const fieldStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };
const labelCls  = 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]';

const EMPTY = { nom: '', site_web: '', notes: '' };

const CatalogueFournisseurs = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [editingId,    setEditingId]    = useState(null);
  const [form,         setForm]         = useState(EMPTY);
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState('');

  const load = async () => {
    setLoading(true);
    try { setFournisseurs(await fournisseurCatalogueService.getAll()); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = fournisseurs.filter(f =>
    f.nom?.toLowerCase().includes(search.toLowerCase()) ||
    f.site_web?.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (f = null) => {
    setError('');
    setEditingId(f ? f.id : 'new');
    setForm(f ? { nom: f.nom || '', site_web: f.site_web || '', notes: f.notes || '' } : EMPTY);
  };

  const cancel = () => { setEditingId(null); setForm(EMPTY); setError(''); };

  const save = async () => {
    if (!form.nom.trim()) { setError('Le nom du fournisseur est obligatoire.'); return; }
    setSaving(true); setError('');
    try {
      if (editingId === 'new') await fournisseurCatalogueService.create(form);
      else                     await fournisseurCatalogueService.update(editingId, form);
      await load(); cancel();
    } catch (err) { setError(err?.response?.data?.message || err.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const remove = async (f) => {
    if (!window.confirm(`Supprimer "${f.nom}" ?`)) return;
    try { await fournisseurCatalogueService.delete(f.id); load(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="px-[26px] pt-6 pb-10 flex-1 overflow-auto space-y-[18px]" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <motion.div variants={staggerItemVariants} className="flex flex-wrap items-end justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <Truck className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Catalogue fournisseurs</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>{fournisseurs.length} fournisseur(s) enregistré(s)</p>
          </div>
        </div>
        <button onClick={() => openEdit()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
          <Plus className="w-4 h-4" /> Nouveau fournisseur
        </button>
      </motion.div>

      {/* Edit form */}
      {editingId && (
        <motion.div variants={staggerItemVariants} className="rounded-[14px] p-5 space-y-4"
          style={{ background: 'var(--panel)', border: '1px solid var(--accent)', boxShadow: '0 0 0 1px var(--accent-soft)' }}>
          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{editingId === 'new' ? 'Nouveau fournisseur' : 'Modifier'}</p>
          {error && (
            <div className="flex items-center gap-2 rounded-[10px] px-4 py-2 text-sm"
              style={{ border: '1px solid var(--crit)', background: 'var(--crit-soft)', color: 'var(--crit)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { key: 'nom', label: 'Nom *', placeholder: 'ex : Mouser Electronics', type: 'text', auto: true },
              { key: 'site_web', label: 'Site web', placeholder: 'https://mouser.fr', type: 'url' },
              { key: 'notes', label: 'Notes', placeholder: 'Commentaire…', type: 'text' },
            ].map(({ key, label, placeholder, type, auto }) => (
              <label key={key} className="block">
                <span className={labelCls} style={{ color: 'var(--text3)' }}>{label}</span>
                <input type={type} value={form[key]} autoFocus={auto}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className={fieldCls} style={fieldStyle} placeholder={placeholder} />
              </label>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-bold text-white disabled:opacity-50 transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
              <Check className="w-4 h-4" />{saving ? 'Sauvegarde…' : 'Enregistrer'}
            </button>
            <button onClick={cancel}
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
          placeholder="Rechercher un fournisseur…"
          className="w-full pl-10 pr-4 py-[11px] rounded-[11px] text-[13px] outline-none transition-colors"
          style={fieldStyle} />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text3)' }}><XCircle className="w-4 h-4" /></button>}
      </motion.div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : (
        <motion.div variants={staggerItemVariants} className="rounded-[14px] overflow-hidden"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                {['Nom','Site web','Notes','Actions'].map(h => (
                  <th key={h} className={`px-4 py-3 text-left ${h==='Actions'?'text-center':''}`}><DataLabel>{h}</DataLabel></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center text-sm" style={{ color: 'var(--text3)' }}>
                  {fournisseurs.length === 0 ? 'Aucun fournisseur — ajoutez le premier' : 'Aucun résultat'}
                </td></tr>
              ) : filtered.map(f => (
                <tr key={f.id} className="transition-colors hover:bg-[var(--panel2)]" style={{ borderBottom: '1px solid var(--border2)' }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text)' }}>{f.nom}</td>
                  <td className="px-4 py-3">
                    {f.site_web
                      ? <a href={f.site_web} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>{f.site_web}</a>
                      : <span style={{ color: 'var(--border)' }}>—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text3)' }}>{f.notes || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(f)} title="Modifier"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                        style={{ color: 'var(--text3)' }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(f)} title="Supprimer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                        style={{ color: 'var(--text3)' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default CatalogueFournisseurs;
