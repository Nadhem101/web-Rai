import React from 'react';

const VARIANTS = {
  ok: { bg: 'var(--ok-soft)', color: 'var(--ok)' },
  warn: { bg: 'var(--warn-soft)', color: 'var(--warn)' },
  crit: { bg: 'var(--crit-soft)', color: 'var(--crit)' },
  info: { bg: 'var(--info-soft)', color: 'var(--info)' },
};

/**
 * Status pill (e.g. "SYSTÈME NOMINAL", downtime severity, KPI delta badges).
 * `pulse` adds the animated LED dot used by the topbar status pill and
 * critical alert rows.
 */
const StatusBadge = ({ variant = 'info', children, pulse = false, className = '' }) => {
  const { bg, color } = VARIANTS[variant] || VARIANTS.info;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-[20px] font-mono text-[10px] font-bold tracking-wide ${className}`}
      style={{ background: bg, color }}
    >
      {pulse && (
        <span
          className="w-[7px] h-[7px] rounded-full flex-shrink-0"
          style={{ background: color, color, animation: 'led-pulse 2.2s infinite' }}
        />
      )}
      {children}
    </span>
  );
};

export default StatusBadge;
