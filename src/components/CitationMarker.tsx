'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CitationData {
  _id: string;
  citationId: string;
  authors: string[];
  year: number;
  title: string;
  source?: string;
  url?: string;
}

interface CitationMarkerProps {
  citation: CitationData;
  number: number;
}

export function CitationMarker({ citation, number }: CitationMarkerProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const markerRef = useRef<HTMLSpanElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const refElement = document.getElementById(`ref-${citation._id}`);
    if (refElement) {
      refElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Briefly highlight the reference
      refElement.classList.add('highlight-ref');
      setTimeout(() => refElement.classList.remove('highlight-ref'), 2000);
    }
  };

  // Format authors for tooltip (show first author + "et al." if multiple)
  const formattedAuthors = citation.authors.length > 1 
    ? `${citation.authors[0]} et al.`
    : citation.authors[0];

  return (
    <span className="citation-marker-wrapper">
      <span
        ref={markerRef}
        className="citation-marker"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Citation ${number}: ${formattedAuthors}, ${citation.year}`}
      >
        [{number}]
      </span>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="citation-tooltip"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="citation-tooltip-content">
              <div className="citation-tooltip-authors">{formattedAuthors}</div>
              <div className="citation-tooltip-year">({citation.year})</div>
              <div className="citation-tooltip-title">{citation.title}</div>
              {citation.source && (
                <div className="citation-tooltip-source">{citation.source}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
