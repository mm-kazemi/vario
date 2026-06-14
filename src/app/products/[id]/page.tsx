import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductDetails } from '@/features/products/components/ProductDetails';

// Mentor Note:
// Next.js App Router Dynamic Routing (`[id]`) Mechanics:
// The folder name `[id]` signifies a dynamic route segment. When a user navigates to `/products/123`, 
// Next.js automatically maps `123` to the `id` property inside the `params` prop of this page.
//
// In Next.js 15+, `params` and `searchParams` are Promises and must be awaited.
// 
// Enterprise Pattern: Server Component to Client Component Handoff
// This `page.tsx` is a Server Component. It is responsible for routing, SEO metadata (potentially), 
// and extracting the raw URL parameters. However, it does NOT fetch the interactive data itself.
// Instead, it passes the extracted `id` down to the `ProductDetails` Client Component. 
// This separation ensures the page structure renders instantly on the server, while React Query 
// handles the complex caching, refetching, and interactive states on the client.

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Mentor Note on the Fix:
  // In Next.js 15+, `params` is an asynchronous Promise. It MUST be awaited 
  // before you can destructure its properties. If you try to read `params.id` 
  // synchronously, it will return `undefined`, breaking the entire fetch chain 
  // and causing our "Product not found" error downstream.
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <ProductDetails id={id} />
      </main>

      <Footer />
    </div>
  );
}
