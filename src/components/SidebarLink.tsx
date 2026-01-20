import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMobileMenu } from '@/context/MobileMenuContext';
import { LucideIcon, Check } from 'lucide-react';
import { useReadingProgress } from '@/context/ReadingProgressContext';

export function SidebarLink({ href, title, icon: Icon }: { href: string; title: string, icon?: LucideIcon }) {
  const pathname = usePathname();
  const { closeAll } = useMobileMenu();
  const { isRead } = useReadingProgress();
  
  // Robust matching: normalize both paths and decode URI
  const normalize = (path: string) => decodeURIComponent(path).replace(/\/$/, '') || '/';
  const isActive = normalize(pathname) === normalize(href);
  const slug = href.replace(/^\//, '');
  const read = isRead(slug);

  return (
    <Link 
      href={href} 
      className={`sub-link ${isActive ? 'active' : ''} ${read ? 'is-read' : ''}`}
      onClick={closeAll}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {Icon && <Icon size={14} className="sidebar-link-icon" style={{ marginRight: '8px', opacity: isActive ? 1 : 0.7 }} />}
          <span style={{ opacity: read ? 0.6 : 1 }}>{title}</span>
        </div>
        {read && <Check size={12} style={{ color: 'var(--accent-color)', opacity: 0.8 }} />}
      </div>
    </Link>
  );
}
