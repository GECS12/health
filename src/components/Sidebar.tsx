import { SidebarContent } from './SidebarContent'

export function Sidebar({
  tree,
  siteTitle,
  siteAuthor,
}: {
  tree: any[]
  siteTitle: string
  siteAuthor?: string
}) {
  return (
    <div className="sidebar-container">
      <SidebarContent
        tree={tree}
        siteTitle={siteTitle}
        siteAuthor={siteAuthor}
      />
    </div>
  )
}
