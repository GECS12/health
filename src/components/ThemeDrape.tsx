'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

export function ThemeDrape() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [prevTheme, setPrevTheme] = useState<string | undefined>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && prevTheme !== undefined && prevTheme !== theme) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 800);
      return () => clearTimeout(timer);
    }
    setPrevTheme(theme);
  }, [theme, mounted, prevTheme]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
          animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme === 'dark' ? 'rgba(14, 14, 14, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  );
}
