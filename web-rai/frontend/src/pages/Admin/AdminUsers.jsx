import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, User, Check, AlertCircle, RefreshCw } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ROLES = [
  {
    value: 'admin',
    label: 'Admin',
    desc: 'Accès complet à tous les modules',
    cls: 'bg-purple-100 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
  },
  {
    value: 'maintenance',
    label: 'Maintenance',
    desc: 'Inventaire · Maintenance · ECME',
    cls: 'bg-sky-100 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
  },
  {
    value: 'indus',
    label: 'Industrialisation',
    desc: 'Inventaire · Industrialisation',
    cls: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
];

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const RoleBadge = ({ value }) => {
  const r = ROLES.find(x => x.value === value);
  if (!r) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${r.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
      {r.label}
    </span>
  );
};

const AdminUsers = () => {
  const { session, can } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState({});
  const [saved,   setSaved]   = useState({});

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

  const handleRoleToggle = async (userId, roleValue, checked) => {
    const user = users.find(u => u.user_id === userId);
    if (!user) return;

    const currentRoles = user.roles || ['admin'];
    let nextRoles = checked
      ? [...new Set([...currentRoles, roleValue])]
      : currentRoles.filter(r => r !== roleValue);

    // Always keep at least one role
    if (nextRoles.length === 0) nextRoles = [roleValue];

    setSaving(p => ({ ...p, [userId]: true }));
    try {
      const res = await fetch(`${API}/user-profiles/${userId}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ roles: nextRoles }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Erreur lors de la sauvegarde');
      }
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, roles: nextRoles } : u));
      setSaved(p => ({ ...p, [userId]: true }));
      setTimeout(() => setSaved(p => ({ ...p, [userId]: false })), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(p => ({ ...p, [userId]: false }));
    }
  };

  if (!can('admin')) {
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
            Cochez un ou plusieurs rôles par utilisateur. Les accès sont cumulatifs.
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
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`w-2 h-2 rounded-full ${r.dot}`} />
              <p className="text-xs font-bold uppercase tracking-wider">{r.label}</p>
            </div>
            <p className="text-[11px] opacity-70">{r.desc}</p>
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Dernier accès</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Rôles actifs</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Accès</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400 text-xs">Aucun utilisateur trouvé</td></tr>
              ) : users.map(u => {
                const isSelf = u.user_id === session?.user?.id;
                const userRoles = u.roles || ['admin'];
                return (
                  <tr key={u.user_id} className={`hover:bg-slate-50 transition-colors ${isSelf ? 'bg-purple-50/40' : ''}`}>

                    {/* User */}
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

                    {/* Last access */}
                    <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell">{fmtDate(u.last_sign_in)}</td>

                    {/* Current roles as badges */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {userRoles.map(r => <RoleBadge key={r} value={r} />)}
                      </div>
                    </td>

                    {/* Checkbox toggles */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        {ROLES.map(r => {
                          const isChecked = userRoles.includes(r.value);
                          const isOnlyRole = isChecked && userRoles.length === 1;
                          return (
                            <label key={r.value}
                              className={`flex items-center gap-2 cursor-pointer select-none ${
                                saving[u.user_id] || isOnlyRole ? 'opacity-50 cursor-not-allowed' : ''
                              }`}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={saving[u.user_id] || isOnlyRole}
                                onChange={e => handleRoleToggle(u.user_id, r.value, e.target.checked)}
                                className="accent-sky-500 w-3.5 h-3.5 flex-shrink-0"
                              />
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${r.cls}`}>
                                {r.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </td>

                    {/* Save indicator */}
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

      <div className="mt-4 space-y-2">
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-700">
          <p className="font-semibold mb-0.5">Accès cumulatifs</p>
          <p>Un utilisateur avec plusieurs rôles bénéficie de l'union de tous leurs accès. Exemple : <strong>Maintenance + Industrialisation</strong> donne accès à tous les modules sauf Administration.</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          <p className="font-semibold mb-0.5">⚠ Note importante</p>
          <p>Le changement de rôle est immédiat. L'utilisateur verra la nouvelle interface à sa prochaine connexion ou après rechargement. Un utilisateur doit toujours avoir au moins un rôle.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
