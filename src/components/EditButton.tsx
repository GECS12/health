'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface EditButtonProps {
  documentId: string;
  isDraftMode?: boolean;
  variant?: 'absolute' | 'breadcrumb';
}

function EditButtonContent({ documentId, isDraftMode, variant = 'absolute' }: EditButtonProps) {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const urlKey = searchParams.get('admin_key') || searchParams.get('admin_access_key');
    const storedKey = localStorage.getItem('admin_access_key');
    
    if (isDraftMode || process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    } else if (urlKey) {
      localStorage.setItem('admin_access_key', urlKey);
      setIsVisible(true);
      
      const url = new URL(window.location.href);
      url.searchParams.delete('admin_key');
      url.searchParams.delete('admin_access_key');
      window.history.replaceState({}, '', url);
    } else if (storedKey) {
      setIsVisible(true);
    }
  }, [isDraftMode, searchParams]);

  const isBreadcrumb = variant === 'breadcrumb';
  const editUrl = `/admin/intent/edit/id=${documentId};type=post`;

  // Explicit house icon as requested
  const HouseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house" aria-hidden="true">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    </svg>
  );

  if (!isVisible) {
    if (isBreadcrumb) {
      return (
        <Link href="/" className="breadcrumb-item breadcrumb-link" title="Ir para o início">
          <HouseIcon />
        </Link>
      );
    }
    return null;
  }

  const className = isBreadcrumb
    ? "breadcrumb-item breadcrumb-link edit-mode-active"
    : "absolute top-0 right-0 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100";

  return (
    <Link 
      href={editUrl}
      className={className}
      title="Editar artigo (Admin)"
    >
      <HouseIcon />
    </Link>
  );
}

export function EditButton(props: EditButtonProps) {
  return (
    <Suspense fallback={null}>
      <EditButtonContent {...props} />
    </Suspense>
  );
}
