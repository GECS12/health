'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { EditButton } from './EditButton';

interface BreadcrumbsProps {
  part?: string;
  partHref?: string;
  chapter?: string;
  chapterHref?: string;
  article: string;
  documentId?: string;
  isDraftMode?: boolean;
}

export function Breadcrumbs({ part, partHref, chapter, chapterHref, article, documentId, isDraftMode }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {documentId && (
        <EditButton documentId={documentId} isDraftMode={isDraftMode} variant="breadcrumb" />
      )}
      
      {part && (
        <>
          <ChevronRight size={12} className="breadcrumb-separator" />
          {partHref ? (
            <Link href={partHref} className="breadcrumb-item breadcrumb-link">
              {part}
            </Link>
          ) : (
            <span className="breadcrumb-item">{part}</span>
          )}
        </>
      )}
      
      {chapter && (
        <>
          <ChevronRight size={12} className="breadcrumb-separator" />
          {chapterHref ? (
            <Link href={chapterHref} className="breadcrumb-item breadcrumb-link">
              {chapter}
            </Link>
          ) : (
            <span className="breadcrumb-item">{chapter}</span>
          )}
        </>
      )}
      
      <ChevronRight size={12} className="breadcrumb-separator" />
      <span className="breadcrumb-item active">{article}</span>
    </nav>
  );
}
