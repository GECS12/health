'use client';

import { useEffect, useState } from 'react';

export function SkipToContent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip link when Tab is pressed (keyboard navigation)
      if (e.key === 'Tab' && !isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.querySelector('.main-content') || document.querySelector('main');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Focus the main content for screen readers
      (mainContent as HTMLElement).focus();
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className={`skip-to-content ${isVisible ? 'visible' : ''}`}
      aria-label="Saltar para o conteúdo principal"
    >
      Saltar para o conteúdo
    </a>
  );
}

