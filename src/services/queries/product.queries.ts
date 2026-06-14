import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories, getProductById } from '../api/product.api';
import { ProductQueryParams } from '@/types/product.types';

// Mentor Note:
// Query Keys are fundamentally how React Query caches and invalidates data.
// In an enterprise app, we use a structured array pattern for Query Keys. 
// The first element is the domain ('products'), the second is the specific entity ('list' or 'categories'), 
// and the third is the dependency object (the query params).
// WHY? 
// 1. Cache Collisions: If we just used `['products']` for everything, changing the page number would 
//    overwrite the cache for page 1! By including the `params` object in the array, React Query 
//    automatically creates a separate, unique cache entry for EVERY combination of search/filter/pagination.
// 2. Precise Invalidation: If an admin adds a new product, we can invalidate `['products', 'list']` 
//    to refresh all product lists, regardless of their specific parameters.

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
    // Placeholder for future configuration (e.g. keepPreviousData for smooth pagination)
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
