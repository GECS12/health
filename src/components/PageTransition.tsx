'use client';

import { motion } from 'framer-motion';
import React from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ rotateY: -20, opacity: 0, originX: 0 }}
      animate={{ rotateY: 0, opacity: 1, originX: 0 }}
      exit={{ rotateY: 20, opacity: 0, originX: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.4, 0, 0.2, 1]
      }}
      style={{ perspective: 1200 }}
    >
      {children}
    </motion.div>
  );
}
