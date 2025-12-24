'use client';

import { useEffect, useState } from 'react';

export function ProgressIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('.main-content');
      if (!mainContent) return;

      const { scrollTop, scrollHeight, clientHeight } = mainContent;
      const totalScroll = scrollHeight - clientHeight;
      const currentProgress = (scrollTop / totalScroll) * 100;

      setProgress(currentProgress);
    };

    const mainContent = document.querySelector('.main-content');
    mainContent?.addEventListener('scroll', handleScroll);
    return () => mainContent?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="global-progress-container">
      <div className="global-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}
