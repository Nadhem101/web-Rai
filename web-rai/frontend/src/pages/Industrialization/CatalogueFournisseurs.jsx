import React, { useEffect, useState } from 'react';
import { fournisseurCatalogueService } from '../../services/api';
import { Plus, Pencil, Trash2, Search, XCircle, Truck, Check, X, AlertCircle } from 'lucide-react';

const fieldCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors';
const labelCls = 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500';

const EMPTY = { nom: '', site_web: '', notes: '' };

const CatalogueFournisseurs = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [editingId,    setEditingId]    = useState(null); // null=none, 'new'=new form
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
    <div className="flex-1 overflow-auto p-6 space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Catalogue fournisseurs</h1>
            <p className="text-xs text-slate-400 mt-0.5">{fournisseurs.length} fournisseur(s) enregistré(s)</p>
          </div>
        </div>
        <button onClick={() => openEdit()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
          <Plus className="w-4 h-4" /> Nouveau fournisseur
        </button>
      </div>

      {/* Inline new/edit form */}
      {editingId && (
        <div className="bg-white rounded-xl border border-sky-200 p-5 shadow-sm space-y-4">
          <p className="text-sm font-bold text-slate-700">{editingId === 'new' ? 'Nouveau fournisseur' : 'Modifier'}</p>
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className={labelCls}>Nom <span className="text-red-400">*</span></span>
              <input type="text" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                className={fieldCls} placeholder="ex : Mouser Electronics" autoFocus />
            </label>
            <label className="block">
              <span className={labelCls}>Site web</span>
              <input type="url" value={form.site_web} onChange={e => setForm(f => ({ ...f, site_web: e.target.value }))}
                className={fieldCls} placeholder="https://mouser.fr" />
            </label>
            <label className="block">
              <span className={labelCls}>Notes</span>
              <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className={fieldCls} placeholder="Commentaire…" />
            </label>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
              <Check className="w-4 h-4" />{saving ? 'Sauvegarde…' : 'Enregistrer'}
            </button>
            <button onClick={cancel}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un fournisseur…"
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Site web</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Notes</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center text-sm text-slate-400">
                  {fournisseurs.length === 0 ? 'Aucun fournisseur — ajoutez le premier' : 'Aucun résultat'}
                </td></tr>
              ) : filtered.map(f => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800">{f.nom}</td>
                  <td className="px-4 py-3">
                    {f.site_web
                      ? <a href={f.site_web} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline text-xs">{f.site_web}</a>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{f.notes || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(f)} title="Modifier"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(f)} title="Supprimer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CatalogueFournisseurs;
