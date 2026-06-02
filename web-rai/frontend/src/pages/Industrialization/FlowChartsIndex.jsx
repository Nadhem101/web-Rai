import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { flowchartService } from '../../services/api';
import {
  Plus, GitBranch, Pencil, Trash2, Eye,
  Search, XCircle, PackageOpen, Clock,
} from 'lucide-react';

const statusBadge = (status) =>
  status === 'published'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-amber-50 text-amber-700 border-amber-200';

const formatDate = (v) => {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = flowcharts.filter(fc =>
    fc.title?.toLowerCase().includes(search.toLowerCase()) ||
    fc.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    const title = newTitle.trim() || 'Nouveau flow chart';
    try {
      const fc = await flowchartService.create({ title, steps: [] });
      navigate(`/industrialization/flow-chart/${fc.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (fc) => {
    if (!window.confirm(`Supprimer "${fc.title}" ?`)) return;
    try {
      await flowchartService.delete(fc.id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <GitBranch className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Flow Charts</h1>
            <p className="text-xs text-slate-400 mt-0.5">Guides visuels opératoires pour les opérateurs</p>
          </div>
        </div>
        <button onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
          <Plus className="w-4 h-4" />
          Nouveau flow chart
        </button>
      </div>

      {/* New flowchart inline form */}
      {creating && (
        <div className="bg-white rounded-xl border border-sky-200 p-4 flex items-center gap-3 shadow-sm">
          <GitBranch className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false); }}
            placeholder="Nom du flow chart (ex : Sertissage faisceau VENTA)"
            className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder-slate-400"
          />
          <button onClick={handleCreate}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-colors">
            Créer
          </button>
          <button onClick={() => setCreating(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un flow chart…"
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-slate-400 font-medium">
        {loading ? 'Chargement…' : `${filtered.length} flow chart(s)`}
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
            {flowcharts.length === 0 ? 'Aucun flow chart — créez le premier' : 'Aucun flow chart trouvé'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(fc => (
            <div key={fc.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* Card header */}
              <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-100">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadge(fc.status)}`}>
                      {fc.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 truncate">{fc.title}</h3>
                  {fc.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{fc.description}</p>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="px-5 py-3 flex items-center gap-4 text-xs text-slate-400 flex-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(fc.updatedAt)}
                </span>
              </div>

              {/* Card actions */}
              <div className="flex gap-2 px-5 py-3 border-t border-slate-100">
                <button onClick={() => navigate(`/industrialization/flow-chart/${fc.id}/view`)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  Voir
                </button>
                <button onClick={() => navigate(`/industrialization/flow-chart/${fc.id}`)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
                  <Pencil className="w-3.5 h-3.5" />
                  Éditer
                </button>
                <button onClick={() => handleDelete(fc)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlowChartsIndex;
