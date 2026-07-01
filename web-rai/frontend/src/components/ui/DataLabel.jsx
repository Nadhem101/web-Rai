import React from 'react';

/** Mono uppercase caption — used for KPI captions, section labels, codes. */
const DataLabel = ({ children, className = '', muted = true, as: As = 'span' }) => (
  <As
    className={`font-mono uppercase tracking-[0.13em] text-[10px] font-semibold ${className}`}
    style={{ color: muted ? 'var(--text3)' : 'var(--text2)' }}
  >
    {children}
  </As>
);

export default DataLabel;
