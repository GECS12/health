'use client';

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, Search, Command } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])

  return (
    <header className="top-header">
      <Link href="/" className="logo">
        Saúde e Nutrição
      </Link>
      
      <div className="header-right">
        <div className="search-bar">
          <Search size={16} />
          <span>Pesquisar</span>
          <div className="search-shortcut">
             <Command size={10} /> K
          </div>
        </div>

        <button 
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {mounted && (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
        </button>
        
        <Link href="/admin" className="editor-link">
          Editor
        </Link>
      </div>
    </header>
  )
}
