import React, { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductList } from '@/features/products/components/ProductList';
import { ProductCardSkeleton } from '@/features/products/components/ProductCardSkeleton';

// Mentor Note:
// In Step 5, we transform our showcase page into our main eCommerce storefront.
// The `page.tsx` itself is a Server Component, but `ProductList` is a Client Component 
// (because it needs React Query to fetch and manage state). This is the Next.js App Router 
// paradigm: build the skeleton/layout on the server, and drop in interactive client islands where needed.

// Mentor Note: Suspense and useSearchParams
// Next.js App Router performs Static Site Generation (SSG) by default during the build step.
// If a Client Component deeply nested in the tree uses `useSearchParams()`, Next.js doesn't know 
// what the search parameters will be at build time. To prevent the entire page from bailing out 
// of static rendering (de-optimizing the entire page to server-side rendering), Next.js REQUIRES 
// any component that reads `useSearchParams()` to be wrapped in a React `<Suspense>` boundary.
// This allows Next.js to statically render the layout and the fallback, and only render the 
// `ProductList` dynamically on the client when the search parameters are actually available.

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            Latest Arrivals
          </h1>
          <p className="mt-2 text-neutral-600">
            Discover our premium selection of highly-rated products.
          </p>
        </div>

        <Suspense 
          fallback={
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={`page-skeleton-${i}`} />
              ))}
            </div>
          }
        >
          <ProductList />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
