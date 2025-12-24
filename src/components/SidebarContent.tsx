'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SidebarLink } from './SidebarLink';

interface Post {
  title: string;
  slug: string;
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
    <div className="section-group" style={{ marginLeft: depth > 0 ? `${depth * 0.75}rem` : '0' }}>
      <button 
        className={`section-label depth-${depth} ${hasContent ? 'has-children' : ''} ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="section-title-wrapper">
          <span>{capitalize(section.title)}</span>
        </div>
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
                  title={capitalize(post.title)}
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
