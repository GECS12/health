'use client';

import Link from 'next/link'
import { Search, Command, Menu, List } from 'lucide-react'
import { useMobileMenu } from '@/context/MobileMenuContext'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const { toggleSidebar, toggleTOC } = useMobileMenu()

  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="mobile-menu-toggle"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <Link href="/" className="logo">
          Saúde e Nutrição
        </Link>
      </div>
      
      <div className="header-right">
        <button className="search-bar-trigger" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
          <Search size={16} />
          <span className="desktop-only">Pesquisar</span>
          <div className="search-shortcut desktop-only">
             <Command size={10} /> K
          </div>
        </button>

        <button 
          className="toc-mobile-toggle"
          onClick={toggleTOC}
          aria-label="Toggle contents"
        >
          <List size={20} />
        </button>

        <ThemeToggle className="theme-toggle" />
        
        <Link href="/admin" className="editor-link">
          Editor
        </Link>
      </div>
    </header>
  )
}
