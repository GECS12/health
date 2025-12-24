'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { client } from '@/lib/sanity';

interface SearchResult {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
}

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle with Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchArticles = async () => {
      setIsLoading(true);
      try {
        const searchResults = await client.fetch(`
          *[_type == "post" && (title match $search || pt::text(body) match $search)][0...10] {
            _id,
            title,
            "slug": slug.current,
            "fullText": pt::text(body)
          }
        `, { search: `*${query}*` });
        
        // Find the matching excerpt for each result
        const resultsWithExcerpt = searchResults.map((result: any) => {
          let excerpt = '';
          if (result.fullText) {
            const lowerText = result.fullText.toLowerCase();
            const lowerQuery = query.toLowerCase();
            const matchIndex = lowerText.indexOf(lowerQuery);
            
            if (matchIndex !== -1) {
              // Get context around the match (50 chars before, 100 after)
              const start = Math.max(0, matchIndex - 50);
              const end = Math.min(result.fullText.length, matchIndex + query.length + 100);
              excerpt = (start > 0 ? '...' : '') + 
                        result.fullText.slice(start, end) + 
                        (end < result.fullText.length ? '...' : '');
            } else {
              // Fallback: show beginning of text
              excerpt = result.fullText.slice(0, 150) + '...';
            }
          }
          return {
            _id: result._id,
            title: result.title,
            slug: result.slug,
            excerpt
          };
        });
        
        setResults(resultsWithExcerpt);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchArticles, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={() => setIsOpen(false)}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <Search size={18} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar artigos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-close" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="search-results">
          {isLoading && (
            <div className="search-loading">
              <Loader2 size={20} className="spin" />
              <span>Pesquisando...</span>
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="search-empty">
              Nenhum resultado encontrado para "{query}"
            </div>
          )}

          {!isLoading && results.map(result => (
            <Link
              key={result._id}
              href={`/${result.slug}`}
              className="search-result-item"
              onClick={() => setIsOpen(false)}
            >
              <FileText size={16} />
              <div className="search-result-content">
                <span className="search-result-title">{result.title}</span>
                {result.excerpt && (
                  <span className="search-result-excerpt">
                    {result.excerpt}...
                  </span>
                )}
              </div>
            </Link>
          ))}

          {!query && (
            <div className="search-hint">
              Digite para pesquisar artigos
            </div>
          )}
        </div>

        <div className="search-footer">
          <span className="search-shortcut">ESC</span> para fechar
        </div>
      </div>
    </div>
  );
}

export function SearchTrigger() {
  const handleOpen = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <button className="search-trigger" onClick={handleOpen}>
      <Search size={14} />
      <span>Pesquisar</span>
      <div className="search-trigger-shortcut">⌘K</div>
    </button>
  );
}
