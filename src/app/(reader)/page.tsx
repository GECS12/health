import { client } from '../../lib/sanity'
import { CustomPortableText } from '../../components/CustomPortableText'

// Revalidate immediately (Dynamic)
export const revalidate = 0

export default async function Home() {
  let article = null

  try {
    // Fetch the first article to show as home
    article = await client.fetch(`
      *[_type == "post"] | order(order asc) [0] {
        title,
        body
      }
    `)
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>
        <h2>Serviço Indisponível</h2>
        <p>Não foi possível carregar o conteúdo no momento. Por favor, tente recarregar a página.</p>
      </div>
    )
  }

  if (!article) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1>Saúde e Nutrição</h1>
        <p>Bem-vindo. Por favor, adicione artigos no editor.</p>
      </div>
    )
  }

  return (
    <article>
      <h1 className="article-title">{article.title}</h1>
      <CustomPortableText value={article.body} />
    </article>
  )
}
