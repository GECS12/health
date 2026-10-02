import { client, urlFor } from './sanity'

export interface LandingImage {
  asset?: { _ref?: string; _id?: string }
  alt?: string
  caption?: string
  [key: string]: any
}

export interface LandingPage {
  title: string
  author?: string
  images?: LandingImage[]
  preamble?: any[]
  ctaLabel?: string
}

const FALLBACK: LandingPage = {
  title: 'Realidade',
  author: 'David Leão',
  images: [],
  preamble: [
    {
      _type: 'block',
      _key: 'p1',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 's1',
          text: 'Neste volume, despimos a medicina moderna de seus excessos para revelar o que é essencial. Exploramos os mecanismos fundamentais que governam nosso bem-estar, questionando dogmas estabelecidos e abraçando uma visão baseada puramente em evidências fisiológicas.',
          marks: [],
        },
      ],
    },
    {
      _type: 'block',
      _key: 'p2',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 's2',
          text: 'Esta não é apenas uma coleção de artigos, mas um manifesto sobre como entendemos o corpo humano. Do metabolismo à longevidade, cada capítulo foi construído para desafiar o senso comum e oferecer um novo paradigma para sua saúde.',
          marks: [],
        },
      ],
    },
  ],
  ctaLabel: 'Começar a ler o Capítulo 1',
}

export async function getLandingPage(): Promise<LandingPage> {
  const data = await client.fetch<LandingPage | null>(
    `*[_type == "landingPage" && _id == "landingPage"][0]{
      title,
      author,
      images,
      preamble,
      ctaLabel
    }`
  )

  if (!data?.title) return FALLBACK

  return {
    title: data.title,
    author: data.author ?? FALLBACK.author,
    images: data.images?.length ? data.images : [],
    preamble: data.preamble?.length ? data.preamble : FALLBACK.preamble,
    ctaLabel: data.ctaLabel || FALLBACK.ctaLabel,
  }
}

export function landingImageUrl(image: LandingImage) {
  if (!image?.asset?._ref && !image?.asset?._id) return null
  return urlFor(image).width(1200).url()
}
