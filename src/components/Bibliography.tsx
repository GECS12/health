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

  const formatAuthors = (authors: string[]) => {
    if (authors.length === 0) return 'Unknown Author';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    return `${authors.slice(0, -1).join(', ')}, & ${authors[authors.length - 1]}`;
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
            <a 
              href={`#cite-ref-${index + 1}`} 
              className="back-link-to-citation" 
              title={`Voltar para citação ${index + 1}`}
              style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
            >
              <div className="reference-line">
                <em>
                  {index + 1} – {formatAuthors(citation.authors)}. {citation.title}. {' '}
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
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
