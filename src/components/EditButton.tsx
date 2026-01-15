'use client';

import { Edit } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface EditButtonProps {
  documentId: string;
}

function EditButtonContent({ documentId }: EditButtonProps) {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show if ?admin=true is in URL OR if we are in development mode
    if (searchParams.get('admin') === 'true' || process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, [searchParams]);

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
