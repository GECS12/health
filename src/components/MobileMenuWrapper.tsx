'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMobileMenu } from '@/context/MobileMenuContext';

export function MobileMenuWrapper({ 
  sidebar, 
  toc, 
  children 
}: { 
  sidebar: React.ReactNode; 
  toc: React.ReactNode; 
  children: React.ReactNode;
}) {
  const { isSidebarOpen, isTOCOpen, closeAll } = useMobileMenu();

  return (
    <div className="layout-container">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAll}
            />
            <motion.div 
              className="mobile-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="sidebar">
                {sidebar}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="sidebar desktop-only">
        <ScrollArea className="h-[calc(100vh-1px)]">
          {sidebar}
        </ScrollArea>
      </aside>

      <main id="main-content" className="main-content" tabIndex={-1}>
        <div className="content-inner smooth-fade">
          {children}
        </div>
      </main>

      {/* Mobile TOC Overlay */}
      <AnimatePresence>
        {isTOCOpen && (
          <>
            <motion.div 
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAll}
            />
            <motion.div 
              className="mobile-toc"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="toc">
                {toc}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
