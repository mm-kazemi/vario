import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// Mentor Note:
// Why URL State Management over useState / Redux for filters?
// 1. Shareability: Users can copy the URL (e.g., ?category=smartphones&sortBy=price) and send it to a friend. 
//    If this was in useState, the friend would see the default homepage instead.
// 2. Browser History: Updating the URL allows users to use the browser's "Back" button to undo a filter change.
// 3. Server-Side Rendering (SSR): Next.js can read the URL parameters on the server and pre-fetch the exact 
//    data needed before sending HTML to the client, greatly improving SEO and Initial Load Time.

export function useURLFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // A helper function to update multiple query parameters at once without destroying existing ones
  const updateFilters = useCallback(
    (updates: Record<string, string | number | null>) => {
      // 1. Create a new URLSearchParams instance based on current URL
      const params = new URLSearchParams(searchParams.toString());

      // 2. Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          // If value is null/empty, remove the parameter completely (clean URLs)
          params.delete(key);
        } else {
          // Otherwise, set/overwrite it
          params.set(key, String(value));
        }
      });

      // 3. Special rule: If we are changing a filter (like category or search), 
      //    we should always reset pagination (skip) back to page 1 (0).
      //    We only skip this reset if the update ITSELF is a pagination change.
      if (!('skip' in updates)) {
        params.delete('skip');
      }

      // 4. Push the new URL to the router
      // Use scroll: false if you don't want the page to jump to the top on every filter click
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return { searchParams, updateFilters };
}
