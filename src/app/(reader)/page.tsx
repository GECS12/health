import { getNavigationTree } from '../../lib/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '../../components/ScrollReveal'

// Revalidate immediately (Dynamic)
export const revalidate = 0

export default async function Home() {
  const tree = await getNavigationTree()
  
  // Get the first article to link to
  const firstArticle = tree[0]?.posts[0] || tree[0]?.subSections[0]?.posts[0]

  return (
    <div className="landing-page min-h-screen flex flex-col justify-center relative overflow-hidden">
      <ScrollReveal>
        <header className="landing-hero flex flex-col items-center justify-center text-center px-4 relative z-10">
          <h1 className="landing-title text-6xl md:text-7xl lg:text-8xl font-serif text-stone-900 mb-8 tracking-tight leading-none">
            Saúde, Medicina <br className="hidden md:block" /> e Ciência
          </h1>
          <p className="landing-subtitle text-lg md:text-xl text-stone-600 max-w-xl mx-auto mb-12 font-serif italic leading-relaxed">
            Uma jornada abrangente através da medicina moderna, nutrição baseada em evidências e ciência da saúde.
          </p>
          
          {firstArticle && (
            <Link href={`/${firstArticle.slug}`} className="landing-cta group relative inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-stone-50 rounded-full hover:bg-stone-800 transition-all duration-300 hover:shadow-lg">
              <span className="font-medium tracking-widest text-sm uppercase">Começar a Ler</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </header>
      </ScrollReveal>
    </div>
  )
}
