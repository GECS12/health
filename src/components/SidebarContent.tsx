'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SidebarLink } from './SidebarLink';

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

export function SidebarContent({ tree }: { tree: Section[] }) {
  return (
    <nav className="sidebar-nav">
      <div className="section-group">
        <a href="/" className="home-link">
          <span className="section-title-text">Introdução</span>
        </a>
      </div>
      {tree.map(section => (
        <SectionView key={section._id} section={section} depth={0} />
      ))}
    </nav>
  );
}

function SectionView({ section, depth }: { section: Section; depth: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasContent = section.posts.length > 0 || section.subSections.length > 0;

  return (
    <div className="section-group">
      <button 
        className={`section-label depth-${depth} ${hasContent ? 'has-children' : ''} ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="section-title-text">{formatTitle(section.title)}</span>
        {hasContent && (
          <ChevronRight 
            size={18} 
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
