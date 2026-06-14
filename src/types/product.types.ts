// Mentor Note: 
// In a scalable enterprise environment, we define our global types and interfaces in a dedicated `types` directory. 
// This ensures strong typing across the entire application (e.g., components, API calls, Redux slices). 
// By separating types from implementation, we avoid circular dependencies and make the codebase easier to refactor. 
// We are using `interface` instead of `type` here because interfaces are more extensible (can be merged or extended),
// which is a standard best practice in large TypeScript codebases.

/**
 * Interface representing a single Product from the dummyjson.com API.
 * Mentor Note: All fields are explicitly typed to avoid the `any` type at all costs.
 * Optional fields (marked with `?`) are used only when the API doesn't guarantee the field's presence.
 */
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

/**
 * Standard API response wrapper for products containing pagination metadata.
 * Mentor Note: This standardizes how we handle lists of data across the app. 
 * Any API call returning a list of products will use this structure, making the TanStack Query configuration predictable.
 */
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * URL Query Parameters for Search, Filter, and Pagination.
 * Mentor Note: Syncing these parameters with Next.js URL query params is critical for deep linking,
 * SEO, and shareable URLs. By creating a strict interface, we ensure that the components and TanStack Query
 * use valid parameter names and types, preventing runtime errors.
 */
export interface ProductQueryParams {
  q?: string;         // Search query
  category?: string;  // Category filter
  sortBy?: string;    // Field to sort by (e.g., 'price', 'rating')
  order?: 'asc' | 'desc'; // Sort order
  limit?: number;     // Items per page
  skip?: number;      // Pagination offset
}
