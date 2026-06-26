import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { suiviMoyenService } from '../../services/api';
import { Plus, Trash2, ChevronRight, Activity, User, Calendar } from 'lucide-react';

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR');
};

const statusCls = {
  actif:   'bg-emerald-100 text-emerald-700 border-emerald-200',
  archive: 'bg-slate-100 text-slate-500 border-slate-200',
};

const SuiviMoyensIndex = () => {
  const navigate = useNavigate();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating,setCreating]= useState(false);

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
    <div className="p-6 flex-1 overflow-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-sky-500" />
            Suivi des moyens
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Suivi création + réception des moyens — Département Industrialisation
          </p>
        </div>
        <button onClick={handleCreate} disabled={creating}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
          <Plus className="w-4 h-4" />
          {creating ? 'Création…' : 'Nouveau suivi'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Activity className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">Aucun suivi — créez le premier</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <div key={item.id}
              onClick={() => navigate(`/industrialization/suivi-moyens/${item.id}`)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-sky-500" />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCls[item.status] || statusCls.actif}`}>
                    {item.status === 'actif' ? 'Actif' : 'Archivé'}
                  </span>
                  <button onClick={e => handleDelete(item, e)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-800 leading-tight mb-1 line-clamp-2">{item.titre}</p>
              <div className="space-y-1 mt-2">
                {item.pilote && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <User className="w-3 h-3" /> {item.pilote}
                  </div>
                )}
                {item.date_debut && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" /> Début : {fmtDate(item.date_debut)}
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">Créé le {fmtDate(item.createdAt)}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuiviMoyensIndex;
