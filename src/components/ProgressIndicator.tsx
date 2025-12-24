'use client';

import { useEffect, useState } from 'react';

export function ProgressIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Track window scroll for page-level progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const totalScroll = documentHeight - windowHeight;
      const currentProgress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;

      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="global-progress-container">
      <div className="global-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}
