import React, { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

const defaultFormat = (n) => Math.round(n).toLocaleString('fr-FR');

const CountUp = ({ value, duration = 0.95, format = defaultFormat, suffix = '', as: As = 'span', className }) => {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [value, duration, reduceMotion]);

  return (
    <As className={className}>
      {format(display)}
      {suffix}
    </As>
  );
};

export default CountUp;
