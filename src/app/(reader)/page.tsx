import { getNavigationTree } from '../../lib/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '../../components/ScrollReveal'

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function Home() {
  const tree = await getNavigationTree()
  
  // Get the first article to link to
  const firstArticle = tree[0]?.posts[0] || tree[0]?.subSections[0]?.posts[0]

  return (
    <div className="landing-page relative overflow-hidden">
      <ScrollReveal>
        <header className="landing-hero flex flex-col items-center justify-center text-center pt-24 pb-12 px-4 relative z-10">
          <h1 className="landing-title text-5xl md:text-7xl font-serif text-stone-900 mb-6 tracking-tight leading-none">
            Saúde, Medicina <br className="hidden md:block" /> e Ciência
          </h1>
          <p className="landing-subtitle text-lg text-stone-500 max-w-xl mx-auto font-serif italic mb-0">
            Uma abordagem fundamental sobre a biologia humana.
          </p>
        </header>

        <section className="landing-preamble max-w-2xl mx-auto px-6 pb-32 text-center">
          <div className="prose prose-stone prose-lg mx-auto font-serif text-stone-700 leading-loose">
            <p className="mb-6">
              Neste volume, despimos a medicina moderna de seus excessos para revelar o que é essencial. 
              Exploramos os mecanismos fundamentais que governam nosso bem-estar, questionando 
              dogmas estabelecidos e abraçando uma visão baseada puramente em evidências fisiológicas.
            </p>
            <p className="mb-12">
              Esta não é apenas uma coleção de artigos, mas um manifesto sobre como entendemos 
              o corpo humano. Do metabolismo à longevidade, cada capítulo foi construído para 
              desafiar o senso comum e oferecer um novo paradigma para sua saúde.
            </p>
          </div>

          {firstArticle && (
            <div className="mt-8">
              <Link href={`/${firstArticle.slug}`} className="landing-cta group relative inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg">
                <span className="font-medium tracking-widest text-sm uppercase">Começar a ler o Capítulo 1</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </section>
      </ScrollReveal>
    </div>
  )
}
