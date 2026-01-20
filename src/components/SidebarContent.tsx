'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SidebarLink } from './SidebarLink';
import { SidebarStateProvider, useSidebarState } from '@/context/SidebarStateContext';
import { FontSizeControl } from './FontSizeControl';

interface Post {
  title: string;
  slug: string;
}

const toRoman = (num: number): string => {
  const romicals = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
  ] as const;
  let res = '';
  for (const [rom, val] of romicals) {
    while (num >= val) {
      res += rom;
      num -= val;
    }
  }
  return res;
};

const formatTitle = (str: string) => {
  // Handle Roman numerals or specific acronyms if needed
  if (/^[XIV]+$/.test(str)) return str;

  // Specific replacements for "PartX" and "CapX"
  const partMatch = str.match(/^Part\s*(\d+)$/i);
  if (partMatch) {
    return `Parte ${toRoman(parseInt(partMatch[1], 10))}`;
  }

  const capMatch = str.match(/^Cap\s*(\d+)$/i);
  if (capMatch) {
    return `Capítulo ${capMatch[1]}`;
  }
  
  // Normalize casing: lowercase first, then capitalize words
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Keep roman numerals uppercase if they appear (simple check)
      if (/^(ii|iii|iv|vi|vii|viii|ix|xi)$/i.test(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

interface Section {
  _id: string;
  title: string;
  subSections: Section[];
  posts: Post[];
}

// Flatten tree to get all Section IDs for initial expanding
const getAllSectionIds = (sections: Section[]): string[] => {
  let ids: string[] = [];
  sections.forEach(sec => {
    ids.push(sec._id);
    if (sec.subSections) {
      ids = ids.concat(getAllSectionIds(sec.subSections));
    }
  });
  return ids;
};



function SidebarControls({ tree }: { tree: Section[] }) {
  const { collapseAll, setExpandedSections, expandedSections } = useSidebarState();

  const allSectionIds = getAllSectionIds(tree);
  const isExpanded = expandedSections.size >= allSectionIds.length * 0.5; // More than half expanded

  const handleToggle = () => {
    if (isExpanded) {
      collapseAll();
    } else {
      setExpandedSections(new Set(allSectionIds));
    }
  };

  return (
    <div className="sidebar-controls-row">
      <FontSizeControl />
      <button onClick={handleToggle} className="sidebar-text-btn">
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
}

export function SidebarContent({ tree }: { tree: Section[] }) {
  return (
    <SidebarStateProvider>
      <SidebarContentInner tree={tree} />
    </SidebarStateProvider>
  );
}

function SidebarContentInner({ tree }: { tree: Section[] }) {
  const { setExpandedSections, expandedSections } = useSidebarState();

  // Initialize all open on mount (only once)
  useEffect(() => {
    // Only if empty (fresh load), though this might conflict if user clicked "Collapse All" then refreshed?
      // Actually state is not persisted, so fresh load is always empty.
    // So we default to open.
    if (expandedSections.size === 0) {
      setExpandedSections(new Set(getAllSectionIds(tree)));
    }
  }, []); // Run once

  return (
    <nav className="sidebar-nav">
      <div className="section-group">
        <Link href="/" className="home-link sidebar-branding">
          <span className="section-title-text">HEALTH & NUTRITION</span>
        </Link>
      </div>

      <SidebarControls tree={tree} />

      {tree.map(section => (
        <SectionView key={section._id} section={section} depth={0} />
      ))}
    </nav>
  );
}

function SectionView({ section, depth }: { section: Section; depth: number }) {
  const { expandedSections, toggleSection } = useSidebarState();
  const isOpen = expandedSections.has(section._id);
  const hasContent = section.posts.length > 0 || section.subSections.length > 0;

  return (
    <div className="section-group">
      <button 
        className={`section-label depth-${depth} ${hasContent ? 'has-children' : ''} ${isOpen ? 'is-open' : ''}`}
        onClick={() => toggleSection(section._id)}
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="section-title-text">{formatTitle(section.title)}</span>
        </div>
        {hasContent && (
          <ChevronRight 
            size={16} 
            className={`section-chevron ${isOpen ? 'chevron-open' : ''}`}
          />
        )}
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            className="sub-links-container"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="sub-links">
              {section.posts.map((post: Post) => (
                <SidebarLink 
                  key={post.slug} 
                  href={`/${post.slug}`} 
                  title={formatTitle(post.title)}
                />
              ))}
              
              {section.subSections.map((sub: Section) => (
                <SectionView key={sub._id} section={sub} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

