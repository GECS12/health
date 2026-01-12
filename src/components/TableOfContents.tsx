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
  type: 'header' | 'quote';
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

    // Get all potential candidates
    const candidates = Array.from(portableText.querySelectorAll('h2, h3, blockquote, p'));
    
    const validNodes: Element[] = [];
    const elements: TOCItem[] = [];

    candidates.forEach((elem, index) => {
      const tag = elem.tagName.toLowerCase();
      let text = '';
      let type: 'header' | 'quote' = 'header';
      let level = 2;

      // Handle Headers
      if (tag === 'h2') {
        text = elem.textContent || '';
        level = 2;
      } else if (tag === 'h3') {
        text = elem.textContent || '';
        level = 3;
      } 
      // Handle Blockquotes
      else if (tag === 'blockquote') {
        text = elem.textContent || '';
        type = 'quote';
        level = 4;
      } 
      // Handle Paragraphs with Bold Start (Pseudo-headers)
      else if (tag === 'p') {
        const firstChild = elem.firstElementChild;
        // Check if first child is STRONG or B
        if (firstChild && (firstChild.tagName === 'STRONG' || firstChild.tagName === 'B')) {
           const boldText = (firstChild.textContent || '').trim();
           
           // Ensure the paragraph actually STARTS with this bold text 
           // (prevents picking up bold text from middle of sentences)
           const pText = (elem.textContent || '').trim();
           
           // HEURISTIC: An "index" entry (header) is usually short. 
           // If the bold text is very long (e.g. > 80 chars), it is likely just an emphasized paragraph, not a header.
           const isLikelyHeader = boldText.length > 2 && boldText.length < 80;

           if (isLikelyHeader && pText.startsWith(boldText)) {
             text = boldText;
             level = 4; // Treat as smallest header
           }
        }
      }

      // If we found valid text, process it
      if (text.trim()) {
        // Smart Truncation & Formatting
        let displayText = text.trim();
        
        // 1. Clean up excessive whitespace
        displayText = displayText.replace(/\s+/g, ' ');

        // 2. Truncate if too long (e.g., > 60 chars) - Redundant if we have the <80 check, but safe for H2/H3
        if (displayText.length > 60) {
          // Find the last space within the limit to avoid cutting words
          const cutPoint = displayText.lastIndexOf(' ', 60);
          if (cutPoint > 0) {
            displayText = displayText.substring(0, cutPoint) + '...';
          } else {
            displayText = displayText.substring(0, 60) + '...';
          }
        }
        
        // 3. Normalize casing: lowercased (unless proper noun likelihood low) with Capitalized first letter
        // If it was ALL CAPS, fix it.
        if (displayText.length > 4 && displayText === displayText.toUpperCase()) {
            displayText = displayText.toLowerCase();
        }
        // Always capitalize first letter
        displayText = displayText.charAt(0).toUpperCase() + displayText.slice(1);

        let id = elem.id;
        if (!id) {
          id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .substring(0, 50);
          
          if (!id) id = `item-${index}`;
          elem.id = id;
        }

        elements.push({
          id,
          text: displayText,
          level,
          type
        });
        
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
                paddingLeft: heading.level === 3 ? '16px' : heading.level === 4 ? '12px' : '0'
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

              <span className={`leading-tight ${isQuote ? 'font-serif italic text-xs opacity-85 mt-[-1px]' : 'text-sm'}`}>
                {heading.text}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
