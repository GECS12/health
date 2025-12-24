import { Sidebar } from '../../components/Sidebar'
import { Header } from '../../components/Header'
import { TableOfContents } from '../../components/TableOfContents'
import { BackToTop } from '../../components/BackToTop'
import { ArticleNavigation } from '../../components/ArticleNavigation'
import { AdminEdit } from '../../components/AdminEdit'
import { SearchModal, SearchTrigger } from '../../components/SearchModal'
import { ArrowUpRight } from 'lucide-react'
import { MobileMenuProvider } from '@/context/MobileMenuContext'
import { MobileMenuWrapper } from '@/components/MobileMenuWrapper'
import '../globals.css'

import { ThemeToggle } from '../../components/ThemeToggle'

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebar = <Sidebar />;
  const toc = (
    <>
      <div className="toc-top-actions">
        <SearchTrigger />
        <ThemeToggle className="theme-toggle-desktop" />
      </div>
      <div className="toc-header-group-minimal">
        <AdminEdit />
      </div>

      <TableOfContents />
      
      <ArticleNavigation />
    </>
  );

  return (
    <MobileMenuProvider>
      <Header />
      <SearchModal />
      <MobileMenuWrapper sidebar={sidebar} toc={toc}>
        {children}
      </MobileMenuWrapper>
      <BackToTop />
    </MobileMenuProvider>
  )
}

