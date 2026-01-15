'use client';

import { motion } from 'framer-motion';
import React from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -5 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] // Custom ease for a more 'physical' feel
      }}
    >
      {children}
    </motion.div>
  );
}
