'use client'

import React from 'react'
import { SidebarStateProvider } from '@/context/SidebarStateContext'
import { Header } from './Header'
import { SearchModal } from './SearchModal'
import { MobileMenuWrapper } from './MobileMenuWrapper'

export function ReaderShell({
  tree,
  siteTitle,
  siteAuthor,
  sidebar,
  toc,
  children,
}: {
  tree: any[]
  siteTitle: string
  siteAuthor?: string
  sidebar: React.ReactNode
  toc: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <SidebarStateProvider>
      <Header tree={tree} siteTitle={siteTitle} siteAuthor={siteAuthor} />
      <SearchModal />
      <MobileMenuWrapper sidebar={sidebar} toc={toc}>
        {children}
      </MobileMenuWrapper>
    </SidebarStateProvider>
  )
}
