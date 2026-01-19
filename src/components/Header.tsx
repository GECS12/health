'use client';

import Link from 'next/link'
import { Search, Command, Menu, List } from 'lucide-react'
import { useMobileMenu } from '@/context/MobileMenuContext'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const { toggleSidebar, toggleTOC } = useMobileMenu()

  return (
    <header className="top-header">
      <div className="header-left-container">
        {/* Logo/Sidebar toggle (mostly hidden on desktop via CSS) */}
        <div className="header-left mobile-hide-desktop">
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
      </div>
      
      {/* Centralized Search Pill - Desktop Only */}
      <div className="header-center desktop-only">
        <div className="toc-top-actions">
          <button 
            className="search-trigger-wide" 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            title="Pesquisar"
          >
            <Search size={16} />
            <span className="search-text">Clique ou escreva para pesquisar...</span>
            <div className="search-trigger-shortcut">⌘K</div>
          </button>
          <ThemeToggle className="theme-toggle-desktop" />
        </div>
      </div>

      <div className="header-right-container">
        {/* Mobile controls - Strictly mobile-only */}
        <div className="mobile-controls-group mobile-only">
          <button 
            className="search-bar-trigger" 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          <button 
            className="toc-mobile-toggle"
            onClick={toggleTOC}
            aria-label="Toggle contents"
          >
            <List size={20} />
          </button>

          <ThemeToggle className="theme-toggle" />
        </div>
        
        {/* Secondary Desktop Link */}
        <Link href="/admin" className="editor-link desktop-only">
          Editor
        </Link>
      </div>
    </header>
  )
}
