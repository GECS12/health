import { client } from '../lib/sanity'
import { SidebarContent } from './SidebarContent'

interface Post {
  title: string
  slug: string
  order: number
}

interface Section {
  _id: string
  title: string
  order: number
  parent?: { _id: string }
  subSections: Section[]
  posts: Post[]
}

export async function Sidebar() {
  const allSections: Section[] = await client.fetch(`
    *[_type == "section"] | order(order asc) {
      _id,
      title,
      order,
      "parent": parent->{ _id },
      "posts": *[_type == "post" && references(^._id)] | order(order asc) {
        title,
        "slug": slug.current,
        order
      }
    }
  `)

  if (!allSections) return null

  const buildTree = (parentId: string | null = null): Section[] => {
    return allSections
      .filter(s => (parentId ? s.parent?._id === parentId : !s.parent))
      .map(s => ({
        ...s,
        subSections: buildTree(s._id)
      }))
  }

  const tree = buildTree()

  return (
    <aside className="sidebar">
      <div className="sidebar-nav-title">Índice</div>
      <SidebarContent tree={tree} />
    </aside>
  )
}
