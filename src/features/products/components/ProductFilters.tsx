'use client';

import React, { useState, useEffect } from 'react';
import { useCategories } from '@/services/queries/product.queries';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/common/Input';

export function ProductFilters() {
  const { searchParams, updateFilters } = useURLFilters();
  const { data: categories } = useCategories();

  // Read initial values from URL
  const currentQ = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sortBy') || '';

  // Local state for search input to allow fluid typing before debouncing
  const [localSearch, setLocalSearch] = useState(currentQ);
  const debouncedSearch = useDebounce(localSearch, 500);

  // Sync debounced search to URL
  useEffect(() => {
    // Only update if it actually differs from what's in the URL, to prevent infinite loops
    if (debouncedSearch !== currentQ) {
      updateFilters({ q: debouncedSearch || null });
    }
  }, [debouncedSearch, currentQ, updateFilters]);

  // If the URL changes (e.g. user clicks "Back" button), we must sync local state
  useEffect(() => {
    setLocalSearch(currentQ);
  }, [currentQ]);

  return (
    <div className="mb-8 p-4 md:p-6 rounded-2xl bg-white shadow-sm border border-neutral-100 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-2xl w-full">
          <label htmlFor="search" className="sr-only">Search products</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input 
              id="search"
              type="search" 
              placeholder="Search products..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-11 py-3 w-full bg-neutral-50/50 border-neutral-200 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full lg:w-auto shrink-0">
          <div className="relative w-full sm:w-auto">
            <select
              className="appearance-none w-full sm:w-48 rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 pr-10 text-sm font-medium text-neutral-700 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all cursor-pointer"
              value={currentCategory}
              onChange={(e) => updateFilters({ category: e.target.value || null })}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              className="appearance-none w-full sm:w-48 rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 pr-10 text-sm font-medium text-neutral-700 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all cursor-pointer"
              value={currentSort}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'price-asc') updateFilters({ sortBy: 'price', order: 'asc' });
                else if (val === 'price-desc') updateFilters({ sortBy: 'price', order: 'desc' });
                else if (val === 'rating-desc') updateFilters({ sortBy: 'rating', order: 'desc' });
                else updateFilters({ sortBy: null, order: null });
              }}
              aria-label="Sort products"
            >
              <option value="">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
