'use client';

import { Edit } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface EditButtonProps {
  documentId: string;
  isDraftMode?: boolean;
}

function EditButtonContent({ documentId, isDraftMode }: EditButtonProps) {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for admin params
    const urlKey = searchParams.get('admin_key') || searchParams.get('admin_access_key');
    const storedKey = localStorage.getItem('admin_access_key');

    // Show if:
    // 1. In Draft Mode
    // 2. In Development
    // 3. Has key in URL (and save it)
    // 4. Has key in localStorage
    
    if (isDraftMode || process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    } else if (urlKey) {
      localStorage.setItem('admin_access_key', urlKey);
      setIsVisible(true);
      
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('admin_key');
      url.searchParams.delete('admin_access_key');
      window.history.replaceState({}, '', url);
    } else if (storedKey) {
      setIsVisible(true);
    }
  }, [isDraftMode, searchParams]);

  if (!isVisible) return null;

  // Use Sanity Intent URL for deep linking
  const editUrl = `/admin/intent/edit/id=${documentId};type=post`;

  return (
    <Link 
      href={editUrl}
      className="absolute top-0 right-0 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
      title="Editar artigo (Admin)"
    >
      <Edit size={16} />
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
