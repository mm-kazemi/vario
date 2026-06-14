import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductList } from '@/features/products/components/ProductList';

// Mentor Note:
// In Step 5, we transform our showcase page into our main eCommerce storefront.
// The `page.tsx` itself is a Server Component, but `ProductList` is a Client Component 
// (because it needs React Query to fetch and manage state). This is the Next.js App Router 
// paradigm: build the skeleton/layout on the server, and drop in interactive client islands where needed.

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

        {/* 
          Here we drop in our "Smart" ProductList component. 
          It handles its own loading, error, and empty states internally. 
        */}
        <ProductList />
      </main>

      <Footer />
    </div>
  );
}
