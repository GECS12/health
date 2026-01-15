import { PortableText, PortableTextComponents } from '@portabletext/react'
import { urlFor } from '../lib/sanity'
import Image from 'next/image'

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
            <span key={j}>
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

const CitationsWrapper = ({ children }: { children: any }) => {
  if (Array.isArray(children)) {
    return children.map((child, i) => {
      if (typeof child === 'string') {
        return <Citation key={i}>{child}</Citation>
      }
      return child
    })
  }
  if (typeof children === 'string') {
    return <Citation>{children}</Citation>
  }
  return children
}

const components: PortableTextComponents = {
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
      
      return (
        <figure className="my-10 text-center">
          <Image
            src={imageUrl}
            alt={value.alt || 'article image'}
            width={width}
            height={height}
            className="rounded-lg shadow-sm mx-auto"
            style={{ 
              maxWidth: '100%', 
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
    video: ({ value }) => {
      if (!value?.url) return null
      
      // Extract video ID from YouTube or Vimeo URLs
      let embedUrl = ''
      const url = value.url
      
      // YouTube patterns
      const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
      if (youtubeMatch) {
        embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`
      }
      
      // Vimeo patterns
      const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/)
      if (vimeoMatch) {
        embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`
      }
      
      if (!embedUrl) {
        // If we can't parse it, just return the URL as a link
        return (
          <div className="my-8 text-center">
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {value.caption || 'Watch Video'}
            </a>
          </div>
        )
      }
      
      return (
        <figure className="my-10">
          <div className="video-container" style={{
            position: 'relative',
            paddingBottom: '56.25%', /* 16:9 aspect ratio */
            height: 0,
            overflow: 'hidden',
            maxWidth: '100%',
            borderRadius: '8px'
          }}>
            <iframe
              src={embedUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={value.caption || 'Embedded video'}
            />
          </div>
          {value.caption && (
            <figcaption className="mt-4 text-sm text-gray-500 italic text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
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
      
      // Detect reference lines: "1 – Text" or "1. Text" or "1) Text"
      // Covers: hyphen, en-dash, em-dash, dot, parenthesis
      const refMatch = text.match(/^(\d+)\s*[–\-\—\.\)]\s+/)
      
      if (refMatch) {
        const refNumber = refMatch[1]
        // Add scroll-margin-top for sticky headers/padding
        return <p id={`ref-${refNumber}`} className="reference-item" style={{ scrollMarginTop: '100px' }}><CitationsWrapper>{children}</CitationsWrapper></p>
      }
      
      return <p><CitationsWrapper>{children}</CitationsWrapper></p>
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
        className="reference-link-inline"
        style={{ 
          fontSize: '0.75em', 
          verticalAlign: 'super', 
          color: '#3b82f6', 
          textDecoration: 'none',
          cursor: 'pointer'
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
}

export function CustomPortableText({ value }: { value: any }) {
  return (
    <div className="portable-text">
      <PortableText value={value} components={components} />
    </div>
  )
}
