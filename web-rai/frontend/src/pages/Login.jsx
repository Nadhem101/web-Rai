import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Factory, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect.'
          : err.message || 'Erreur de connexion.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--bg)',
        backgroundImage: 'radial-gradient(var(--grid) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(150deg, var(--accent3), var(--accent2))', boxShadow: '0 8px 24px var(--accent-soft)' }}
          >
            <Factory className="w-6 h-6 text-white" strokeWidth={1.9} />
          </div>
          <h1 className="font-display font-bold text-[22px] tracking-wide" style={{ color: 'var(--text)' }}>R.A.I.</h1>
          <p className="text-sm mt-1 font-mono tracking-[0.14em]" style={{ color: 'var(--text3)' }}>CONTROL · MAINTENANCE</p>
        </div>

        {/* Card */}
        <div className="rounded-[18px] overflow-hidden" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <div className="px-6 py-4" style={{ background: 'linear-gradient(135deg, #0d1828, #0a2820)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-sm font-bold text-white font-display">Connexion</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Accès réservé au personnel autorisé</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-[10px] px-4 py-3 text-sm"
                style={{ border: '1px solid var(--crit)', background: 'var(--crit-soft)', color: 'var(--crit)' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text3)' }}>
                Adresse email
              </span>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email" autoFocus required
                className="w-full rounded-[10px] px-4 py-2.5 text-sm outline-none transition-colors"
                style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                placeholder="votre@email.com"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text3)' }}>
                Mot de passe
              </span>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password" required
                  className="w-full rounded-[10px] px-4 py-2.5 pr-10 text-sm outline-none transition-colors"
                  style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80"
                  style={{ color: 'var(--text3)' }} tabIndex={-1}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>

            <button type="submit" disabled={loading || !email.trim() || !password}
              className="w-full py-2.5 rounded-[10px] text-sm font-bold text-white disabled:opacity-50 transition-transform hover:-translate-y-0.5"
              style={{ background: loading ? 'var(--text3)' : 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
              {loading ? 'Connexion en cours…' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4 font-mono tracking-wide" style={{ color: 'var(--text3)' }}>
          RAI © {new Date().getFullYear()} — Accès restreint
        </p>
      </div>
    </div>
  );
};

export default Login;
