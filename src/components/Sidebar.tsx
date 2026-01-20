import { getNavigationTree, Section } from '@/lib/navigation'
import { SidebarContent } from './SidebarContent'
import { SearchTrigger } from './SearchModal'

export async function Sidebar() {
  let tree: Section[] = []
  try {
    tree = await getNavigationTree()
  } catch (error) {
    console.error('Failed to fetch navigation tree:', error)
    // Return empty tree on error to prevent page crash
  }

  return (
    <div className="sidebar-container">
      <SidebarContent tree={tree} />
    </div>
  )
}
