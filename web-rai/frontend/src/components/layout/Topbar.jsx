import React, { useEffect, useState } from 'react';
import { Menu, X as XIcon, Clock } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge.jsx';

const getISOWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

const Topbar = ({ menuOpen, onToggleMenu, screenNumber, screenTitle }) => {
  const [clock, setClock] = useState('--:--:--');

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('fr-FR', { hour12: false }));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const week = `KW${String(getISOWeek(new Date())).padStart(2, '0')}`;

  return (
    <header
      className="relative z-50 h-[60px] flex-shrink-0 flex items-center justify-between gap-4 px-4 md:px-6"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--topbar)', backdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMenu}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors flex-shrink-0 hover:bg-[var(--panel3)]"
          style={{ color: 'var(--text2)' }}
          aria-label="Menu"
        >
          {menuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="font-mono text-[11px] font-semibold tracking-[0.05em]" style={{ color: 'var(--accent)' }}>{screenNumber}</span>
        <span className="hidden sm:inline-block w-px h-[18px]" style={{ background: 'var(--border)' }} />
        <span className="font-display font-semibold text-[15px] truncate" style={{ color: 'var(--text)' }}>{screenTitle}</span>
      </div>

      <div className="flex items-center gap-[18px] flex-shrink-0">
        <StatusBadge variant="ok" pulse className="hidden sm:inline-flex">SYSTÈME NOMINAL</StatusBadge>
        <div className="hidden md:flex items-center gap-[7px]" style={{ color: 'var(--text2)' }}>
          <span className="font-mono text-[10px] tracking-[0.12em]" style={{ color: 'var(--text3)' }}>{week}</span>
          <span className="w-px h-[14px]" style={{ background: 'var(--border)' }} />
          <Clock className="w-3.5 h-3.5" strokeWidth={1.8} />
          <span className="font-mono text-[12.5px] font-semibold tabular-nums tracking-[0.04em] min-w-[62px]">{clock}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
