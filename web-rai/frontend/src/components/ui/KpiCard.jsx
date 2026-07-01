import React from 'react';
import { motion } from 'framer-motion';
import CountUp from '../motion/CountUp.jsx';
import SparklinePath from '../motion/SparklinePath.jsx';
import StatusBadge from './StatusBadge.jsx';
import DataLabel from './DataLabel.jsx';
import { staggerItemVariants } from '../motion/ScreenTransition.jsx';

/**
 * KPI card: icon tile + count-up number + mono caption, with an optional
 * sparkline or status badge in the header row.
 *
 * accentVariant colors the icon tile and top gradient strip: 'accent' | 'ok' | 'warn' | 'crit'.
 */
const ACCENT_COLORS = {
  accent: 'var(--accent)',
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  crit: 'var(--crit)',
};
const ACCENT_SOFT = {
  accent: 'var(--accent-soft)',
  ok: 'var(--ok-soft)',
  warn: 'var(--warn-soft)',
  crit: 'var(--crit-soft)',
};

const KpiCard = ({
  icon: Icon,
  label,
  value,
  suffix = '',
  format,
  accentVariant = 'accent',
  sparklinePath,
  badge,
  loading = false,
}) => {
  const color = ACCENT_COLORS[accentVariant] || ACCENT_COLORS.accent;
  const soft = ACCENT_SOFT[accentVariant] || ACCENT_SOFT.accent;

  return (
    <motion.div
      variants={staggerItemVariants}
      className="relative overflow-hidden rounded-[14px] p-[18px]"
      style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
      <div className="flex items-start justify-between mb-1.5">
        <div
          className="w-10 h-10 rounded-[11px] flex items-center justify-center"
          style={{ background: soft, color }}
        >
          {Icon && <Icon className="w-5 h-5" strokeWidth={1.8} />}
        </div>
        {sparklinePath && <SparklinePath d={sparklinePath} stroke={color} />}
        {badge && (
          <StatusBadge variant={badge.variant || 'ok'} pulse={badge.pulse}>
            {badge.text}
          </StatusBadge>
        )}
      </div>
      <div className="font-display font-semibold text-[33px] leading-none my-3" style={{ letterSpacing: '-0.6px' }}>
        {loading ? '—' : <CountUp value={value} suffix={suffix} />}
      </div>
      <DataLabel>{label}</DataLabel>
    </motion.div>
  );
};

export default KpiCard;
