'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useMobileMenu } from '@/context/MobileMenuContext';
import { usePathname } from 'next/navigation';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const { closeAll } = useMobileMenu();
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.portable-text h2, .portable-text h3'))
      .map((elem) => ({
        id: elem.id,
        text: elem.textContent || '',
        level: Number(elem.tagName.substring(1)),
      }));
    setHeadings(elements);

    const observer = new IntersectionObserver(
      (entries) => {
        // Track which headings are in view and their positions
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        // rootMargin focuses on a narrow band near the top of the viewport
        rootMargin: '-10% 0% -70% 0%', 
        threshold: 0 
      }
    );

    const headingElements = document.querySelectorAll('.portable-text h2, .portable-text h3');
    headingElements.forEach((elem) => observer.observe(elem));

    // Fallback: Check scroll position if no heading is intersecting (e.g. at the very top)
    const handleScroll = () => {
      if (window.scrollY < 100 && headings.length > 0) {
        setActiveId(headings[0].id);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]); // Only re-run when the route changes

  if (headings.length === 0) return null;

  return (
    <nav className="toc-nav">
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={`toc-link level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(heading.id)?.scrollIntoView({
              behavior: 'smooth'
            });
            closeAll();
          }}
        >
          {heading.level === 3 && <ChevronRight size={10} className="toc-level-icon" />}
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
