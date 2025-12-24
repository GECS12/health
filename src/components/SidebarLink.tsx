'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarLink({ href, title }: { href: string; title: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`sub-link ${isActive ? 'active' : ''}`}
    >
      {title}
    </Link>
  );
}
