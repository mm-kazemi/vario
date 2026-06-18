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
  // Mentor Note: Mock BFF Pattern & Fetching All Data
  // Previously, we tried to dynamically route to `/products/search` or `/products/category`.
  // However, DummyJSON's backend cannot accurately combine text search, category filters, 
  // sorting, AND pagination. If the backend only returns 30 items per page, our client-side 
  // filters will only search those 30 items, completely missing matching products on page 5!
  //
  // The Enterprise Fix: When dealing with broken or highly constrained third-party APIs
  // with small datasets (~200 items), we fetch the ENTIRE catalog once. We then use 
  // React Query's `select` option to build a complete "Data Engine" that perfectly handles 
  // filtering, sorting, and pagination in memory.
  
  return apiClient<ProductsResponse>('/products?limit=0');
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
