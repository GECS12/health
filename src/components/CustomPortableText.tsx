import React from 'react'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { urlFor } from '../lib/sanity'
import Image from 'next/image'
import { EditButton } from './EditButton'
import { YouTubePlayer } from './YouTubePlayer'

const Citation = ({ children }: { children: any }) => {
  const text = Array.isArray(children) ? children[0] : children
  if (typeof text !== 'string') return children

  // Only match EXPLICIT bracketed citation patterns:
  // e.g. "texto [1]" or "texto [1,2,3]"
  const tokens = text.split(/(\[\d+(?:,\s*\d+)*\])/g)
  
  return tokens.map((token, i) => {
    // Check if it's a bracketed citation [1] or [1,2]
    const bracketMatch = token.match(/^\[([\d+,\s*]+)\]$/)
    if (bracketMatch) {
      const content = bracketMatch[1]
      const nums = content.split(',').map(n => n.trim())
      
      return (
        <span key={i} className="citation-wrapper">
          {nums.map((num, j) => (
            <span key={j} id={`cite-ref-${num}`} style={{ scrollMarginTop: '100px' }}>
              {j > 0 && ','}
              <a href={`#ref-${num}`} className="citation-link">
                {num}
              </a>
            </span>
          ))}
        </span>
      )
    }
    
    return token
  })
}

const getLeafText = (node: any): string => {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(getLeafText).join('')
  if (node?.props?.children) return getLeafText(node.props.children)
  return ''
}

const ReferenceItem = ({ children }: { children: any }) => {
  const text = getLeafText(children)
  const refMatch = text.match(/^(\d+)\s*[–\-\—\.\)]\s+/)
  
  if (refMatch) {
    const refNumber = refMatch[1]
    return (
      <div 
        id={`ref-${refNumber}`} 
        className="reference-item"
        style={{ scrollMarginTop: '100px' }}
      >
        <a 
          href={`#cite-ref-${refNumber}`}
          className="back-link-to-citation"
          title={`Voltar para citação ${refNumber}`}
          style={{ 
            color: 'inherit', 
            textDecoration: 'none',
            display: 'block'
          }}
        >
          {children}
        </a>
      </div>
    )
  }
  return children
}

