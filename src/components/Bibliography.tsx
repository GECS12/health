import React from 'react';
import { ExternalLink } from 'lucide-react';

interface CitationData {
  _id: string;
  citationId: string;
  authors: string[];
  year: number;
  title: string;
  source?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  notes?: string;
}

interface BibliographyProps {
  citations: CitationData[];
}

export function Bibliography({ citations }: BibliographyProps) {
  if (!citations || citations.length === 0) {
    return null;
  }

  const robustClean = (text: string) => {
    if (!text) return '';
    // 1. Strip HTML tags
    let cleaned = text.replace(/<[^>]*>?/gm, '');
    
    // 2. Aggressively strip leading numbers, symbols, and separators (recursive)
    // Using explicit character set for maximum compatibility
    const noiseRegex = /^[0-9\s\u00A0\-\–\—\.\:\,\;\(\)\[\]\#\/\\]+/;
    let last;
    do {
      last = cleaned;
      cleaned = cleaned.replace(noiseRegex, '').trim();
    } while (cleaned !== last);
    return cleaned;
  };

  const formatAuthors = (authors: string[]) => {
    let text = 'Unknown Author';
    if (authors && authors.length === 1) text = authors[0];
    else if (authors && authors.length === 2) text = `${authors[0]} & ${authors[1]}`;
    else if (authors && authors.length > 2) text = `${authors.slice(0, -1).join(', ')}, & ${authors[authors.length - 1]}`;
    
    return robustClean(text);
  };

  const cleanTitle = (title: string) => {
    return robustClean(title);
  };

  return (
    <section className="article-bibliography">
      <div className="bibliography-header">
        <h2>Referências</h2>
      </div>
      
      <div className="references-group">
        {citations.map((citation, index) => (
          <div 
            key={citation._id} 
            id={`ref-${index + 1}`}
            className="reference-item"
            style={{ scrollMarginTop: '100px' }}
          >
            <div className="reference-line">
              <a 
                href={`#cite-ref-${index + 1}`} 
                className="back-link-to-citation" 
                title={`Voltar para citação ${index + 1}`}
                style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginRight: '4px', textDecoration: 'none' }}
              >
                {`${index + 1} – `}
              </a>
              
              {citation.url ? (
                <a 
                  href={citation.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="external-reference-link"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <em>
                    {formatAuthors(citation.authors)}. {cleanTitle(citation.title)}. {' '}
                    {citation.source && (
                      <>
                        {citation.source}
                        {citation.volume && <>; {citation.volume}</>}
                        {citation.issue && <>({citation.issue})</>}
                        {citation.pages && <>: {citation.pages}</>}
                        .
                      </>
                    )}
                  </em>
                  <ExternalLink size={12} style={{ display: 'inline-block', marginLeft: '6px', opacity: 0.6 }} />
                </a>
              ) : (
                <em>
                  {formatAuthors(citation.authors)}. {cleanTitle(citation.title)}. {' '}
                  {citation.source && (
                    <>
                      {citation.source}
                      {citation.volume && <>; {citation.volume}</>}
                      {citation.issue && <>({citation.issue})</>}
                      {citation.pages && <>: {citation.pages}</>}
                      .
                    </>
                  )}
                </em>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
