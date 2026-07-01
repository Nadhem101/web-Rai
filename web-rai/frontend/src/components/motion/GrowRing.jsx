import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Animated SVG progress ring. Render inside an <svg> alongside a static track
 * circle. `percent` is 0-100.
 */
const GrowRing = ({ cx, cy, radius, percent, stroke = 'var(--accent)', strokeWidth = 13, delay = 0.2 }) => {
  const reduceMotion = useReducedMotion();
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - percent / 100);

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={radius}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      transform={`rotate(-90 ${cx} ${cy})`}
      strokeDasharray={circumference}
      initial={{ strokeDashoffset: reduceMotion ? targetOffset : circumference }}
      animate={{ strokeDashoffset: targetOffset }}
      transition={{ duration: reduceMotion ? 0.001 : 1.15, ease: [0.3, 0.7, 0.2, 1], delay: reduceMotion ? 0 : delay }}
    />
  );
};

export default GrowRing;
