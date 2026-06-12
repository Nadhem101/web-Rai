import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, User, Check, AlertCircle, RefreshCw } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ROLES = [
  { value: 'admin',       label: 'Admin',       desc: 'Accès complet',                               cls: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'maintenance', label: 'Maintenance',  desc: 'Inventaire + Maintenance + ECME',              cls: 'bg-sky-100 text-sky-700 border-sky-200'          },
  { value: 'indus',       label: 'Industrialisation', desc: 'Inventaire + Industrialisation',          cls: 'bg-amber-100 text-amber-700 border-amber-200'    },
];

const roleCls = (r) => ROLES.find(x => x.value === r)?.cls || ROLES[0].cls;
const roleLabel = (r) => ROLES.find(x => x.value === r)?.label || r;

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const AdminUsers = () => {
  const { session, role: myRole } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState({}); // userId → true/false
  const [saved,   setSaved]   = useState({}); // userId → true/false

  const authHeader = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token || ''}`,
  });

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/user-profiles`, { headers: authHeader() });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `Erreur ${res.status}`);
      }
      setUsers(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    setSaving(p => ({ ...p, [userId]: true }));
    try {
      const res = await fetch(`${API}/user-profiles/${userId}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Erreur lors de la sauvegarde');
      }
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
      setSaved(p => ({ ...p, [userId]: true }));
      setTimeout(() => setSaved(p => ({ ...p, [userId]: false })), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(p => ({ ...p, [userId]: false }));
    }
  };

  // Only admin can access this page
  if (myRole !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Accès réservé aux administrateurs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex-1 overflow-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-500" />
            Gestion des accès
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Définissez le rôle de chaque utilisateur pour contrôler ce qu'il voit dans l'application.
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Role legend */}
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {ROLES.map(r => (
          <div key={r.value} className={`rounded-xl border px-4 py-3 ${r.cls}`}>
            <p className="text-xs font-bold uppercase tracking-wider mb-0.5">{r.label}</p>
            <p className="text-[11px] opacity-80">{r.desc}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Utilisateur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Dernier accès</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Rôle actuel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Changer le rôle</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400 text-xs">Aucun utilisateur trouvé</td></tr>
              ) : users.map(u => {
                const isSelf = u.user_id === session?.user?.id;
                return (
                  <tr key={u.user_id} className={`hover:bg-slate-50 transition-colors ${isSelf ? 'bg-purple-50/40' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
                          {(u.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{u.email}</p>
                          {isSelf && <p className="text-[10px] text-purple-600 font-medium">Vous</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{fmtDate(u.last_sign_in)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${roleCls(u.role)}`}>
                        {roleLabel(u.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {ROLES.map(r => (
                          <button key={r.value}
                            onClick={() => handleRoleChange(u.user_id, r.value)}
                            disabled={saving[u.user_id] || u.role === r.value}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-40 ${
                              u.role === r.value
                                ? `${r.cls} cursor-default`
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}>
                            {u.role === r.value && <Check className="w-3 h-3 inline mr-1" />}
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {saving[u.user_id] && (
                        <div className="w-4 h-4 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto" />
                      )}
                      {saved[u.user_id] && (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        <p className="font-semibold mb-1">⚠ Note importante</p>
        <p>Le changement de rôle est immédiat. L'utilisateur verra la nouvelle interface à sa prochaine connexion ou après un rechargement de la page.</p>
      </div>
    </div>
  );
};

export default AdminUsers;
