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
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-white text-gray-800 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all border border-gray-200 group"
      title="Edit this article in Sanity"
    >
      <Edit size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
      <span className="font-medium text-sm">Editar</span>
    </Link>
  );
}
