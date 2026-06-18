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
    
    // Mentor Note: Data Transformation via `select`
    // In enterprise scenarios, you rarely control the third-party APIs you consume.
    // If an API returns noisy data (like DummyJSON searching descriptions instead of just titles),
    // you MUST NOT pollute your UI presentation components with complex filtering logic.
    // 
    // React Query's `select` option is the perfect place to sanitize and transform data.
    // WHY? React Query intelligently memoizes the result of the `select` function. 
    // It only re-runs the filter if the raw `data` returned from the API actually changes.
    // This provides a highly performant, clean separation of concerns, giving our UI components 
    // pure, pre-filtered data to render without unnecessary calculation cycles.
    select: (data) => {
      if (params.q && params.q.trim() !== '') {
        const queryLower = params.q.trim().toLowerCase();
        
        // Strictly filter to ensure the query is found in the title
        const filteredProducts = data.products.filter((product) =>
          product.title.toLowerCase().includes(queryLower)
        );

        return {
          ...data,
          products: filteredProducts,
          // Update the total to reflect the locally filtered array length
          total: filteredProducts.length,
        };
      }
      
      // If no search query, return raw data untouched
      return data;
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
