'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SidebarLink } from './SidebarLink';
import { useSidebarState } from '@/context/SidebarStateContext';

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
  if (/^[XIV]+$/.test(str)) return str;

  const partMatch = str.match(/^Part\s*(\d+)$/i);
  if (partMatch) {
    return `Parte ${toRoman(parseInt(partMatch[1], 10))}`;
  }

  const capMatch = str.match(/^Cap\s*(\d+)$/i);
  if (capMatch) {
    return `Capítulo ${capMatch[1]}`;
  }
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
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

export function SidebarContent({
  tree,
  siteTitle,
  siteAuthor,
}: {
  tree: Section[];
  siteTitle: string;
  siteAuthor?: string;
}) {
  const { setExpandedSections, expandedSections } = useSidebarState();

  useEffect(() => {
    if (expandedSections.size === 0) {
      setExpandedSections(new Set(getAllSectionIds(tree)));
    }
  }, []); // Run once

  return (
    <nav className="sidebar-nav">
      {/* Branding only in the mobile drawer — desktop branding lives in the top header */}
      <div className="section-group mobile-only sidebar-mobile-brand">
        <Link href="/" className="home-link sidebar-branding">
          <span className="section-title-text">{siteTitle}</span>
          {siteAuthor ? (
            <span className="sidebar-branding-author">{siteAuthor}</span>
          ) : null}
        </Link>
      </div>

      <div className="sidebar-nav-sections">
        {tree.map(section => (
          <SectionView key={section._id} section={section} depth={0} />
        ))}
      </div>
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
