import { apiClient } from '@/lib/apiClient';
import { ProductsResponse, ProductQueryParams, Product } from '@/types/product.types';

// Let's define the Category type inline here for simplicity, though it could live in product.types.ts
export interface Category {
  slug: string;
  name: string;
  url: string;
}

// Mentor Note:
// Separation of Concerns (SoC) is a vital enterprise pattern. 
// We separate the RAW API calls (this file) from the React Query hooks (product.queries.ts).
// Why? 
// 1. Reusability: We might need to fetch products outside of a React Component (e.g., in a Redux Thunk, 
//    a Next.js Server Action, or a Node.js script). If the fetch logic is tightly coupled to `useQuery`, 
//    we can't easily reuse it.
// 2. Testability: We can easily mock these pure asynchronous functions in our unit tests without 
//    needing to render a React Query Provider.

/**
 * Fetches products from the DummyJSON API.
 * Dynamically handles routing based on search queries or category filters, 
 * and appends pagination/sorting query parameters.
 */
export const getProducts = async (params: ProductQueryParams = {}): Promise<ProductsResponse> => {
  const { q, category, limit, skip, sortBy, order } = params;

  // Determine the base path based on search or category
  let basePath = '/products';
  if (q) {
    basePath = '/products/search';
  } else if (category) {
    // Note: DummyJSON doesn't support search and category simultaneously in a single endpoint out of the box,
    // so we prioritize search if both happen to be present.
    basePath = `/products/category/${category}`;
  }

  // Construct URLSearchParams safely
  const queryParams = new URLSearchParams();
  
  if (q) queryParams.append('q', q);
  if (limit !== undefined) queryParams.append('limit', limit.toString());
  if (skip !== undefined) queryParams.append('skip', skip.toString());
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (order) queryParams.append('order', order);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `${basePath}?${queryString}` : basePath;

  return apiClient<ProductsResponse>(endpoint);
};

/**
 * Fetches the list of available product categories.
 */
export const getCategories = async (): Promise<Category[]> => {
  return apiClient<Category[]>('/products/categories');
};

/**
 * Fetches a single product by its ID.
 */
export const getProductById = async (id: number | string): Promise<Product> => {
  return apiClient<Product>(`/products/${id}`);
};
