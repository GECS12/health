import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMobileMenu } from '@/context/MobileMenuContext';
import { LucideIcon } from 'lucide-react';

export function SidebarLink({ href, title, icon: Icon }: { href: string; title: string, icon?: LucideIcon }) {
  const pathname = usePathname();
  const { closeAll } = useMobileMenu();
  
  // Robust matching: normalize both paths and decode URI
  const normalize = (path: string) => decodeURIComponent(path).replace(/\/$/, '') || '/';
  const isActive = normalize(pathname) === normalize(href);

  return (
    <Link 
      href={href} 
      className={`sub-link ${isActive ? 'active' : ''}`}
      onClick={closeAll}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {Icon && <Icon size={14} className="sidebar-link-icon" style={{ marginRight: '8px', opacity: isActive ? 1 : 0.7 }} />}
          <span>{title}</span>
        </div>
      </div>
    </Link>
  );
}
