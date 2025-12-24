'use client';

import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button className="back-to-top" onClick={scrollToTop} aria-label="Voltar ao topo">
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
}
