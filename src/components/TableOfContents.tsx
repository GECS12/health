'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useMobileMenu } from '@/context/MobileMenuContext';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

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
      .map((elem, index) => {
        let id = elem.id;
        if (!id) {
          const text = elem.textContent || '';
          id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          
          if (!id) id = `heading-${index}`; // Fallback if text is empty/special chars
          elem.id = id;
        }

        return {
          id,
          text: elem.textContent || '',
          level: Number(elem.tagName.substring(1)),
        };
      });
    setHeadings(elements);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-10% 0% -70% 0%', 
        threshold: 0 
      }
    );

    const headingElements = document.querySelectorAll('.portable-text h2, .portable-text h3');
    headingElements.forEach((elem) => observer.observe(elem));

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
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc-nav relative pl-4">
      {/* Vertical Track Line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-neutral-200 dark:bg-neutral-800" />

      <div className="flex flex-col gap-3">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`group relative flex items-start gap-3 text-sm transition-colors ${
                isActive 
                  ? 'text-[var(--accent-color)] font-semibold' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              style={{
                paddingLeft: heading.level === 3 ? '16px' : '0'
              }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth'
                });
                setActiveId(heading.id);
                closeAll();
              }}
            >
              <div className="relative z-10 mt-[6px] flex h-2 w-2 items-center justify-center">
                {/* Static base dot for inactive state */}
                <span className={`absolute h-1 w-1 rounded-full transition-colors duration-200 ${
                   isActive ? 'bg-transparent' : 'bg-neutral-300 dark:bg-neutral-600 group-hover:bg-neutral-400'
                }`} />
                
                {/* Moving Active Bullet */}
                {isActive && (
                  <motion.span
                    layoutId="active-toc-bullet"
                    className="absolute h-2 w-2 rounded-full bg-[var(--accent-color)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>

              <span className="leading-tight">
                {heading.text}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
