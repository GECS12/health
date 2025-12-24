'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface MobileMenuContextType {
  isSidebarOpen: boolean;
  isTOCOpen: boolean;
  toggleSidebar: () => void;
  toggleTOC: () => void;
  closeAll: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTOCOpen, setIsTOCOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTOC = () => setIsTOCOpen(!isTOCOpen);
  const closeAll = () => {
    setIsSidebarOpen(false);
    setIsTOCOpen(false);
  };

  // Close menus on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeAll();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <MobileMenuContext.Provider value={{ isSidebarOpen, isTOCOpen, toggleSidebar, toggleTOC, closeAll }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  return context;
}
