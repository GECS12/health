import { getNavigationTree } from '../../lib/navigation'
import Link from 'next/link'
import { Book, ArrowRight, Sparkles } from 'lucide-react'
import { ScrollReveal } from '../../components/ScrollReveal'

// Revalidate immediately (Dynamic)
export const revalidate = 0

export default async function Home() {
  const tree = await getNavigationTree()
  
  // Get the first article to link to
  const firstArticle = tree[0]?.posts[0] || tree[0]?.subSections[0]?.posts[0]

  return (
    <div className="landing-page">
      <ScrollReveal>
        <header className="landing-hero">
          <div className="landing-icon">
            <Book size={48} strokeWidth={1.5} />
          </div>
          <h1 className="landing-title">Saúde, Medicina e Ciência</h1>
          <p className="landing-subtitle">
            Uma jornada abrangente através da medicina moderna, nutrição baseada em evidências e ciência da saúde.
          </p>
          
          {firstArticle && (
            <Link href={`/${firstArticle.slug}`} className="landing-cta">
              <span>Começar a Ler</span>
              <ArrowRight size={18} strokeWidth={2} />
            </Link>
          )}
        </header>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <section className="landing-overview">
          <div className="landing-section-header">
            <Sparkles size={20} strokeWidth={2} />
            <h2>Visão Geral do Conteúdo</h2>
          </div>
          
          <div className="landing-parts">
            {tree.map((part, index) => (
              <div key={part._id} className="landing-part-card">

                <h3 className="landing-part-title">{part.title}</h3>
                
                {part.posts.length > 0 && (
                  <ul className="landing-articles-list">
                    {part.posts.map((post) => (
                      <li key={post.slug}>
                        <Link href={`/${post.slug}`} className="landing-article-link">
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                
                {part.subSections.length > 0 && (
                  <div className="landing-chapters">
                    {part.subSections.map((chapter) => (
                      <div key={chapter._id} className="landing-chapter">
                        <h4 className="landing-chapter-title">{chapter.title}</h4>
                        {chapter.posts.length > 0 && (
                          <ul className="landing-articles-list">
                            {chapter.posts.map((post) => (
                              <li key={post.slug}>
                                <Link href={`/${post.slug}`} className="landing-article-link">
                                  {post.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
