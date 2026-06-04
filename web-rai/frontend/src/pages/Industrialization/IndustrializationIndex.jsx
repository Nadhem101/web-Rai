import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chiffrageService } from '../../services/api';
import {
  Plus, Search, XCircle, Pencil, Trash2,
  Factory, Clock, FileText, PackageOpen,
} from 'lucide-react';

const STATUS_CONFIG = {
  brouillon:  { label: 'Brouillon',  cls: 'bg-slate-100 text-slate-600 border-slate-200'   },
  en_cours:   { label: 'En cours',   cls: 'bg-sky-50 text-sky-700 border-sky-200'          },
  valide:     { label: 'Validé',     cls: 'bg-emerald-50 text-emerald-700 border-emerald-200'},
  archive:    { label: 'Archivé',    cls: 'bg-slate-100 text-slate-400 border-slate-200'   },
};

const formatDate = (v) => v ? new Date(v).toLocaleDateString('fr-FR') : '—';

const calcTotal = (lignes = []) =>
  lignes.reduce((s, l) => s + Number(l.quantite || 0) * Number(l.prix_unitaire || 0), 0);

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
    try {
      await chiffrageService.delete(c.id);
      load();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Factory className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Chiffrage Table de Test</h1>
            <p className="text-xs text-slate-400 mt-0.5">Costing des connecteurs par affaire</p>
          </div>
        </div>
        <button onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
          <Plus className="w-4 h-4" /> Nouveau chiffrage
        </button>
      </div>

      {/* New chiffrage form */}
      {creating && (
        <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm space-y-3">
          <p className="text-sm font-bold text-slate-700">Nouveau chiffrage</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Affaire *</label>
              <input autoFocus type="text" value={newData.affaire}
                onChange={e => setNewData(d => ({ ...d, affaire: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-400"
                placeholder="ex : OP-25_EA1800-01_Ind A" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Client</label>
              <input type="text" value={newData.client}
                onChange={e => setNewData(d => ({ ...d, client: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-400"
                placeholder="ex : Perciculture" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Référence article</label>
              <input type="text" value={newData.reference_article}
                onChange={e => setNewData(d => ({ ...d, reference_article: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-400"
                placeholder="ex : KUPREEA1800-01AP" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={handleCreate} disabled={saving || (!newData.affaire.trim() && !newData.reference_article.trim())}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
              {saving ? 'Création…' : 'Créer'}
            </button>
            <button onClick={() => { setCreating(false); setNewData({ affaire:'', client:'', reference_article:'' }); }}
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
          placeholder="Rechercher par affaire, client, référence…"
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-slate-400 font-medium">
        {loading ? 'Chargement…' : `${filtered.length} chiffrage(s)`}
      </p>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <PackageOpen className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {chiffrages.length === 0 ? 'Aucun chiffrage — créez le premier' : 'Aucun résultat'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(c => {
            const total    = calcTotal(c.lignes);
            const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.brouillon;
            return (
              <div key={c.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                {/* Card header */}
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusCfg.cls}`}>
                      {statusCfg.label}
                    </span>
                    <span className="text-lg font-bold text-slate-800">{total > 0 ? `${total.toFixed(2)} €` : '—'}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 truncate">{c.affaire || c.titre || '—'}</p>
                  {c.client && <p className="text-xs text-slate-500 mt-0.5">{c.client}</p>}
                  {c.reference_article && (
                    <p className="text-xs font-mono font-semibold text-sky-600 mt-1">{c.reference_article}</p>
                  )}
                </div>
                {/* Card footer */}
                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(c.updatedAt)}
                  </span>
                  <span className="text-xs text-slate-400">{(c.lignes || []).length} connecteur(s)</span>
                </div>
                {/* Actions */}
                <div className="flex gap-2 px-5 py-3 border-t border-slate-100">
                  <button onClick={() => navigate(`/industrialization/chiffrage/${c.id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
                    <Pencil className="w-3.5 h-3.5" /> Ouvrir
                  </button>
                  <button onClick={() => handleDelete(c)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IndustrializationIndex;
