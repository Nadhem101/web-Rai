import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const fetchRole = async (session) => {
  if (!session?.access_token) return 'admin';
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/user-profiles/me`,
      { headers: { Authorization: `Bearer ${session.access_token}` } }
    );
    if (!res.ok) return 'admin';
    const data = await res.json();
    return data.role || 'admin';
  } catch {
    return 'admin';
  }
};

export const AuthProvider = ({ children }) => {
  const [session,  setSession]  = useState(null);
  const [role,     setRole]     = useState('admin');
  const [loading,  setLoading]  = useState(true);

  const applySession = async (s) => {
    setSession(s);
    if (s) {
      const r = await fetchRole(s);
      setRole(r);
    } else {
      setRole('admin');
    }
  };

  useEffect(() => {
    if (!supabase) {
      console.warn('[Auth] Supabase not configured — auth disabled for local dev');
      setSession({ user: { email: 'dev@local', id: 'local' } });
      setRole('admin');
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await applySession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await applySession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!supabase) throw new Error('Supabase non configuré');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = () => {
    if (!supabase) { setSession(null); setRole('admin'); return; }
    return supabase.auth.signOut();
  };

  // Permission helper: can(section) returns true if current role has access
  const PERMISSIONS = {
    admin:       ['dashboard', 'inventaire', 'maintenance', 'curatif', 'ecme', 'indus', 'admin'],
    maintenance: ['dashboard', 'inventaire', 'maintenance', 'curatif', 'ecme'],
    indus:       ['dashboard', 'inventaire', 'indus'],
  };

  const can = (section) => {
    const allowed = PERMISSIONS[role] || PERMISSIONS.admin;
    return allowed.includes(section);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, role, loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
