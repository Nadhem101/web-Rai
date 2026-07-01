import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const screenVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.042, delayChildren: 0 } },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } },
};

const reducedScreenVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0 } },
};

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.001 } },
};

const ScreenTransition = ({ children }) => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const parentVariants = reduceMotion ? reducedScreenVariants : screenVariants;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="hidden"
        animate="visible"
        variants={parentVariants}
        className="flex-1 min-h-0 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ScreenTransition;
export { reducedItemVariants };
