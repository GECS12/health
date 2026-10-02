import { getNavigationTree } from '../../lib/navigation'
import { getLandingPage, landingImageUrl } from '../../lib/landingPage'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '../../components/ScrollReveal'
import { CustomPortableText } from '../../components/CustomPortableText'

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function Home() {
  const [tree, landing] = await Promise.all([
    getNavigationTree(),
    getLandingPage(),
  ])
  
  // Get the first article to link to
  const firstArticle = tree[0]?.posts[0] || tree[0]?.subSections[0]?.posts[0]

  return (
    <div className="landing-page relative overflow-hidden">
      <ScrollReveal>
        <section className="landing-preamble max-w-2xl mx-auto px-6 pt-16 pb-32 text-center">
          {landing.images && landing.images.length > 0 && (
            <div className="mb-12 space-y-8">
              {landing.images.map((image, index) => {
                const src = landingImageUrl(image)
                if (!src) return null
                return (
                  <figure key={image._key || index} className="mx-auto">
                    <Image
                      src={src}
                      alt={image.alt || ''}
                      width={1200}
                      height={800}
                      className="mx-auto h-auto w-full max-w-full"
                      sizes="(max-width: 672px) 100vw, 672px"
                      priority={index === 0}
                    />
                    {image.caption && (
                      <figcaption className="mt-3 text-sm italic text-stone-500">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              })}
            </div>
          )}

          {landing.preamble && landing.preamble.length > 0 && (
            <div className="prose prose-stone prose-lg mx-auto font-serif text-stone-700 leading-loose mb-12">
              <CustomPortableText value={landing.preamble} />
            </div>
          )}

          {firstArticle && (
            <div className="mt-8">
              <Link href={`/${firstArticle.slug}`} className="landing-cta group relative inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg">
                <span className="font-medium tracking-widest text-sm uppercase">
                  {landing.ctaLabel}
                </span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </section>
      </ScrollReveal>
    </div>
  )
}
