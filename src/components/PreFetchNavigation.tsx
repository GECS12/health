'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PreFetchNavigationProps {
  prevSlug?: string | null;
  nextSlug?: string | null;
}

export function PreFetchNavigation({ prevSlug, nextSlug }: PreFetchNavigationProps) {
  const router = useRouter();

  useEffect(() => {
    if (prevSlug) {
      router.prefetch(`/${prevSlug}`);
    }
    if (nextSlug) {
      router.prefetch(`/${nextSlug}`);
    }
  }, [prevSlug, nextSlug, router]);

  return null;
}
