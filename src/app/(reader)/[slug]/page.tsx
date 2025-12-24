import { client } from '../../../lib/sanity'
import { CustomPortableText } from '../../../components/CustomPortableText'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageTransition } from '@/components/PageTransition'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface ArticleProps {
  params: Promise<{ slug: string }>
}


export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`)
  return posts.map((post: any) => ({
    slug: post.slug,
  }))
}

export default async function ArticlePage({ params }: ArticleProps) {
  const { slug } = await params

  // Fetch current article and its section context
  const article = await client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      body,
      references,
      section->{
        title,
        "posts": *[_type == "post" && references(^._id)] | order(order asc) {
          title,
          "slug": slug.current
        }
      }
    }
  `, { slug })

  if (!article) {
    notFound()
  }

  // Find prev/next siblings
  const siblings = article.section?.posts || []
  const currentIndex = siblings.findIndex((s: any) => s.slug === slug)
  const prevArticle = currentIndex > 0 ? siblings[currentIndex - 1] : null
  const nextArticle = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null

  // Process references string into a list
  const referencesList = article.references 
    ? article.references.split('\n').filter((line: string) => line.trim())
    : []

  // Estimate reading time (approx 200 words per minute)
  const wordCount = JSON.stringify(article.body).split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <PageTransition>
      <article className="article-container">
        <header className="article-header">
           <div className="article-meta-top">
              {article.section?.title || 'Capítulo'}
           </div>
           <h1 className="article-title">{article.title}</h1>
           <div className="article-metadata-row">
             <span className="metadata-item">
               {readingTime} min de leitura
             </span>
             <span className="metadata-divider">/</span>
             <span className="metadata-item">
               Artigo Científico
             </span>
           </div>
           <div className="article-header-divider" />
        </header>

        <script
          type="application/json"
          id="article-nav-data"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prev: prevArticle,
              next: nextArticle
            })
          }}
        />
        <div className="article-body-wrapper">
          <CustomPortableText value={article.body} />
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
                    <div className="reference-content">{content}</div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
        
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

