import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const fetchRoles = async (session) => {
  if (!session?.access_token) return ['admin'];
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/user-profiles/me`,
      { headers: { Authorization: `Bearer ${session.access_token}` } }
    );
    if (!res.ok) return ['admin'];
    const data = await res.json();
    return Array.isArray(data.roles) && data.roles.length > 0 ? data.roles : ['admin'];
  } catch {
    return ['admin'];
  }
};

// Section → which roles grant access to it.
// Maintenance and Indus supervisors currently run the whole app day-to-day,
// so all three roles are equivalent for now — full access, same as admin.
const ALL_SECTIONS = ['dashboard', 'inventaire', 'maintenance', 'curatif', 'ecme', 'indus', 'admin'];
const PERMISSIONS = {
  admin:       ALL_SECTIONS,
  maintenance: ALL_SECTIONS,
  indus:       ALL_SECTIONS,
};

export const AuthProvider = ({ children }) => {
  const [session, setSession]  = useState(null);
  const [roles,   setRoles]    = useState(['admin']);
  const [loading, setLoading]  = useState(true);

  const applySession = async (s) => {
    setSession(s);
    if (s) {
      const r = await fetchRoles(s);
      setRoles(r);
    } else {
      setRoles(['admin']);
    }
  };

  useEffect(() => {
    if (!supabase) {
      console.warn('[Auth] Supabase not configured — auth disabled for local dev');
      setSession({ user: { email: 'dev@local', id: 'local' } });
      setRoles(['admin']);
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
    if (!supabase) { setSession(null); setRoles(['admin']); return; }
    return supabase.auth.signOut();
  };

  // can(section) — true if ANY of the user's roles grants access to that section
  const can = (section) =>
    roles.some(r => (PERMISSIONS[r] || []).includes(section));

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, roles, loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
