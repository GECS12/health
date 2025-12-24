import { client } from '../../lib/sanity'
import { CustomPortableText } from '../../components/CustomPortableText'

export default async function Home() {
  // Fetch the first article to show as home
  const article = await client.fetch(`
    *[_type == "post"] | order(order asc) [0] {
      title,
      body
    }
  `)

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
