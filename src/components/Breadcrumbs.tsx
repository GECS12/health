'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  part?: string;
  chapter?: string;
  article: string;
}

export function Breadcrumbs({ part, chapter, article }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <div className="breadcrumb-item">
        <Home size={14} />
      </div>
      
      {part && (
        <>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <div className="breadcrumb-item">{part}</div>
        </>
      )}
      
      {chapter && (
        <>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <div className="breadcrumb-item">{chapter}</div>
        </>
      )}
      
      <ChevronRight size={14} className="breadcrumb-separator" />
      <div className="breadcrumb-item active">{article}</div>
    </nav>
  );
}
