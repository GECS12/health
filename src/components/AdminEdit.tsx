'use client';

import { Edit2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AdminEdit() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  const pathname = usePathname();
  const [articleId, setArticleId] = useState<string | null>(null);

  useEffect(() => {
    const dataEl = document.getElementById('article-nav-data');
    if (dataEl) {
      try {
        const data = JSON.parse(dataEl.textContent || '{}');
        setArticleId(data.articleId || null);
      } catch (e) {
        console.error('Failed to parse article data', e);
      }
    }
  }, [pathname]);

  if (!isAdmin || !articleId) return null;

  return (
    <div className="admin-actions">
      <Link 
        href={`/admin/intent/edit/id=${articleId}`}
        className="admin-edit-link"
        target="_blank"
      >
        <Edit2 size={12} strokeWidth={3} />
        <span>Editar Artigo</span>
      </Link>
    </div>
  );
}
