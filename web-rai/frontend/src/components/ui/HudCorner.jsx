import React from 'react';

const POSITION_STYLES = {
  tl: { top: 14, left: 14, borderTop: '2px solid', borderLeft: '2px solid' },
  tr: { top: 14, right: 14, borderTop: '2px solid', borderRight: '2px solid' },
  bl: { bottom: 14, left: 14, borderBottom: '2px solid', borderLeft: '2px solid' },
  br: { bottom: 14, right: 14, borderBottom: '2px solid', borderRight: '2px solid' },
};

/** Decorative HUD-style corner bracket, absolutely positioned inside a `position: relative` panel. */
const HudCorner = ({ position = 'tl', size = 14, glow = false }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      width: size,
      height: size,
      ...POSITION_STYLES[position],
      borderColor: glow ? 'var(--accent)' : 'var(--border)',
      filter: glow ? 'drop-shadow(0 0 4px var(--accent-soft))' : undefined,
    }}
  />
);

export default HudCorner;
