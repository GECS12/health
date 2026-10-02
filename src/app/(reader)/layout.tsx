import { getNavigationTree } from '../../lib/navigation'
import { getLandingPage } from '../../lib/landingPage'
import { Sidebar } from '../../components/Sidebar'
import { TableOfContents } from '../../components/TableOfContents'
import { BackToTop } from '../../components/BackToTop'
import { ArticleNavigation } from '../../components/ArticleNavigation'
import { AdminEdit } from '../../components/AdminEdit'
import { ProgressIndicator } from '../../components/ProgressIndicator'
import { SkipToContent } from '../../components/SkipToContent'
import { ArrowUpRight } from 'lucide-react'
import { MobileMenuProvider } from '@/context/MobileMenuContext'
import { ReaderShell } from '@/components/ReaderShell'
import '../globals.css'

export default async function ReaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [tree, landing] = await Promise.all([
    getNavigationTree(),
    getLandingPage(),
  ])

  const sidebar = (
    <Sidebar
      tree={tree}
      siteTitle={landing.title}
      siteAuthor={landing.author}
    />
  )
  const toc = (
    <>
      <div className="toc-header-group-minimal">
        <div className="toc-sidebar-heading">
           <ArrowUpRight size={12} strokeWidth={3} />
           Conteúdo do Artigo
        </div>
        <AdminEdit />
      </div>

      <TableOfContents />
      
      <ArticleNavigation />
    </>
  );

  return (
    <MobileMenuProvider>
      <SkipToContent />
      <ProgressIndicator />
      <ReaderShell
        tree={tree}
        siteTitle={landing.title}
        siteAuthor={landing.author}
        sidebar={sidebar}
        toc={toc}
      >
        {children}
      </ReaderShell>
      <BackToTop />
    </MobileMenuProvider>
  )
}
