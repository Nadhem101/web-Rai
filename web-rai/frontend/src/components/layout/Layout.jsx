import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { maintenanceSheetService } from '../../services/api';
import Login from '../../pages/Login.jsx';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import ScreenTransition from '../motion/ScreenTransition.jsx';
import { getRouteInfo } from './navConfig.js';

const Layout = ({ children }) => {
  const { session, loading: authLoading } = useAuth();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [completedMaintenanceCount, setCompletedMaintenanceCount] = useState(0);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const completed = await maintenanceSheetService.getAll({ status: 'completed' });
        if (isMounted) setCompletedMaintenanceCount(Array.isArray(completed) ? completed.length : 0);
      } catch {
        if (isMounted) setCompletedMaintenanceCount(0);
      }
    };
    load();
    const id = window.setInterval(load, 60000);
    return () => { isMounted = false; window.clearInterval(id); };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  if (!session) return <Login />;

  const { number: screenNumber, title: screenTitle } = getRouteInfo(location.pathname);

  return (
    <div
      className="h-screen w-full flex overflow-hidden relative"
      style={{
        background: 'var(--bg)',
        color: 'var(--text)',
        backgroundImage: 'radial-gradient(var(--grid) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      <Sidebar menuOpen={menuOpen} completedMaintenanceCount={completedMaintenanceCount} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} screenNumber={screenNumber} screenTitle={screenTitle} />
        <main className="flex-1 overflow-auto flex flex-col min-h-0">
          <ScreenTransition>{children}</ScreenTransition>
        </main>
      </div>
    </div>
  );
};

export default Layout;
