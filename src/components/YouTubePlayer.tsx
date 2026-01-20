'use client'

import React, { useEffect, useState } from 'react'

interface YouTubePlayerProps {
  url: string
  caption?: string
}

export function YouTubePlayer({ url, caption }: YouTubePlayerProps) {
  const [hasWindow, setHasWindow] = useState(false)

  useEffect(() => {
    setHasWindow(true)
  }, [])

  // Helper to ensure we have a valid embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    
    // YouTube patterns
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    
    // Vimeo patterns
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/)
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    
    return url
  }

  const embedUrl = getEmbedUrl(url)

  if (!hasWindow) return null

  return (
    <figure className="my-10" style={{ width: '100%', clear: 'both' }}>
      <div 
        className="video-wrapper overflow-hidden rounded-lg shadow-md bg-neutral-900" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          paddingBottom: '56.25%', // 16:9 Aspect Ratio
          height: 0,
          backgroundColor: '#171717' // neutral-900 fallback
        }}
      >
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
          loading="lazy"
          title={caption || 'Embedded video'}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-sm text-gray-500 italic text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
