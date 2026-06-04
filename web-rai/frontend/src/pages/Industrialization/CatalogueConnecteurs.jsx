import React, { useEffect, useRef, useState } from 'react';
import { connecteurCatalogueService, fournisseurCatalogueService } from '../../services/api';
import {
  Plus, Pencil, Trash2, Search, XCircle, Link2,
  Check, X, AlertCircle, Image, Upload,
} from 'lucide-react';

const fieldCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors';
const labelCls = 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500';
const cellCls  = 'w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-100';

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
        <div key={i} className="grid gap-2 items-center bg-white rounded-lg border border-slate-200 p-2"
          style={{ gridTemplateColumns: '2fr 2fr 1fr auto auto' }}>
          <div>
            <input type="text" value={r.fournisseur} list={`fours-${i}`}
              onChange={e => updateRow(i,'fournisseur',e.target.value)}
              className={cellCls} placeholder="Fournisseur" />
            <datalist id={`fours-${i}`}>
              {fournisseurs.map(f => <option key={f.id} value={f.nom} />)}
            </datalist>
          </div>
          <input type="text" value={r.ref_fournisseur}
            onChange={e => updateRow(i,'ref_fournisseur',e.target.value)}
            className={cellCls} placeholder="Réf. fournisseur" />
          <input type="number" min="0" step="0.01" value={r.prix_unitaire}
            onChange={e => updateRow(i,'prix_unitaire',e.target.value)}
            className={cellCls + ' text-right'} placeholder="0.00 €" />
          <label className="flex items-center gap-1 cursor-pointer" title="Prioritaire">
            <input type="checkbox" checked={r.prioritaire}
              onChange={e => updateRow(i,'prioritaire',e.target.checked)}
              className="rounded border-slate-300 text-sky-500" />
            <span className="text-[10px] text-slate-500">Prio.</span>
          </label>
          <button type="button" onClick={() => removeRow(i)}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow}
        className="w-full py-1.5 rounded-lg border border-dashed border-slate-300 text-xs font-semibold text-slate-500 hover:border-sky-400 hover:text-sky-600 transition-colors">
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
    <div className="flex-1 overflow-auto p-6 space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Link2 className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Catalogue connecteurs</h1>
            <p className="text-xs text-slate-400 mt-0.5">{connecteurs.length} connecteur(s) — avec fournisseurs et contre-parties</p>
          </div>
        </div>
        <button onClick={() => openEdit()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
          <Plus className="w-4 h-4" /> Nouveau connecteur
        </button>
      </div>

      {/* Edit form */}
      {editingId && (
        <div className="bg-white rounded-xl border border-sky-200 p-5 shadow-sm space-y-5">
          <p className="text-sm font-bold text-slate-700">{editingId === 'new' ? 'Nouveau connecteur' : 'Modifier'}</p>
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {/* Identity */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className={labelCls}>Réf. connecteur <span className="text-red-400">*</span></span>
              <input type="text" value={form.ref_connecteur} onChange={e => setForm(f => ({ ...f, ref_connecteur: e.target.value }))}
                className={fieldCls} placeholder="ex : 368376-1" autoFocus />
            </label>
            <label className="block">
              <span className={labelCls}>Désignation</span>
              <input type="text" value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                className={fieldCls} placeholder="CONN HSG 81PTS" />
            </label>
            <label className="block">
              <span className={labelCls}>Réf. contre-partie</span>
              <input type="text" value={form.ref_contrepartie} onChange={e => setForm(f => ({ ...f, ref_contrepartie: e.target.value }))}
                className={fieldCls} placeholder="368146-1" />
            </label>
            <div>
              <span className={labelCls}>Photo contrepartie</span>
              {form.photo_url ? (
                <div className="flex items-center gap-2">
                  <img src={form.photo_url} alt="" className="h-10 w-10 object-contain rounded border border-slate-200" />
                  <button type="button" onClick={() => photoRef.current?.click()}
                    className="text-xs text-sky-600 hover:underline">{uploading ? 'Upload…' : 'Changer'}</button>
                  <button type="button" onClick={() => setForm(f => ({ ...f, photo_url: '' }))}
                    className="text-xs text-red-500 hover:underline">Retirer</button>
                </div>
              ) : (
                <button type="button" onClick={() => photoRef.current?.click()} disabled={uploading}
                  className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 text-xs text-slate-400 hover:border-sky-400 hover:text-sky-600 transition-colors disabled:opacity-50">
                  {uploading ? '⏳ Upload…' : <><Image className="w-4 h-4 inline mr-1" />Uploader une photo</>}
                </button>
              )}
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
            </div>
          </div>

          {/* Supply sections */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-700">Approvisionnement — Connecteur</p>
              <p className="text-[11px] text-slate-500">Qui fournit le connecteur (côté table de test) ?</p>
              <ApproRows
                rows={form.approvisionnements_conn}
                onChange={rows => setForm(f => ({ ...f, approvisionnements_conn: rows }))}
                fournisseurs={fournisseurs}
              />
            </div>
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Approvisionnement — Contre-partie</p>
              <p className="text-[11px] text-slate-500">Qui fournit la contre-partie (côté faisceau) ?</p>
              <ApproRows
                rows={form.approvisionnements_cp}
                onChange={rows => setForm(f => ({ ...f, approvisionnements_cp: rows }))}
                fournisseurs={fournisseurs}
              />
            </div>
          </div>

          {/* Solution interne */}
          <label className="block">
            <span className={labelCls}>Solution interne <span className="text-slate-400 normal-case font-normal">(si aucun fournisseur externe)</span></span>
            <input type="text" value={form.solution_interne} onChange={e => setForm(f => ({ ...f, solution_interne: e.target.value }))}
              className={fieldCls} placeholder="ex : Impression 3D, Usinage interne, Fabrication atelier…" />
          </label>

          <label className="block">
            <span className={labelCls}>Notes</span>
            <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className={fieldCls} placeholder="Remarques…" />
          </label>

          <div className="flex gap-2 justify-end">
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
              <Check className="w-4 h-4" />{saving ? 'Sauvegarde…' : 'Enregistrer'}
            </button>
            <button onClick={cancel}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Annuler</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par référence, désignation, contre-partie…"
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><XCircle className="w-4 h-4" /></button>}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Photo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Réf. Connecteur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Désignation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Contre-partie</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Fourn. Conn.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Fourn. CP</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Solution interne</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-10 text-center text-sm text-slate-400">
                  {connecteurs.length === 0 ? 'Aucun connecteur — ajoutez le premier' : 'Aucun résultat'}
                </td></tr>
              ) : filtered.map(c => {
                const mainConn = c.approvisionnements_conn?.find(a => a.prioritaire) || c.approvisionnements_conn?.[0];
                const mainCp   = c.approvisionnements_cp?.find(a => a.prioritaire)   || c.approvisionnements_cp?.[0];
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-center">
                      {c.photo_url
                        ? <img src={c.photo_url} alt="" className="h-10 w-10 object-contain mx-auto rounded" />
                        : <span className="text-slate-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-indigo-700">{c.ref_connecteur}</td>
                    <td className="px-4 py-3 text-slate-700">{c.designation || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.ref_contrepartie || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {mainConn ? (
                        <div>
                          <p className="font-semibold">{mainConn.fournisseur}</p>
                          <p className="text-slate-400">{mainConn.ref_fournisseur}</p>
                          {mainConn.prix_unitaire && <p className="text-emerald-600 font-semibold">{Number(mainConn.prix_unitaire).toFixed(2)} €</p>}
                          {(c.approvisionnements_conn||[]).length > 1 && <p className="text-slate-400">+{c.approvisionnements_conn.length - 1} autre(s)</p>}
                        </div>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {mainCp ? (
                        <div>
                          <p className="font-semibold">{mainCp.fournisseur}</p>
                          <p className="text-slate-400">{mainCp.ref_fournisseur}</p>
                          {mainCp.prix_unitaire && <p className="text-emerald-600 font-semibold">{Number(mainCp.prix_unitaire).toFixed(2)} €</p>}
                          {(c.approvisionnements_cp||[]).length > 1 && <p className="text-slate-400">+{c.approvisionnements_cp.length - 1} autre(s)</p>}
                        </div>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-amber-700 font-medium">{c.solution_interne || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(c)} title="Modifier"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => remove(c)} title="Supprimer"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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
      )}
    </div>
  );
};

export default CatalogueConnecteurs;
