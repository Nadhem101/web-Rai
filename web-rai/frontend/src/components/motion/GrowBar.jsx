import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * A bar that grows from its baseline to full height/width on entry.
 * axis="y" (default) grows vertically (transformOrigin bottom); axis="x" grows
 * horizontally (transformOrigin left) — used for the flow-stepper connectors.
 */
const GrowBar = ({ axis = 'y', delay = 0, className, style }) => {
  const reduceMotion = useReducedMotion();
  const scaleKey = axis === 'x' ? 'scaleX' : 'scaleY';
  const origin = axis === 'x' ? 'left center' : 'bottom center';

  return (
    <motion.div
      className={className}
      style={{ ...style, transformOrigin: origin }}
      initial={reduceMotion ? false : { [scaleKey]: 0 }}
      whileInView={{ [scaleKey]: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: reduceMotion ? 0.001 : 0.8, ease: [0.2, 0.75, 0.25, 1], delay: reduceMotion ? 0 : delay }}
    />
  );
};

export default GrowBar;
