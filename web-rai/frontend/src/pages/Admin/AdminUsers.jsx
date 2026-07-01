import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Check, AlertCircle, RefreshCw } from 'lucide-react';
import DataLabel from '../../components/ui/DataLabel.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ROLES = [
  { value: 'admin',       label: 'Admin',            desc: 'Accès complet à tous les modules',     variant: 'crit'   },
  { value: 'maintenance', label: 'Maintenance',       desc: 'Inventaire · Maintenance · ECME',      variant: 'info'   },
  { value: 'indus',       label: 'Industrialisation', desc: 'Inventaire · Industrialisation',       variant: 'warn'   },
];

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
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
    if (nextRoles.length === 0) nextRoles = [roleValue];
    setSaving(p => ({ ...p, [userId]: true }));
    try {
      const res = await fetch(`${API}/user-profiles/${userId}`, {
        method: 'PUT', headers: authHeader(),
        body: JSON.stringify({ roles: nextRoles }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Erreur lors de la sauvegarde');
      }
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, roles: nextRoles } : u));
      setSaved(p => ({ ...p, [userId]: true }));
      setTimeout(() => setSaved(p => ({ ...p, [userId]: false })), 2000);
    } catch (err) { alert(err.message); }
    finally { setSaving(p => ({ ...p, [userId]: false })); }
  };

  if (!can('admin')) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'var(--text3)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text2)' }}>Accès réservé aux administrateurs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[26px] pt-6 pb-10 flex-1 overflow-auto space-y-[18px]" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <motion.div variants={staggerItemVariants} className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <Shield className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Gestion des accès</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>Cochez un ou plusieurs rôles par utilisateur. Les accès sont cumulatifs.</p>
          </div>
        </div>
        <button onClick={load} disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors hover:bg-[var(--panel3)] disabled:opacity-50"
          style={{ border: '1px solid var(--border)', color: 'var(--text2)', background: 'var(--panel)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </motion.div>

      {/* Role legend */}
      <motion.div variants={staggerItemVariants} className="grid gap-3 sm:grid-cols-3">
        {ROLES.map(r => (
          <div key={r.value} className="rounded-[12px] px-4 py-3" style={{ border: '1px solid var(--border)', background: 'var(--panel2)' }}>
            <div className="flex items-center gap-2 mb-0.5">
              <StatusBadge variant={r.variant}>{r.label}</StatusBadge>
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text3)' }}>{r.desc}</p>
          </div>
        ))}
      </motion.div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-[10px] px-4 py-3 text-sm"
          style={{ border: '1px solid var(--crit)', background: 'var(--crit-soft)', color: 'var(--crit)' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : (
        <motion.div variants={staggerItemVariants} className="rounded-[14px] overflow-hidden"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                {['Utilisateur','Dernier accès','Rôles actifs','Accès',''].map(h => (
                  <th key={h} className={`px-4 py-3 text-left ${h === 'Dernier accès' ? 'hidden sm:table-cell' : ''} ${h === '' ? 'w-10' : ''}`}>
                    {h && <DataLabel>{h}</DataLabel>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-xs" style={{ color: 'var(--text3)' }}>Aucun utilisateur trouvé</td></tr>
              ) : users.map(u => {
                const isSelf = u.user_id === session?.user?.id;
                const userRoles = u.roles || ['admin'];
                return (
                  <tr key={u.user_id}
                    className="transition-colors hover:bg-[var(--panel2)]"
                    style={{ borderBottom: '1px solid var(--border2)', background: isSelf ? 'var(--accent-soft)' : undefined }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
                          {(u.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{u.email}</p>
                          {isSelf && <p className="text-[10px] font-medium" style={{ color: 'var(--accent)' }}>Vous</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs hidden sm:table-cell" style={{ color: 'var(--text3)' }}>{fmtDate(u.last_sign_in)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {userRoles.map(r => {
                          const roleInfo = ROLES.find(x => x.value === r);
                          return roleInfo ? <StatusBadge key={r} variant={roleInfo.variant}>{roleInfo.label}</StatusBadge> : null;
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        {ROLES.map(r => {
                          const isChecked = userRoles.includes(r.value);
                          const isOnlyRole = isChecked && userRoles.length === 1;
                          return (
                            <label key={r.value} className={`flex items-center gap-2 cursor-pointer select-none ${saving[u.user_id] || isOnlyRole ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              <input type="checkbox" checked={isChecked}
                                disabled={saving[u.user_id] || isOnlyRole}
                                onChange={e => handleRoleToggle(u.user_id, r.value, e.target.checked)}
                                className="w-3.5 h-3.5 flex-shrink-0" style={{ accentColor: 'var(--accent)' }} />
                              <StatusBadge variant={r.variant}>{r.label}</StatusBadge>
                            </label>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {saving[u.user_id] && (
                        <div className="w-4 h-4 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
                      )}
                      {saved[u.user_id] && <Check className="w-4 h-4 mx-auto" style={{ color: 'var(--ok)' }} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      <div className="space-y-2">
        <div className="rounded-[12px] px-4 py-3 text-xs" style={{ border: '1px solid var(--info)', background: 'var(--info-soft)', color: 'var(--info)' }}>
          <p className="font-semibold mb-0.5">Accès cumulatifs</p>
          <p style={{ color: 'var(--text2)' }}>Un utilisateur avec plusieurs rôles bénéficie de l'union de tous leurs accès. Exemple : <strong>Maintenance + Industrialisation</strong> donne accès à tous les modules sauf Administration.</p>
        </div>
        <div className="rounded-[12px] px-4 py-3 text-xs" style={{ border: '1px solid var(--warn)', background: 'var(--warn-soft)', color: 'var(--warn)' }}>
          <p className="font-semibold mb-0.5">⚠ Note importante</p>
          <p style={{ color: 'var(--text2)' }}>Le changement de rôle est immédiat. L'utilisateur verra la nouvelle interface à sa prochaine connexion ou après rechargement. Un utilisateur doit toujours avoir au moins un rôle.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
