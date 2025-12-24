'use client';

import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const scrollToTop = () => {
    const main = document.querySelector('.main-content');
    main?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button className="back-to-top" onClick={scrollToTop}>
      <ArrowUp size={16} />
      <span>Voltar ao topo</span>
    </button>
  );
}
