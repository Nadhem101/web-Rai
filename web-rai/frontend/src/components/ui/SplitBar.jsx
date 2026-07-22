import React from 'react';
import GrowBar from '../motion/GrowBar.jsx';
import DataLabel from './DataLabel.jsx';

/**
 * Horizontal multi-segment bar — shows a set of counts as proportional
 * segments of a single bar, with a legend row (label + count + %) below.
 * segments: [{ label, value, color }]
 */
const SplitBar = ({ segments = [], loading = false }) => {
  const total = segments.reduce((s, seg) => s + (seg.value || 0), 0);

  return (
    <div>
      <div
        className="w-full h-3 rounded-full overflow-hidden flex"
        style={{ background: 'var(--panel3)' }}
      >
        {!loading && total > 0 && segments.map((seg, i) => {
          const pct = (seg.value / total) * 100;
          if (pct <= 0) return null;
          return (
            <GrowBar
              key={seg.label}
              axis="x"
              delay={0.1 + i * 0.08}
              className="h-full"
              style={{ width: `${pct}%`, background: seg.color }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
        {segments.map((seg) => {
          const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
          return (
            <div key={seg.label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                {loading ? '—' : seg.value}
              </span>
              <DataLabel className="!normal-case !tracking-normal !text-[11px]">
                {seg.label}{!loading && total > 0 ? ` · ${pct}%` : ''}
              </DataLabel>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SplitBar;
