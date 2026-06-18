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

  // Mentor Note: Dynamic REST Endpoint Routing
  // WHY ARE WE DOING THIS? 
  // In many external REST APIs (like DummyJSON), text search and filtering are not 
  // universally handled by a single `/products` endpoint via query parameters. 
  // Instead, the API architecture dictates separate endpoints:
  // - Base: `/products`
  // - Search: `/products/search?q=phone`
  // - Category: `/products/category/smartphones`
  //
  // The Bug: We were sending `q=essen` to the base `/products` endpoint, which ignored it.
  // The Fix: We intercept the query parameters before constructing the request. 
  // If `q` exists and is not empty, we dynamically rewrite the base URL to `/products/search`. 
  // This is an extremely common enterprise pattern: abstracting the quirks of external APIs 
  // inside your service layer so your UI components remain blissfully ignorant.
  
  let basePath = '/products';
  
  if (q && q.trim() !== '') {
    basePath = '/products/search';
  } else if (category) {
    // DummyJSON does not natively support combining category and search endpoints.
    // If both exist somehow, search takes priority. Otherwise, use the category endpoint.
    basePath = `/products/category/${category}`;
  }

  // Construct URLSearchParams safely
  const queryParams = new URLSearchParams();
  
  if (q && q.trim() !== '') queryParams.append('q', q.trim());
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
