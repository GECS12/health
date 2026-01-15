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
      
      <ol className="bibliography-list">
        {citations.map((citation, index) => (
          <li 
            key={citation._id} 
            id={`ref-${citation._id}`}
            className="bibliography-item"
          >
            <span className="bibliography-number">{index + 1}.</span>
            <div className="bibliography-content">
              <span className="bibliography-authors">{formatAuthors(citation.authors)}</span>
              {' '}
              <span className="bibliography-year">({citation.year}).</span>
              {' '}
              <span className="bibliography-title">{citation.title}.</span>
              {' '}
              {citation.source && (
                <>
                  <span className="bibliography-source">{citation.source}</span>
                  {citation.volume && <>, {citation.volume}</>}
                  {citation.issue && <>({citation.issue})</>}
                  {citation.pages && <>, {citation.pages}</>}
                  .
                </>
              )}
              {citation.doi && (
                <div className="bibliography-doi">
                  DOI: <a href={`https://doi.org/${citation.doi}`} target="_blank" rel="noopener noreferrer">
                    {citation.doi}
                  </a>
                </div>
              )}
              {citation.url && !citation.doi && (
                <div className="bibliography-url">
                  <a href={citation.url} target="_blank" rel="noopener noreferrer" className="bibliography-link">
                    <ExternalLink size={14} />
                    <span>Acesso ao artigo</span>
                  </a>
                </div>
              )}
              {citation.notes && (
                <div className="bibliography-notes">{citation.notes}</div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
