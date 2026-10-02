'use client';

import Link from 'next/link'
import { Search, Menu, List } from 'lucide-react'
import { useMobileMenu } from '@/context/MobileMenuContext'
import { ThemeToggle } from './ThemeToggle'
import { FontSizeControl } from './FontSizeControl'
import { useSidebarState } from '@/context/SidebarStateContext'

interface Section {
  _id: string
  title: string
  subSections: Section[]
  posts: { title: string; slug: string }[]
}

const getAllSectionIds = (sections: Section[]): string[] => {
  let ids: string[] = []
  sections.forEach((sec) => {
    ids.push(sec._id)
    if (sec.subSections) {
      ids = ids.concat(getAllSectionIds(sec.subSections))
    }
  })
  return ids
}

export function Header({
  tree = [],
  siteTitle,
  siteAuthor,
}: {
  tree?: Section[]
  siteTitle?: string
  siteAuthor?: string
}) {
  const { toggleSidebar, toggleTOC } = useMobileMenu()
  const { collapseAll, setExpandedSections, expandedSections } = useSidebarState()

  const allSectionIds = getAllSectionIds(tree)
  const isExpanded = allSectionIds.length === 0
    ? true
    : expandedSections.size >= allSectionIds.length * 0.5

  const handleToggle = () => {
    if (isExpanded) {
      collapseAll()
    } else {
      setExpandedSections(new Set(allSectionIds))
    }
  }

  return (
    <header className="top-header">
      {/* Desktop: branding sits in the left column (aligned with sidebar) */}
      <div className="header-brand-cell desktop-only">
        <Link href="/" className="home-link sidebar-branding header-branding">
          <span className="section-title-text">{siteTitle || 'Realidade'}</span>
          {siteAuthor ? (
            <span className="sidebar-branding-author">{siteAuthor}</span>
          ) : null}
        </Link>
      </div>

      <div className="header-toolbar">
        <div className="header-left-container">
          <div className="header-left">
            <button
              className="mobile-menu-toggle"
              onClick={toggleSidebar}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="logo">
              {siteTitle || 'Realidade'}
            </Link>
          </div>
        </div>

        <div className="header-center desktop-only">
          <div className="toc-top-actions">
            <button
              className="search-trigger-wide"
              onClick={() =>
                window.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'k', metaKey: true })
                )
              }
              title="Pesquisar"
            >
              <Search size={20} />
              <span className="search-text">Clique ou escreva para pesquisar...</span>
              <div className="search-trigger-shortcut">⌘K</div>
            </button>
            <ThemeToggle className="theme-toggle-desktop" />
          </div>
        </div>

        <div className="header-right-container">
          <div className="sidebar-controls-row desktop-only">
            <FontSizeControl onToggle={handleToggle} isExpanded={isExpanded} />
          </div>

          <div className="mobile-controls-group mobile-only">
            <button
              className="search-bar-trigger"
              onClick={() =>
                window.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'k', metaKey: true })
                )
              }
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
        </div>
      </div>
    </header>
  )
}
