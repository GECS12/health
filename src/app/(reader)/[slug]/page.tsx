import { client } from '../../../lib/sanity'
import { CustomPortableText } from '../../../components/CustomPortableText'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageTransition } from '@/components/PageTransition'
import { ArrowLeft, ArrowRight, Edit2 } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getFlattenedArticles } from '@/lib/navigation'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Comments } from '@/components/Comments'

interface ArticleProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true
// Revalidate every 60 seconds - ISR for better performance
export const revalidate = 60

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`)
  return posts.map((post: any) => ({
    slug: post.slug,
  }))
}

export default async function ArticlePage({ params }: ArticleProps) {
  const { slug } = await params

  // Fetch current article
  const article = await client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      body,
      references,
      section->{
        title,
        parent->{
          title
        }
      }
    }
  `, { slug })

  if (!article) {
    notFound()
  }

  // Get global article order for cross-chapter navigation
  const allArticles = await getFlattenedArticles()
  const currentIndex = allArticles.findIndex(a => a.slug === slug)
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null

  // Process references string into a list
  const referencesList = article.references 
    ? article.references.split('\n').filter((line: string) => line.trim())
    : []

  return (
    <PageTransition>
      <article className="article-container">
        <header className="article-header">
           <h1 className="article-title">{article.title}</h1>
           <Breadcrumbs 
             part={article.section?.parent?.title} 
             chapter={article.section?.title} 
             article={article.title} 
           />
           <div className="article-header-divider" />
        </header>

        <script
          type="application/json"
          id="article-nav-data"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              articleId: article._id,
              prev: prevArticle,
              next: nextArticle
            })
          }}
        />
        <div className="article-body-wrapper">
          <ScrollReveal>
            <CustomPortableText value={article.body} />
          </ScrollReveal>
        </div>

        {referencesList.length > 0 && (
          <section className="references-section">
            <h2 className="references-heading">Referências Bibliográficas</h2>
            <div className="references-list">
              {referencesList.map((ref: string, i: number) => {
                const match = ref.match(/^(\d+)[\s.–]+(.*)/)
                const num = match ? match[1] : (i + 1)
                const content = match ? match[2] : ref

                return (
                  <div key={i} id={`ref-${num}`} className="reference-item">
                    <span className="reference-number">{num}</span>
                    <div className="reference-content">
                      {content.split(/(https?:\/\/[^\s]+)/g).map((part, j) => 
                        part.match(/^https?:\/\//) 
                          ? <a key={j} href={part} target="_blank" rel="noopener noreferrer" className="reference-link">{part}</a>
                          : part
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <Comments postId={article._id} />
        
        <nav className="article-footer-nav">
          <div className="footer-nav-grid">
            {prevArticle ? (
              <Link href={`/${prevArticle.slug}`} className="footer-nav-item prev">
                <span className="footer-nav-label">
                  <ArrowLeft size={14} strokeWidth={2.5} />
                  Anterior
                </span>
                <span className="footer-nav-title">{prevArticle.title}</span>
              </Link>
            ) : <div />}

            {nextArticle ? (
              <Link href={`/${nextArticle.slug}`} className="footer-nav-item next">
                <span className="footer-nav-label">
                  Próximo
                  <ArrowRight size={14} strokeWidth={2.5} />
                </span>
                <span className="footer-nav-title">{nextArticle.title}</span>
              </Link>
            ) : <div />}
          </div>
        </nav>
      </article>
    </PageTransition>
  )
}

