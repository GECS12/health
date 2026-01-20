'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FootnotePreviewProps {
  children: React.ReactNode;
  content: React.ReactNode;
  index: string | number;
}

export function FootnotePreview({ children, content, index }: FootnotePreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [lookupContent, setLookupContent] = useState<React.ReactNode>(content);

  useEffect(() => {
    if (isHovered && !content) {
      // Try DOM lookup for manual references
      const refElement = document.getElementById(`ref-${index}`);
        if (refElement) {
        // Clean up the text (remove the "1 –" prefix)
        // Strip HTML and aggressively strip leading numbers (recursive)
        let cleaned = refElement.innerText.replace(/<[^>]*>?/gm, '').replace(/\n+/g, ' ').trim();
        let last;
        do {
          last = cleaned;
          cleaned = cleaned.replace(/^[\[\]\#\d\s\.\:\/\u2010-\u2015\u00A0\u202F\uFEFF\-\–\—)]+/, '').trim();
        } while (cleaned !== last);
        setLookupContent(cleaned);
      }
    }
  }, [isHovered, content, index]);

  useEffect(() => {
    if (isHovered && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      setPosition({
        top: rect.bottom, // Use bottom for placement below
        left: rect.left + rect.width / 2,
      });
    }
  }, [isHovered]);

  return (
    <div 
      ref={triggerRef}
      className="footnote-tooltip-trigger"
      onMouseEnter={() => setIsHovered(true)} // Keep trigger active
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      <AnimatePresence>
        {isHovered && lookupContent && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="footnote-tooltip-content"
            style={{ 
              position: 'fixed',
              top: position.top + 8, // Place below with gap
              left: position.left,
              transform: 'translate(-50%, 0)', // Transform from top center
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          >
            {lookupContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
