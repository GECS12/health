import { getNavigationTree } from '@/lib/navigation'
import { getLandingPage } from '@/lib/landingPage'
import { SidebarContent } from './SidebarContent'
import { SearchTrigger } from './SearchModal'

export async function Sidebar() {
  const [tree, landing] = await Promise.all([
    getNavigationTree(),
    getLandingPage(),
  ])

  return (
    <div className="sidebar-container">
      <SidebarContent
        tree={tree}
        siteTitle={landing.title}
        siteAuthor={landing.author}
      />
    </div>
  )
}
