import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { connecteurCatalogueService, fournisseurCatalogueService } from '../../services/api';
import {
  Plus, Pencil, Trash2, Search, XCircle, Link2,
  Check, X, AlertCircle, Image,
} from 'lucide-react';
import DataLabel from '../../components/ui/DataLabel.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

const fieldCls  = 'w-full rounded-[10px] px-3 py-2 text-sm outline-none transition-colors';
const fieldStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };
const labelCls  = 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]';
const cellCls   = 'w-full rounded-[8px] px-2 py-1.5 text-xs outline-none';

const EMPTY_APPRO  = () => ({ fournisseur: '', ref_fournisseur: '', prix_unitaire: '', prioritaire: false });
const EMPTY_FORM   = () => ({
  ref_connecteur: '', designation: '', ref_contrepartie: '', photo_url: '', notes: '',
  approvisionnements_conn: [], approvisionnements_cp: [], solution_interne: '',
});

// ── Supply rows editor ─────────────────────────────────────
const ApproRows = ({ rows, onChange, fournisseurs }) => {
  const addRow    = () => onChange([...rows, EMPTY_APPRO()]);
  const removeRow = (i) => onChange(rows.filter((_, idx) => idx !== i));
  const updateRow = (i, field, value) => onChange(rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));

  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="grid gap-2 items-center rounded-[10px] p-2"
          style={{ gridTemplateColumns: '2fr 2fr 1fr auto auto', background: 'var(--panel)', border: '1px solid var(--border2)' }}>
          <div>
            <input type="text" value={r.fournisseur} list={`fours-${i}`}
              onChange={e => updateRow(i,'fournisseur',e.target.value)}
              className={cellCls} style={fieldStyle} placeholder="Fournisseur" />
            <datalist id={`fours-${i}`}>
              {fournisseurs.map(f => <option key={f.id} value={f.nom} />)}
            </datalist>
          </div>
          <input type="text" value={r.ref_fournisseur}
            onChange={e => updateRow(i,'ref_fournisseur',e.target.value)}
            className={cellCls} style={fieldStyle} placeholder="Réf. fournisseur" />
          <input type="number" min="0" step="0.01" value={r.prix_unitaire}
            onChange={e => updateRow(i,'prix_unitaire',e.target.value)}
            className={cellCls + ' text-right'} style={fieldStyle} placeholder="0.00 €" />
          <label className="flex items-center gap-1 cursor-pointer" title="Prioritaire">
            <input type="checkbox" checked={r.prioritaire}
              onChange={e => updateRow(i,'prioritaire',e.target.checked)}
              className="rounded" style={{ accentColor: 'var(--accent)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text3)' }}>Prio.</span>
          </label>
          <button type="button" onClick={() => removeRow(i)}
            className="w-6 h-6 flex items-center justify-center transition-colors hover:text-[var(--crit)]"
            style={{ color: 'var(--text3)' }}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow}
        className="w-full py-1.5 rounded-[8px] text-xs font-semibold transition-colors"
        style={{ border: '1px dashed var(--border)', color: 'var(--text3)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text3)'; }}>
        + Ajouter un fournisseur
      </button>
    </div>
  );
};

