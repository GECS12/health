'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Check, GripHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ImageResizerProps {
  documentId: string;
  blockKey: string;
  initialWidth: number | string; // 1-100 or '100%'
  isDraftMode?: boolean;
  children: React.ReactNode;
}

function ImageResizerContent({ documentId, blockKey, initialWidth, isDraftMode, children }: ImageResizerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  
  // Parse initial width to number
  const startWidth = typeof initialWidth === 'string' 
    ? parseInt(initialWidth.replace('%', '')) 
    : (initialWidth || 100);
    
  const [width, setWidth] = useState(startWidth);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Debounce timeout ref
  const debounceTimer = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    // Show if:
    // 1. In Draft Mode (from prop)
    // 2. In Development
    // 3. URL has ?admin=true
    // 4. URL has ?admin_key or localStorage has it
    
    const urlKey = searchParams.get('admin_key') || searchParams.get('admin_access_key');
    const storedKey = localStorage.getItem('admin_access_key');
    
    if (isDraftMode || process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    } else if (urlKey) {
      localStorage.setItem('admin_access_key', urlKey);
      setIsVisible(true);
      
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('admin_key');
      url.searchParams.delete('admin_access_key');
      window.history.replaceState({}, '', url);
    } else if (storedKey) {
      setIsVisible(true);
    }
  }, [isDraftMode, searchParams]);

  const updateWidth = async (newWidth: number) => {
    setWidth(newWidth);
    setIsSaved(false);
    
    // Clear existing timer
    if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
    }

    // Set new timer for API call (debounce 800ms)
    debounceTimer.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        const savedKey = localStorage.getItem('admin_access_key');
        if (savedKey) {
          headers['x-admin-key'] = savedKey;
        }

        const response = await fetch('/api/sanity/resize-image', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            documentId,
            blockKey,
            width: newWidth,
          }),
        });

        let data;
        try {
          data = await response.json();
        } catch (e) {
          data = { message: `Server error (${response.status})` };
        }

        if (response.ok) {
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
          router.refresh(); 
        } else {
          console.error('Resize failed:', response.status, data.message);
          alert(`Resize failed: ${data.message}`);
        }
      } catch (error) {
        console.error('Error updating image width:', error);
      } finally {
        setIsSaving(false);
      }
    }, 800);
  };

  const handlePreset = (preset: number) => {
    updateWidth(preset);
  };

  if (!isVisible) {
    return <div style={{ width: `${width}%` }} className="mx-auto transition-[width] duration-300">{children}</div>;
  }

  return (
    <div 
      className="relative group mx-auto transition-[width] duration-300" 
      style={{ width: `${width}%`, maxWidth: '100%' }}
    >
      {/* Resizer Controls Overlay */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 
        bg-white/90 backdrop-blur-sm shadow-md rounded-full px-4 py-2 
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        flex items-center gap-3 border border-gray-200"
      >
        <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
          <GripHorizontal size={14} />
          <span>{width}%</span>
        </div>

        {/* Slider */}
        <input 
          type="range" 
          min="25" 
          max="100" 
          step="5"
          value={width} 
          onChange={(e) => updateWidth(parseInt(e.target.value))}
          className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        {/* Presets */}
        <div className="flex items-center gap-1 border-l border-gray-300 pl-2 ml-1">
          {[25, 50, 75, 100].map((preset) => (
            <button
              key={preset}
              onClick={() => handlePreset(preset)}
              className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold transition-colors
                ${width === preset 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:bg-gray-100'}`}
              title={`${preset}%`}
            >
              {preset === 100 ? 'FULL' : preset}
            </button>
          ))}
        </div>

        {/* Status Indicator */}
        <div className="w-4 flex justify-center">
          {isSaving ? (
            <Loader2 size={14} className="animate-spin text-blue-500" />
          ) : isSaved ? (
            <Check size={14} className="text-green-500" />
          ) : null}
        </div>
      </div>

      {children}
    </div>
  );
}

export function ImageResizer(props: ImageResizerProps) {
  return (
    <Suspense fallback={<div style={{ width: '100%' }}>{props.children}</div>}>
      <ImageResizerContent {...props} />
    </Suspense>
  );
}
