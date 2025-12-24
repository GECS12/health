import { getNavigationTree } from '@/lib/navigation'
import { SidebarContent } from './SidebarContent'
import { SearchTrigger } from './SearchModal'

export async function Sidebar() {
  const tree = await getNavigationTree()

  return (
    <div className="sidebar-container">
      <SidebarContent tree={tree} />
    </div>
  )
}
