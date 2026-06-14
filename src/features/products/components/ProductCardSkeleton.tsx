import React from 'react';

// Mentor Note:
// Why Skeleton Loaders instead of a centered Spinner?
// 1. Perceived Performance: Skeletons visually represent the layout of the incoming data. This tricks the user's 
//    brain into feeling like the app is loading faster because the structural shell is immediately visible.
// 2. Cumulative Layout Shift (CLS): This is a critical Core Web Vital metric for SEO. If you show a tiny spinner, 
//    and then suddenly render 12 large product cards, the entire page content abruptly jumps down. 
//    This layout shift is jarring. Skeletons reserve the exact height and width the content will occupy, 
//    ensuring a smooth, shift-free transition when the data finally arrives.

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] w-full animate-pulse bg-neutral-200"></div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-neutral-200"></div>
            <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200"></div>
          </div>
          <div className="h-4 w-8 shrink-0 animate-pulse rounded bg-neutral-200"></div>
        </div>

        <div className="mt-auto flex items-baseline gap-2">
          <div className="h-6 w-16 animate-pulse rounded bg-neutral-200"></div>
          <div className="h-4 w-12 animate-pulse rounded bg-neutral-200"></div>
        </div>
      </div>
    </div>
  );
}
