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

  // Mentor Note: Handling Mutually Exclusive Endpoints & Safe Query Parameters
  // In many real-world REST APIs, text search and category filtering are mutually exclusive 
  // operations with distinct architectural endpoints. DummyJSON strictly separates them:
  // - Search: `/products/search?q={query}`
  // - Category: `/products/category/{categoryName}`
  // - Base: `/products`
  // 
  // We prioritize text search. If a user types a query, we drop the category filter and hit 
  // the `/search` endpoint. If they clear the search, we hit the category endpoint (if selected).
  // 
  // Why `URLSearchParams`? 
  // Enterprise apps NEVER construct query strings via manual concatenation (e.g., `?q=${q}&limit=${limit}`).
  // That approach is highly prone to malformed URLs and injection bugs (e.g., if a search query contains `&` or `=`).
  // `URLSearchParams` natively handles URL-encoding (converting spaces to `%20`, ampersands to `%26`, etc.) 
  // and cleanly handles undefined or null parameters, ensuring a robust, error-free URL.
  
  let basePath = '/products';
  
  // Endpoint Priority Logic
  if (q && q.trim() !== '') {
    basePath = '/products/search';
  } else if (category && category !== 'all') {
    basePath = `/products/category/${category}`;
  }

  // Parameter Construction using native URLSearchParams
  const queryParams = new URLSearchParams();
  
  // Only append 'q' if we are actually using the search endpoint
  if (q && q.trim() !== '') {
    queryParams.append('q', q.trim());
  }
  
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
