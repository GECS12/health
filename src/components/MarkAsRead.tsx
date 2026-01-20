'use client';

import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { useReadingProgress } from '@/context/ReadingProgressContext';

export function MarkAsRead({ slug }: { slug: string }) {
  const { isRead, toggleRead } = useReadingProgress();
  const read = isRead(slug);

  return (
    <div className="mark-as-read-container">
      <button 
        onClick={() => toggleRead(slug)}
        className={`mark-as-read-button ${read ? 'is-read' : ''}`}
        aria-label={read ? 'Marcar como não lido' : 'Marcar como lido'}
      >
        {read ? (
          <>
            <CheckCircle2 size={20} className="text-accent-color" />
            <span>Lido</span>
          </>
        ) : (
          <>
            <Circle size={20} />
            <span>Marcar como lido</span>
          </>
        )}
      </button>
      <div className="mark-as-read-divider" />
    </div>
  );
}
