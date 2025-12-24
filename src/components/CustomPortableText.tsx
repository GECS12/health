import { PortableText, PortableTextComponents } from '@portabletext/react'
import { urlFor } from '../lib/sanity'
import Image from 'next/image'

const Citation = ({ children }: { children: any }) => {
  const text = Array.isArray(children) ? children[0] : children
  if (typeof text !== 'string') return children

  // Match numbers that:
  // 1. Are in brackets: [1]
  // 2. Are immediately following a letter (superscript-style): et al.7
  // 3. Are separated by commas: 7,8,9
  const parts = text.split(/(\[\d+\]|(?<=[a-zA-Z.])\d+(?=[,.\s]|$))/g)
  
  return parts.map((part, i) => {
    const citationMatch = part.match(/\[?(\d+)\]?/)
    if (citationMatch && part.length < 5) { // Simple safety check for short numbers
      const num = citationMatch[1]
      return (
        <a key={i} href={`#ref-${num}`} className="citation-link">
          {num}
        </a>
      )
    }
    return part
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
    image: ({ value }) => {
      if (!value?.asset?._ref && !value?.asset?._id) {
        return null
      }
      return (
        <figure className="my-10 text-center">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'article image'}
            width={800}
            height={500}
            className="rounded-lg shadow-sm mx-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          {value.caption && (
            <figcaption className="mt-4 text-sm text-gray-500 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    normal: ({ children }) => {
      const text = Array.isArray(children) ? children.join('') : (typeof children === 'string' ? children : '')
      
      // Pattern to detect metadata lines from Word imports:
      // e.g., "Admin (https://...) May 24, 2017 No Comments..."
      const isMetadata = text.includes('Admin (') && (text.includes('No Comments') || text.includes('Comment ('))
      const isUrlOnly = text.match(/^https?:\/\/[^\s]+$/)
      
      if (isMetadata || isUrlOnly) return null
      
      return <p><CitationsWrapper>{children}</CitationsWrapper></p>
    },
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children, value }) => {
      const id = value._key || Math.random().toString(36).substr(2, 9);
      return <h2 id={id}>{children}</h2>;
    },
    h3: ({ children, value }) => {
      const id = value._key || Math.random().toString(36).substr(2, 9);
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
  },
}

export function CustomPortableText({ value }: { value: any }) {
  return (
    <div className="portable-text">
      <PortableText value={value} components={components} />
    </div>
  )
}
