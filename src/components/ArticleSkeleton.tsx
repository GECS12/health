import React from 'react'

export function ArticleSkeleton() {
  return (
    <div className="article-container animate-pulse">
      <header className="article-header relative group">
        {/* Title skeleton */}
        <div className="h-12 bg-stone-200 rounded-md w-3/4 mb-6"></div>
        
        {/* Breadcrumbs skeleton */}
        <div className="flex gap-2 items-center mb-8">
          <div className="h-4 bg-stone-200 rounded w-16"></div>
          <div className="h-4 bg-stone-200 rounded w-4"></div>
          <div className="h-4 bg-stone-200 rounded w-24"></div>
          <div className="h-4 bg-stone-200 rounded w-4"></div>
          <div className="h-4 bg-stone-200 rounded w-32"></div>
        </div>

        <div className="article-header-divider border-stone-100" />
      </header>

      <div className="article-body-wrapper mt-12 space-y-6">
        {/* Paragraph skeletons */}
        <div className="space-y-3">
          <div className="h-4 bg-stone-200 rounded w-full"></div>
          <div className="h-4 bg-stone-200 rounded w-full"></div>
          <div className="h-4 bg-stone-200 rounded w-11/12"></div>
        </div>

        <div className="space-y-3">
          <div className="h-4 bg-stone-200 rounded w-full"></div>
          <div className="h-4 bg-stone-200 rounded w-10/12"></div>
          <div className="h-4 bg-stone-200 rounded w-full"></div>
        </div>

        {/* Image placeholder */}
        <div className="w-full h-64 bg-stone-100 rounded-lg my-8"></div>

        <div className="space-y-3">
          <div className="h-4 bg-stone-200 rounded w-full"></div>
          <div className="h-4 bg-stone-200 rounded w-full"></div>
          <div className="h-4 bg-stone-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  )
}
