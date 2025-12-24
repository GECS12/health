'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavItem {
  title: string;
  slug: string;
}

interface NavData {
  prev: NavItem | null;
  next: NavItem | null;
}

export function ArticleNavigation() {
  const pathname = usePathname();
  const [navData, setNavData] = useState<NavData>({ prev: null, next: null });

  useEffect(() => {
    // Look for navigation data injected by the page
    const dataEl = document.getElementById('article-nav-data');
    if (dataEl) {
      try {
        const data = JSON.parse(dataEl.textContent || '{}');
        setNavData(data);
      } catch (e) {
        console.error('Failed to parse nav data', e);
      }
    }
  }, [pathname]);

  if (!navData.prev && !navData.next) return null;

  return (
    <div className="toc-article-nav">
      <div className="toc-nav-links">
        {navData.prev && (
          <Link href={`/${navData.prev.slug}`} className="toc-nav-link prev">
            <span className="toc-nav-label">
              <ArrowLeft size={10} strokeWidth={3} />
              Anterior
            </span>
            <span className="toc-nav-title">{navData.prev.title}</span>
          </Link>
        )}
        {navData.next && (
          <Link href={`/${navData.next.slug}`} className="toc-nav-link next">
            <span className="toc-nav-label">
              Seguinte
              <ArrowRight size={10} strokeWidth={3} />
            </span>
            <span className="toc-nav-title">{navData.next.title}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
