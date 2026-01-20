'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ReadingProgressContextType {
  readArticles: string[];
  markAsRead: (slug: string) => void;
  markAsUnread: (slug: string) => void;
  isRead: (slug: string) => boolean;
  toggleRead: (slug: string) => void;
}

const ReadingProgressContext = createContext<ReadingProgressContextType | undefined>(undefined);

export function ReadingProgressProvider({ children }: { children: React.ReactNode }) {
  const [readArticles, setReadArticles] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('reading-progress');
    if (saved) {
      try {
        setReadArticles(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse reading progress', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('reading-progress', JSON.stringify(readArticles));
    }
  }, [readArticles, isLoaded]);

  const markAsRead = (slug: string) => {
    setReadArticles(prev => prev.includes(slug) ? prev : [...prev, slug]);
  };

  const markAsUnread = (slug: string) => {
    setReadArticles(prev => prev.filter(s => s !== slug));
  };

  const isRead = (slug: string) => readArticles.includes(slug);

  const toggleRead = (slug: string) => {
    if (isRead(slug)) {
      markAsUnread(slug);
    } else {
      markAsRead(slug);
    }
  };

  return (
    <ReadingProgressContext.Provider value={{ readArticles, markAsRead, markAsUnread, isRead, toggleRead }}>
      {children}
    </ReadingProgressContext.Provider>
  );
}

export function useReadingProgress() {
  const context = useContext(ReadingProgressContext);
  if (context === undefined) {
    throw new Error('useReadingProgress must be used within a ReadingProgressProvider');
  }
  return context;
}
