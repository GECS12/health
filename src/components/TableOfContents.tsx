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
  type: 'header' | 'quote' | 'citation';
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const { closeAll } = useMobileMenu();
  const pathname = usePathname();

  useEffect(() => {
    // Select container to scope our search
    const portableText = document.querySelector('.portable-text');
    if (!portableText) return;

    // Get all potential candidates including citation links
    const candidates = Array.from(portableText.querySelectorAll('h2, h3, blockquote, p, a.citation-link, a.reference-link-inline'));
    
    const validNodes: Element[] = [];
    const elements: TOCItem[] = [];

    candidates.forEach((elem, index) => {
      const tag = elem.tagName.toLowerCase();
      let rawText = '';
      let type: 'header' | 'quote' | 'citation' = 'header';
      let level = 2;

      // Helper to extract text with spaces to avoid "gordurasão"
      const extractTextWithSpaces = (node: Node): string => {
        let text = '';
        node.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            text += child.textContent;
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as Element;
            const isWordBreakTag = ['BR', 'P', 'DIV', 'SPAN', 'STRONG', 'B', 'EM', 'I'].includes(element.tagName);
            text += (isWordBreakTag ? ' ' : '') + extractTextWithSpaces(element) + (isWordBreakTag ? ' ' : '');
          }
        });
        return text;
      };

      // Handle Headers
      if (tag === 'h2') {
        rawText = extractTextWithSpaces(elem);
        level = 2;
      } else if (tag === 'h3') {
        rawText = extractTextWithSpaces(elem);
        level = 3;
      } 
      // Handle Blockquotes
      else if (tag === 'blockquote') {
        rawText = extractTextWithSpaces(elem);
        type = 'quote';
        level = 4;
      } 
      // Handle Paragraphs with Bold Start (Pseudo-headers)
      else if (tag === 'p') {
        const firstChild = elem.firstElementChild;
        if (firstChild && (firstChild.tagName === 'STRONG' || firstChild.tagName === 'B')) {
            const boldText = extractTextWithSpaces(firstChild).trim();
            const pText = extractTextWithSpaces(elem).trim();
            const isLikelyHeader = boldText.length > 2 && boldText.length < 100;

            if (isLikelyHeader && pText.startsWith(boldText)) {
              rawText = boldText;
              level = 4;
            } else {
              return;
            }
        } else {
          return;
        }
      }
      // Handle Citations
      else if (tag === 'a' && (elem.classList.contains('citation-link') || elem.classList.contains('reference-link-inline'))) {
        const refNum = elem.textContent?.trim() || '';
        if (!refNum) return;

        type = 'citation';
        level = 5;
        
        const parent = elem.closest('p, blockquote, li');
        if (parent) {
          const parentText = extractTextWithSpaces(parent).replace(/\s+/g, ' ').trim();
          const cleanText = parentText.replace(/\[\d+(?:[\s,\-]*\d+)*\]/g, '').trim();
          rawText = `[${refNum}] ${cleanText}`;
        } else {
          rawText = `[${refNum}] Referência`;
        }
      }

      if (rawText.trim()) {
        let displayText = rawText.replace(/\s+/g, ' ').trim();

        if (type !== 'citation') {
          displayText = displayText.replace(/\[\d+(?:[\s,\-]*\d+)*\]/g, ' ');
        }
        
        displayText = displayText.replace(/\s+([.,;!?])/g, '$1');
        displayText = displayText.replace(/\s+/g, ' ').trim();
        displayText = displayText.replace(/^[.,;!?\-\—\s]+|[.,;!?\-\—\s]+$/g, '');

        if (!displayText || displayText.length < 2) return;

        if (type !== 'citation' && displayText.length > 4 && displayText === displayText.toUpperCase()) {
            displayText = displayText.toLowerCase();
        }
        
        const limit = type === 'citation' ? 70 : 80;
        if (displayText.length > limit) {
          const cutPoint = displayText.lastIndexOf(' ', limit);
          displayText = (cutPoint > 0 ? displayText.substring(0, cutPoint) : displayText.substring(0, limit)) + '...';
        }

        if (type === 'citation') {
           const match = displayText.match(/^(\[\d+\]\s*)(.*)/);
           if (match) {
             const bracket = match[1];
             const rest = match[2];
             displayText = bracket + rest.charAt(0).toUpperCase() + rest.slice(1);
           }
        } else {
          displayText = displayText.charAt(0).toUpperCase() + displayText.slice(1);
        }

        let id = elem.id;
        if (!id) {
          const suffix = type === 'citation' ? `-cite-${index}` : '';
          id = rawText.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50) + suffix;
          if (!id) id = `item-${index}`;
          elem.id = id;
        }

        elements.push({ id, text: displayText, level, type });
        validNodes.push(elem);
      }
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

    validNodes.forEach((elem) => observer.observe(elem));

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
          const isQuote = heading.type === 'quote';
          const isCitation = heading.type === 'citation';
            
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`group relative flex items-start gap-3 transition-colors ${
                  isActive 
                    ? 'text-[var(--accent-color)] font-semibold' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                style={{
                  paddingLeft: heading.level === 3 ? '16px' : heading.level === 4 ? '32px' : heading.level === 5 ? '48px' : '0',
                  opacity: isCitation ? 0.75 : 1
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
              <div className="relative z-10 mt-[6px] flex h-2 w-2 items-center justify-center shrink-0">
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

                <span className={`leading-tight ${isQuote || isCitation ? 'font-serif italic text-xs mt-[-1px]' : 'text-sm'} ${isCitation ? 'opacity-90' : isQuote ? 'opacity-85' : ''}`}>
                  {isCitation ? (
                    <>
                      <span className="font-sans font-bold text-[var(--accent-color)] opacity-100 mr-1">
                        {heading.text.match(/^\[\d+\]/)?.[0]}
                      </span>
                      {heading.text.replace(/^\[\d+\]\s*/, '')}
                    </>
                  ) : heading.text}
                </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
