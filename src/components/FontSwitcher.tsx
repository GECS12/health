'use client';

import { Type } from 'lucide-react';
import { useEffect, useState } from 'react';

const FONTS = [
  { name: 'EB Garamond', family: "'EB Garamond', serif", url: 'EB+Garamond:ital,wght@0,400..800;1,400..800' },
  { name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", url: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400' },
  { name: 'Crimson Text', family: "'Crimson Text', serif", url: 'Crimson+Text:ital,wght@0,400;0,600;0,700;1,400' },
  { name: 'Libre Baskerville', family: "'Libre Baskerville', serif", url: 'Libre+Baskerville:ital,wght@0,400;0,700;1,400' },
  { name: 'Merriweather', family: "'Merriweather', serif", url: 'Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300' },
  { name: 'Lora', family: "'Lora', serif", url: 'Lora:ital,wght@0,400..700;1,400..700' },
  { name: 'Spectral', family: "'Spectral', serif", url: 'Spectral:ital,wght@0,200..800;1,200..800' },
  { name: 'Playfair Display', family: "'Playfair Display', serif", url: 'Playfair+Display:ital,wght@0,400..900;1,400..900' },
  { name: 'Baskervville', family: "'Baskervville', serif", url: 'Baskervville:ital@0;1' },
  { name: 'Domine', family: "'Domine', serif", url: 'Domine:wght@400..700' },
];

export function FontSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFont, setCurrentFont] = useState(FONTS[0]);

  useEffect(() => {
    // Load saved font from local storage
    const saved = localStorage.getItem('user-font-preference');
    if (saved) {
      const font = FONTS.find(f => f.name === saved);
      if (font) handleFontChange(font, false);
    }
  }, []);

  const handleFontChange = (font: typeof FONTS[0], save = true) => {
    setCurrentFont(font);
    if (save) localStorage.setItem('user-font-preference', font.name);
    setIsOpen(false);

    // 1. Inject Link Tag if not exists
    const linkId = `font-link-${font.name.replace(/\s+/g, '-')}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.href = `https://fonts.googleapis.com/css2?family=${font.url}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // 2. Set CSS Variable
    document.documentElement.style.setProperty('--font-serif', font.family);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all font-serif italic text-lg"
        title="Change Font"
      >
        <span className="font-serif">Aa</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Escolha a Fonte</h3>
          </div>
          <div className="max-h-[60vh] overflow-y-auto py-1">
            {FONTS.map((font) => (
              <button
                key={font.name}
                onClick={() => handleFontChange(font)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  currentFont.name === font.name ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <span style={{ fontFamily: font.family, fontSize: '16px' }}>
                  {font.name}
                </span>
                {currentFont.name === font.name && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
