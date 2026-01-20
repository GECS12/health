'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarStateContextType {
  expandedSections: Set<string>;
  toggleSection: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setExpandedSections: (sections: Set<string>) => void;
}

const SidebarStateContext = createContext<SidebarStateContextType | undefined>(undefined);

export function SidebarStateProvider({ children }: { children: ReactNode }) {
  const [expandedSections, setExpandedSectionsState] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setExpandedSectionsState(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    // This needs to be handled by the consumer effectively, or we need a way to know all IDs.
    // For now, we arguably might not need "Expand All" as much as "Collapse All".
    // Or we rely on the consumer knowing what to set. 
    // Actually, let's keep it simple: we can't easily "Expand All" without the tree.
    // So maybe we just expose setExpandedSections.
    console.warn("expandAll not implemented in context without tree awareness");
  };

  const collapseAll = () => {
    setExpandedSectionsState(new Set());
  };

  const setExpandedSections = (sections: Set<string>) => {
    setExpandedSectionsState(sections);
  };

  return (
    <SidebarStateContext.Provider value={{ expandedSections, toggleSection, expandAll, collapseAll, setExpandedSections }}>
      {children}
    </SidebarStateContext.Provider>
  );
}

export function useSidebarState() {
  const context = useContext(SidebarStateContext);
  if (context === undefined) {
    throw new Error('useSidebarState must be used within a SidebarStateProvider');
  }
  return context;
}
