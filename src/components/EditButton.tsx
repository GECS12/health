'use client';

import { Edit } from 'lucide-react';
import Link from 'next/link';

interface EditButtonProps {
  documentId: string;
}

export function EditButton({ documentId }: EditButtonProps) {
  // Use Sanity Intent URL for deep linking
  // This usually works out of the box with default studio structure
  const editUrl = `/admin/intent/edit/id=${documentId};type=post`;

  return (
    <Link 
      href={editUrl}
      className="mobile-edit-btn lg:absolute lg:top-0 lg:right-0 inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
      title="Edit this article"
    >
      <Edit size={14} />
      <span>Editar</span>
    </Link>
  );
}