const CitationsWrapper = ({ children, isReference }: { children: any, isReference?: boolean }) => {
  // 1. Recursive renderer for normal text (preserving inline flow)
  if (!isReference) {
    const processNodes = (node: any): any => {
      if (node === null || node === undefined || typeof node === 'boolean') return null;
      if (typeof node === 'string') {
        return <Citation>{node}</Citation>;
      }
      if (Array.isArray(node)) {
        return node.map((child, i) => <React.Fragment key={i}>{processNodes(child)}</React.Fragment>);
      }
      return node;
    }
    return <>{processNodes(children)}</>;
  }

  // 2. Specialized logic for bibliography items (handling Smart Grouping and blocks)
  const isBreakOrEmpty = (node: any): boolean => {
    if (!node) return true;
    if (typeof node === 'string') {
      // Remove common whitespace and see if anything is left
      const cleaned = node.replace(/[\s\n\r\t\u00A0\u200B]+/g, '').trim();
      return cleaned.length === 0;
    }
    if (Array.isArray(node)) return node.length === 0 || node.every(isBreakOrEmpty);
    if (typeof node === 'object') {
      const type = node.type;
      const typeName = typeof type === 'string' ? type.toLowerCase() : (type?.name?.toLowerCase() || type?.displayName?.toLowerCase() || '');
      
      if (typeName === 'br' || node.props?.node?._type === 'break' || node.props?.node?._type === 'break') return true;
      
      // If it's a wrapper, check its children
      if (node.props?.children) {
        return isBreakOrEmpty(node.props.children);
      }
      
      // If it has no children and is not a "known" contentful element, consider it empty
      // but let's be safe and only consider it empty if it matches our "void-like" criteria
      if (['hr', 'img', 'video', 'iframe'].includes(typeName)) return false;
      return !node.props?.children;
    }
    return false;
  }

  const collectNodes = (node: any): any[] => {
    if (isBreakOrEmpty(node)) return [];
    
    if (typeof node === 'string') {
      return node.split('\n').filter(line => !isBreakOrEmpty(line));
    }
    if (Array.isArray(node)) {
      return node.flatMap(collectNodes);
    }
    return [node];
  }

  const nodes = (Array.isArray(children) ? children : [children]).flatMap(collectNodes);
  
  const groups: any[][] = [];
  nodes.forEach(node => {
    const text = getLeafText(node);
    const isNewRef = text.match(/^\d+\s*[–\-\—\.\)]\s+/);
    
    if (isNewRef || groups.length === 0) {
      groups.push([node]);
    } else {
      groups[groups.length - 1].push(node);
    }
  });

  return (
    <>
      {groups.map((group, i) => {
        const firstNode = group[0];
        const firstText = getLeafText(firstNode);
        const refMatch = firstText.match(/^(\d+)\s*[–\-\—\.\)]\s+/);
        const refNumber = refMatch ? refMatch[1] : null;

        const content = group
          .map((item, j) => {
            if (isBreakOrEmpty(item)) return null;
            const renderedItem = typeof item === 'string' ? <Citation>{item}</Citation> : item;
            if (isBreakOrEmpty(renderedItem)) return null;
            return <React.Fragment key={j}>{renderedItem}</React.Fragment>;
          })
          .filter(Boolean);

        if (content.length === 0 && !refNumber) return null; // Only return null if no content and no refNumber

        if (refNumber) {
          // Extract the separator used (usually ' –' or '.')
          const match = firstText.match(/^\d+\s*([–\-\—\.\)])\s+/);
          const separatorChar = match ? match[1] : '–';
          
          return (
            <div 
              key={i} 
              id={`ref-${refNumber}`} 
              className="reference-item"
              style={{ scrollMarginTop: '100px' }}
            >
              <div className="reference-line">
                <a 
                  href={`#cite-ref-${refNumber}`}
                  className="back-link-to-citation"
                  title={`Voltar para citação ${refNumber}`}
                  style={{ 
                    color: 'var(--accent-color)', 
                    fontWeight: 'bold',
                    marginRight: '4px',
                    textDecoration: 'none'
                  }}
                >
                  {refNumber} {separatorChar}
                </a>
                {/* 
                   We keep 'content' as is because removing the prefix from the VDOM tree is complex.
                   Instead, the user will now see: [BackLink Number] [Original Reference Text (which includes number)]
                   Wait, that's not ideal. The the bibliography component I manually formatted it.
                   Here, Word imports often have the number IN the text.
                   If we just want to allow hyperlinks, the key is to NOT wrap the whole block in one <a> tag.
                */}
                <em>{content}</em> 
              </div>
            </div>
          );
        }

        return <div key={i} className="reference-item-plain"><div className="reference-line"><em>{content}</em></div></div>;
      })}
    </>
  );
}


