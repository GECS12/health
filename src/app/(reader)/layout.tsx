import { Sidebar } from '../../components/Sidebar'
import { Header } from '../../components/Header'
import { TableOfContents } from '../../components/TableOfContents'
import { ProgressIndicator } from '../../components/ProgressIndicator'
import { BackToTop } from '../../components/BackToTop'
import { ArticleNavigation } from '../../components/ArticleNavigation'
import { ArrowUpRight, Link2 } from 'lucide-react'
import '../globals.css'

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div className="layout-container" style={{ margin: '0', maxWidth: '100%' }}>
        <Sidebar />
        <main className="main-content">
          <div className="content-inner smooth-fade">
            {children}
          </div>
        </main>
        <aside className="toc">
          <div className="toc-header-group">
            <div className="toc-heading">
              <ArrowUpRight size={12} strokeWidth={3} />
              Progresso
            </div>
            <ProgressIndicator />
          </div>

          <div className="toc-heading">
            <ArrowUpRight size={12} strokeWidth={3} />
            Índice do Artigo
          </div>
          <TableOfContents />
          
          <ArticleNavigation />
          
          <BackToTop />
        </aside>
      </div>
    </>
  )
}

