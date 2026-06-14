'use client'; 

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/services/queries/product.queries';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { Button } from '@/components/common/Button';
import { ProductFilters } from './ProductFilters';
import { Pagination } from './Pagination';

export function ProductList() {
  const searchParams = useSearchParams();
  
  // Dynamically build the query parameters from the URL
  // We provide fallbacks (like limit: 12) so the UI is predictable.
  const queryParams = {
    q: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    order: (searchParams.get('order') as 'asc' | 'desc') || undefined,
    skip: parseInt(searchParams.get('skip') || '0', 10),
    limit: parseInt(searchParams.get('limit') || '12', 10),
  };

  const { data, isLoading, isError, refetch } = useProducts(queryParams);

  // Mentor Note: 
  // We place the ProductFilters above the actual list so the user can always see them, 
  // even if the list is loading or encounters an error.
  
  return (
    <div className="flex flex-col w-full">
      <ProductFilters />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: queryParams.limit }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="mb-4 h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mb-2 text-xl font-bold text-neutral-900">Failed to load products</h2>
          <Button onClick={() => refetch()} variant="primary">Try Again</Button>
        </div>
      ) : !data || data.products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="mb-2 text-xl font-bold text-neutral-900">No products found</h2>
          <p className="text-neutral-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <Pagination total={data.total} limit={queryParams.limit} />
        </>
      )}
    </div>
  );
}