const getComponents = (documentId?: string, isDraftMode?: boolean): PortableTextComponents => ({
  types: {
    image: ({ value, isInline }) => {
      if (!value?.asset?._ref && !value?.asset?._id) {
        return null
      }
      
      // Get image URL with dimensions
      const imageUrl = urlFor(value).url()
      
      // Extract dimensions from asset reference
      // Format: image-{hash}-{width}x{height}-{format}
      const assetRef = value.asset?._ref || value.asset?._id || ''
      const dimensionsMatch = assetRef.match(/-(\d+)x(\d+)-/)
      
      // Use actual dimensions if available, otherwise use reasonable defaults
      const width = dimensionsMatch ? parseInt(dimensionsMatch[1]) : 1200
      const height = dimensionsMatch ? parseInt(dimensionsMatch[2]) : 800
      
      let maxWidth = '100%';
      let isFullWidth = false;
      
      if (value.imageWidth) {
        maxWidth = `${value.imageWidth}%`;
      } else if (typeof value.size === 'number') {
        maxWidth = `${value.size}%`;
      } else {
        const size = value.size || 'large';
        if (size === 'full') isFullWidth = true;
        
        const sizeMap: Record<string, string> = {
          small: '50%',
          medium: '75%',
          large: '100%',
          full: '100%'
        };
        maxWidth = sizeMap[size] || '100%';
      }
      
      return (
        <figure className="my-10 text-center relative group">
          <Image
            src={imageUrl}
            alt={value.alt || 'article image'}
            width={width}
            height={height}
            className="rounded-lg shadow-sm mx-auto"
            style={{ 
              maxWidth: maxWidth,
              width: isFullWidth ? '100%' : 'auto', 
              height: 'auto'
            }}
            loading={isInline ? 'lazy' : 'eager'}
            priority={!isInline}
          />

          {value.caption && (
            <figcaption className="mt-4 text-sm text-gray-500 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    youTube: ({ value }) => {
      if (!value?.url) return null
      return <YouTubePlayer url={value.url} caption={value.caption} />
    },
    video: ({ value }) => {
      if (!value?.url) return null
      return <YouTubePlayer url={value.url} caption={value.caption} />
    },
  },
  block: {
    normal: ({ children, value }) => {
      // Robustly get text from the block value
      const text = value?.children 
        ? value.children.map((c: any) => c.text).join('') 
        : (Array.isArray(children) ? children.join('') : (typeof children === 'string' ? children : ''));
      
      // Pattern to detect metadata lines from Word imports:
      // e.g., "Admin (https://...) May 24, 2017 No Comments..."
      const isMetadata = text.includes('Admin (') && (text.includes('No Comments') || text.includes('Comment ('))
      const isUrlOnly = text.match(/^https?:\/\/[^\s]+$/)
      
      if (isMetadata || isUrlOnly) return null
      
      // Detect if this block looks like it contains references
      const isReference = text.match(/^\d+\s*[–\-\—\.\)]\s+/)
      
      if (isReference) {
        return <CitationsWrapper isReference>{children}</CitationsWrapper>
      }
      
      return <div className="pt-paragraph"><CitationsWrapper>{children}</CitationsWrapper></div>
    },
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children, value }) => {
      const text = Array.isArray(children) ? children.join('') : (typeof children === 'string' ? children : '');
      const id = value._key || text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s-]+/g, '-');
      return <h2 id={id}>{children}</h2>;
    },
    h3: ({ children, value }) => {
      const text = Array.isArray(children) ? children.join('') : (typeof children === 'string' ? children : '');
      const id = value._key || text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s-]+/g, '-');
      return <h3 id={id}>{children}</h3>;
    },
    blockquote: ({ children }) => (
      <blockquote>
        {children}
      </blockquote>
    ),
    centered: ({ children }) => <div className="pt-centered">{children}</div>,
    'text-right': ({ children }) => <div className="pt-right">{children}</div>,
    'text-justify': ({ children }) => <div className="pt-justify">{children}</div>,
  },
  marks: {
    'color-red': ({ children }) => <span style={{ color: '#ef4444' }}>{children}</span>,
    'color-blue': ({ children }) => <span style={{ color: '#3b82f6' }}>{children}</span>,
    'color-green': ({ children }) => <span style={{ color: '#22c55e' }}>{children}</span>,
    'color-yellow': ({ children }) => <span style={{ color: '#eab308' }}>{children}</span>,
    'color-purple': ({ children }) => <span style={{ color: '#a855f7' }}>{children}</span>,
    'color-black': ({ children }) => <span style={{ color: '#000000' }}>{children}</span>,
    'color-gray': ({ children }) => <span style={{ color: '#6b7280' }}>{children}</span>,
    textColor: ({ children, value }) => (
      <span style={{ color: value?.value }}>{children}</span>
    ),
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span style={{ textDecoration: 'underline' }}>{children}</span>,
    'strike-through': ({ children }) => <del>{children}</del>,
    // Superscript for reference numbers
    sup: ({ children }) => (
      <sup style={{ fontSize: '0.75em', verticalAlign: 'super', color: '#3b82f6' }}>{children}</sup>
    ),
    // Reference link annotation - links to #ref-N anchor
    referenceLink: ({ children, value }) => (
      <a 
        href={`#ref-${value?.refNumber}`} 
        id={`cite-ref-${value?.refNumber}`}
        className="reference-link-inline"
        style={{ 
          fontSize: '0.75em', 
          verticalAlign: 'super', 
          color: '#3b82f6', 
          textDecoration: 'none',
          cursor: 'pointer',
          scrollMarginTop: '100px'
        }}
      >
        {children}
      </a>
    ),
    // Link annotation
    link: ({ children, value }) => (
      <a 
        href={value?.href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="portable-text-link"
      >
        {children}
      </a>
    ),
  },
})

export function CustomPortableText({ value, documentId, isDraftMode }: { value: any, documentId?: string, isDraftMode?: boolean }) {
  const components = getComponents(documentId, isDraftMode)
  return (
    <div className="portable-text">
      <PortableText value={value} components={components} />
    </div>
  )
}
