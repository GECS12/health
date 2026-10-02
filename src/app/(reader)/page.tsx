import { getNavigationTree } from '../../lib/navigation'
import { getLandingPage } from '../../lib/landingPage'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '../../components/ScrollReveal'
import { PortableText } from '@portabletext/react'

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
          {landing.preamble && landing.preamble.length > 0 && (
            <div className="prose prose-stone prose-lg mx-auto font-serif text-stone-700 leading-loose mb-12">
              <PortableText value={landing.preamble} />
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