// ── Main ───────────────────────────────────────────────────
const CatalogueConnecteurs = () => {
  const [connecteurs,   setConnecteurs]   = useState([]);
  const [fournisseurs,  setFournisseurs]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [editingId,     setEditingId]     = useState(null);
  const [form,          setForm]          = useState(EMPTY_FORM());
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState('');
  const [uploading,     setUploading]     = useState(false);
  const photoRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const [c, f] = await Promise.all([
        connecteurCatalogueService.getAll(),
        fournisseurCatalogueService.getAll(),
      ]);
      setConnecteurs(Array.isArray(c) ? c : []);
      setFournisseurs(Array.isArray(f) ? f : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = connecteurs.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (c.ref_connecteur||'').toLowerCase().includes(q) ||
           (c.designation||'').toLowerCase().includes(q) ||
           (c.ref_contrepartie||'').toLowerCase().includes(q);
  });

  const openEdit = (c = null) => {
    setError('');
    setEditingId(c ? c.id : 'new');
    setForm(c ? {
      ref_connecteur:          c.ref_connecteur          || '',
      designation:             c.designation             || '',
      ref_contrepartie:        c.ref_contrepartie        || '',
      photo_url:               c.photo_url               || '',
      notes:                   c.notes                   || '',
      approvisionnements_conn: [...(c.approvisionnements_conn || [])],
      approvisionnements_cp:   [...(c.approvisionnements_cp   || [])],
      solution_interne:        c.solution_interne         || '',
    } : EMPTY_FORM());
  };
  const cancel = () => { setEditingId(null); setForm(EMPTY_FORM()); setError(''); };

  const save = async () => {
    if (!form.ref_connecteur.trim()) { setError('La référence connecteur est obligatoire.'); return; }
    setSaving(true); setError('');
    try {
      if (editingId === 'new') await connecteurCatalogueService.create(form);
      else                     await connecteurCatalogueService.update(editingId, form);
      await load(); cancel();
    } catch (err) { setError(err?.response?.data?.message || err.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const remove = async (c) => {
    if (!window.confirm(`Supprimer "${c.ref_connecteur}" ?`)) return;
    try { await connecteurCatalogueService.delete(c.id); load(); }
    catch (err) { console.error(err); }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) { alert('Supabase non configuré.'); return; }
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const fileName = `catalogue/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
      const { data, error } = await supabase.storage.from('flowchart-media').upload(fileName, file, { upsert: false });
      if (error) { alert('Erreur upload : ' + error.message); return; }
      const { data: { publicUrl } } = supabase.storage.from('flowchart-media').getPublicUrl(data.path);
      setForm(f => ({ ...f, photo_url: publicUrl }));
    } finally { setUploading(false); e.target.value = ''; }
  };

  return (
    <div className="flex-1 overflow-auto px-[26px] pt-6 pb-10 space-y-[18px]" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <motion.div variants={staggerItemVariants} className="flex flex-wrap items-end justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <Link2 className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Catalogue connecteurs</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>{connecteurs.length} connecteur(s) — avec fournisseurs et contre-parties</p>
          </div>
        </div>
        <button onClick={() => openEdit()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
          <Plus className="w-4 h-4" /> Nouveau connecteur
        </button>
      </motion.div>

      {/* Edit form */}
      {editingId && (
        <motion.div
          variants={staggerItemVariants}
          className="rounded-[14px] p-5 space-y-5"
          style={{ background: 'var(--panel)', border: '1px solid var(--accent)', boxShadow: '0 0 0 1px var(--accent-soft)' }}
        >
          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{editingId === 'new' ? 'Nouveau connecteur' : 'Modifier'}</p>
          {error && (
            <div className="flex items-center gap-2 rounded-[10px] px-4 py-2 text-sm"
              style={{ border: '1px solid var(--crit)', background: 'var(--crit-soft)', color: 'var(--crit)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {/* Identity */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className={labelCls} style={{ color: 'var(--text3)' }}>Réf. connecteur <span style={{ color: 'var(--crit)' }}>*</span></span>
              <input type="text" value={form.ref_connecteur} onChange={e => setForm(f => ({ ...f, ref_connecteur: e.target.value }))}
                className={fieldCls} style={fieldStyle} placeholder="ex : 368376-1" autoFocus />
            </label>
            <label className="block">
              <span className={labelCls} style={{ color: 'var(--text3)' }}>Désignation</span>
              <input type="text" value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                className={fieldCls} style={fieldStyle} placeholder="CONN HSG 81PTS" />
            </label>
            <label className="block">
              <span className={labelCls} style={{ color: 'var(--text3)' }}>Réf. contre-partie</span>
              <input type="text" value={form.ref_contrepartie} onChange={e => setForm(f => ({ ...f, ref_contrepartie: e.target.value }))}
                className={fieldCls} style={fieldStyle} placeholder="368146-1" />
            </label>
            <div>
              <span className={labelCls} style={{ color: 'var(--text3)' }}>Photo contrepartie</span>
              {form.photo_url ? (
                <div className="flex items-center gap-2">
                  <img src={form.photo_url} alt="" className="h-10 w-10 object-contain rounded" style={{ border: '1px solid var(--border)' }} />
                  <button type="button" onClick={() => photoRef.current?.click()} className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>
                    {uploading ? 'Upload…' : 'Changer'}
                  </button>
                  <button type="button" onClick={() => setForm(f => ({ ...f, photo_url: '' }))} className="text-xs hover:underline" style={{ color: 'var(--crit)' }}>Retirer</button>
                </div>
              ) : (
                <button type="button" onClick={() => photoRef.current?.click()} disabled={uploading}
                  className="w-full py-2 rounded-[10px] text-xs disabled:opacity-50 transition-colors"
                  style={{ border: '2px dashed var(--border)', color: 'var(--text3)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text3)'; }}>
                  {uploading ? '⏳ Upload…' : <><Image className="w-4 h-4 inline mr-1" />Uploader une photo</>}
                </button>
              )}
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
            </div>
          </div>

          {/* Supply sections */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[10px] p-4 space-y-2" style={{ border: '1px solid var(--border)', background: 'var(--panel2)' }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Approvisionnement — Connecteur</p>
              <p className="text-[11px]" style={{ color: 'var(--text3)' }}>Qui fournit le connecteur (côté table de test) ?</p>
              <ApproRows rows={form.approvisionnements_conn} onChange={rows => setForm(f => ({ ...f, approvisionnements_conn: rows }))} fournisseurs={fournisseurs} />
            </div>
            <div className="rounded-[10px] p-4 space-y-2" style={{ border: '1px solid var(--border)', background: 'var(--panel2)' }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--info)' }}>Approvisionnement — Contre-partie</p>
              <p className="text-[11px]" style={{ color: 'var(--text3)' }}>Qui fournit la contre-partie (côté faisceau) ?</p>
              <ApproRows rows={form.approvisionnements_cp} onChange={rows => setForm(f => ({ ...f, approvisionnements_cp: rows }))} fournisseurs={fournisseurs} />
            </div>
          </div>

          <label className="block">
            <span className={labelCls} style={{ color: 'var(--text3)' }}>Solution interne <span className="normal-case font-normal" style={{ color: 'var(--text3)' }}>(si aucun fournisseur externe)</span></span>
            <input type="text" value={form.solution_interne} onChange={e => setForm(f => ({ ...f, solution_interne: e.target.value }))}
              className={fieldCls} style={fieldStyle} placeholder="ex : Impression 3D, Usinage interne, Fabrication atelier…" />
          </label>

          <label className="block">
            <span className={labelCls} style={{ color: 'var(--text3)' }}>Notes</span>
            <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className={fieldCls} style={fieldStyle} placeholder="Remarques…" />
          </label>

          <div className="flex gap-2 justify-end">
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-bold text-white disabled:opacity-50 transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
              <Check className="w-4 h-4" />{saving ? 'Sauvegarde…' : 'Enregistrer'}
            </button>
            <button onClick={cancel}
              className="px-4 py-2 rounded-[10px] text-sm font-semibold transition-colors hover:bg-[var(--panel3)]"
              style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>Annuler</button>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <motion.div variants={staggerItemVariants} className="relative max-w-[520px]">
        <Search className="absolute left-[13px] top-1/2 -translate-y-1/2 w-[15px] h-[15px] pointer-events-none" style={{ color: 'var(--text3)' }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par référence, désignation, contre-partie…"
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
        <motion.div
          variants={staggerItemVariants}
          className="rounded-[14px] overflow-hidden"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                  {['Photo','Réf. Connecteur','Désignation','Contre-partie','Fourn. Conn.','Fourn. CP','Solution interne','Actions'].map(h => (
                    <th key={h} className="px-3.5 py-2.5 text-left whitespace-nowrap"><DataLabel>{h}</DataLabel></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="py-10 text-center text-sm" style={{ color: 'var(--text3)' }}>
                    {connecteurs.length === 0 ? 'Aucun connecteur — ajoutez le premier' : 'Aucun résultat'}
                  </td></tr>
                ) : filtered.map(c => {
                  const mainConn = c.approvisionnements_conn?.find(a => a.prioritaire) || c.approvisionnements_conn?.[0];
                  const mainCp   = c.approvisionnements_cp?.find(a => a.prioritaire)   || c.approvisionnements_cp?.[0];
                  return (
                    <tr key={c.id} className="transition-colors hover:bg-[var(--panel2)]" style={{ borderBottom: '1px solid var(--border2)' }}>
                      <td className="px-3.5 py-2.5 text-center">
                        {c.photo_url
                          ? <img src={c.photo_url} alt="" className="h-10 w-10 object-contain mx-auto rounded" />
                          : <span style={{ color: 'var(--border)' }}>—</span>}
                      </td>
                      <td className="px-3.5 py-2.5 font-mono font-bold" style={{ color: 'var(--accent)' }}>{c.ref_connecteur}</td>
                      <td className="px-3.5 py-2.5" style={{ color: 'var(--text2)' }}>{c.designation || '—'}</td>
                      <td className="px-3.5 py-2.5 font-mono text-xs" style={{ color: 'var(--text3)' }}>{c.ref_contrepartie || '—'}</td>
                      <td className="px-3.5 py-2.5 text-xs" style={{ color: 'var(--text2)' }}>
                        {mainConn ? (
                          <div>
                            <p className="font-semibold">{mainConn.fournisseur}</p>
                            <p style={{ color: 'var(--text3)' }}>{mainConn.ref_fournisseur}</p>
                            {mainConn.prix_unitaire && <p className="font-semibold" style={{ color: 'var(--ok)' }}>{Number(mainConn.prix_unitaire).toFixed(2)} €</p>}
                            {(c.approvisionnements_conn||[]).length > 1 && <p style={{ color: 'var(--text3)' }}>+{c.approvisionnements_conn.length - 1} autre(s)</p>}
                          </div>
                        ) : <span style={{ color: 'var(--border)' }}>—</span>}
                      </td>
                      <td className="px-3.5 py-2.5 text-xs" style={{ color: 'var(--text2)' }}>
                        {mainCp ? (
                          <div>
                            <p className="font-semibold">{mainCp.fournisseur}</p>
                            <p style={{ color: 'var(--text3)' }}>{mainCp.ref_fournisseur}</p>
                            {mainCp.prix_unitaire && <p className="font-semibold" style={{ color: 'var(--ok)' }}>{Number(mainCp.prix_unitaire).toFixed(2)} €</p>}
                            {(c.approvisionnements_cp||[]).length > 1 && <p style={{ color: 'var(--text3)' }}>+{c.approvisionnements_cp.length - 1} autre(s)</p>}
                          </div>
                        ) : <span style={{ color: 'var(--border)' }}>—</span>}
                      </td>
                      <td className="px-3.5 py-2.5 text-xs font-medium" style={{ color: 'var(--warn)' }}>{c.solution_interne || '—'}</td>
                      <td className="px-3.5 py-2.5">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openEdit(c)} title="Modifier"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                            style={{ color: 'var(--text3)' }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => remove(c)} title="Supprimer"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                            style={{ color: 'var(--text3)' }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CatalogueConnecteurs;
