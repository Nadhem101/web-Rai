import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Draw-on sparkline. `d` is a precomputed SVG path string (e.g. from points
 * mapped into a fixed viewBox).
 */
const SparklinePath = ({ d, width = 74, height = 26, viewBox = '0 0 100 28', stroke = 'var(--accent)', strokeWidth = 2, duration = 1.35, delay = 0.25 }) => {
  const reduceMotion = useReducedMotion();

  return (
    <svg width={width} height={height} viewBox={viewBox} fill="none" style={{ opacity: 0.9 }}>
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduceMotion ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduceMotion ? 0.001 : duration, ease: 'easeInOut', delay: reduceMotion ? 0 : delay }}
      />
    </svg>
  );
};

export default SparklinePath;
