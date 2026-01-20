import { client } from '../../../lib/sanity'
import { CustomPortableText } from '../../../components/CustomPortableText'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageTransition } from '@/components/PageTransition'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getFlattenedArticles } from '@/lib/navigation'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Comments } from '@/components/Comments'
import { Bibliography } from '@/components/Bibliography'

import { PreFetchNavigation } from '@/components/PreFetchNavigation'
import { draftMode } from 'next/headers'


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
  const { isEnabled } = await draftMode()

  const fetchClient = isEnabled 
    ? client.withConfig({ 
        token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN, 
        perspective: 'previewDrafts', 
        useCdn: false,
        stega: { 
          enabled: true, 
          studioUrl: '/admin',
          filter: (props) => {
            if (props.sourcePath.at(-1) === 'slug') return false
            return props.filterDefault(props)
          }
        } 
      })
    : client

  // Fetch current article with citations
  const article = await fetchClient.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      body,
      section->{
        title,
        parent->{
          title
        }
      },
      "citations": references[]->{
        _id,
        citationId,
        authors,
        year,
        title,
        source,
        volume,
        issue,
        pages,
        doi,
        url,
        notes
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

  return (
    <PageTransition>
      <article className="article-container">
        <header className="article-header relative group">
            <h1 className="article-title">{article.title}</h1>
            <Breadcrumbs 
              part={article.section?.parent?.title} 
              chapter={article.section?.title} 
              article={article.title} 
              documentId={article._id}
              isDraftMode={isEnabled}
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
            <CustomPortableText value={article.body} documentId={article._id} isDraftMode={isEnabled} />
          </ScrollReveal>
        </div>

        {article.citations && article.citations.length > 0 && (
          <Bibliography citations={article.citations} />
        )}



        <PreFetchNavigation 
          prevSlug={prevArticle?.slug} 
          nextSlug={nextArticle?.slug} 
        />

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

