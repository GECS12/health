'use client';

import { ArrowUpRight } from 'lucide-react';

export function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button className="back-to-top" onClick={scrollToTop}>
      <span>Voltar ao topo</span>
      <ArrowUpRight size={14} strokeWidth={2.5} />
    </button>
  );
}
