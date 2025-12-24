'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMobileMenu } from '@/context/MobileMenuContext';

export function SidebarLink({ href, title }: { href: string; title: string }) {
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
      {title}
    </Link>
  );
}
