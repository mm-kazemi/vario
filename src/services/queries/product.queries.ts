import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories, getProductById } from '../api/product.api';
import { ProductQueryParams } from '@/types/product.types';

// Mentor Note: Query Key Dependencies
// React Query acts as a global cache. When you use a query key like `['products']`, 
// React Query fetches the data and caches it under that key.
// 
// The Stale Data Bug: If we used a static key like `['products']`, and the user changed the search query 
// (e.g. URL updates to `?q=essen`), the component would re-render, BUT React Query would see `['products']`, 
// recognize that it already has cached data for that key, and immediately return the stale (unfiltered) data 
// without triggering a new network request!
//
// The Fix: "Query Key Dependencies". A query key must be treated exactly like a React `useEffect` dependency array. 
// Every variable that is used inside the `queryFn` MUST be included in the `queryKey`. 
// By including the `params` object (e.g., `['products', 'list', params]`), React Query creates a 
// mathematically unique cache entry for every distinct combination of search/filter/pagination state. 
// When the URL changes, `params` changes, the query key changes, and React Query instantly triggers a fresh fetch.

export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (params: ProductQueryParams) => [...productQueryKeys.lists(), params] as const,
  categories: () => [...productQueryKeys.all, 'categories'] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...productQueryKeys.details(), String(id)] as const,
};

/**
 * Custom hook to fetch products reactively.
 * Automatically refetches whenever the passed `params` change.
 */
export const useProducts = (params: ProductQueryParams) => {
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => getProducts(params),
    
    // Mentor Note: Client-Side Data Engine (Mock BFF Pattern)
    // Client-Side Filtering on Paginated Server Data is a massive anti-pattern.
    // If a server returns Page 1 (items 1-30), and you filter out 25 items on the client, 
    // your user only sees 5 items on Page 1, while Page 2 might have 20 matching items.
    // The dataset becomes fractured, pagination breaks, and search results are inaccurate.
    // 
    // To fix this for DummyJSON, we fetched the ENTIRE catalog (`limit=0`) into React Query's cache.
    // Now, we use the `select` function as a complete "Data Engine" to sequentially:
    // 1. Filter by Category
    // 2. Filter by Search Query
    // 3. Sort the remaining items
    // 4. Paginate the exact slice for the UI
    // 
    // This perfectly mimics a competent Backend-For-Frontend (BFF) and guarantees 
    // our UI receives flawless, predictable data arrays.
    select: (data) => {
      // Create a shallow copy to safely mutate via sort
      let processedProducts = [...data.products];

      // a. Category Filter
      if (params.category && params.category !== 'all') {
        processedProducts = processedProducts.filter(
          (product) => product.category === params.category
        );
      }

      // b. Search Filter
      if (params.q && params.q.trim() !== '') {
        const queryLower = params.q.trim().toLowerCase();
        processedProducts = processedProducts.filter((product) =>
          product.title.toLowerCase().includes(queryLower)
        );
      }

      // c. Sorting
      if (params.sortBy) {
        processedProducts.sort((a, b) => {
          let valA = a[params.sortBy as keyof typeof a];
          let valB = b[params.sortBy as keyof typeof b];

          if (typeof valA === 'string' && typeof valB === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
            if (valA < valB) return params.order === 'desc' ? 1 : -1;
            if (valA > valB) return params.order === 'desc' ? -1 : 1;
            return 0;
          }

          if (typeof valA === 'number' && typeof valB === 'number') {
            return params.order === 'desc' ? valB - valA : valA - valB;
          }

          return 0;
        });
      }

      // d. Pagination
      const total = processedProducts.length;
      const skip = params.skip || 0;
      const limit = params.limit || 12;
      const paginatedProducts = processedProducts.slice(skip, skip + limit);

      return {
        ...data,
        products: paginatedProducts,
        total,
        skip,
        limit,
      };
    },
  });
};

/**
 * Custom hook to fetch the product categories.
 */
export const useCategories = () => {
  return useQuery({
    queryKey: productQueryKeys.categories(),
    queryFn: getCategories,
    // Categories rarely change, so we can set a longer staleTime here if we wanted
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Custom hook to fetch a single product by ID.
 */
export const useProduct = (id: number | string) => {
  return useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id, // Only fetch if ID exists
  });
};
