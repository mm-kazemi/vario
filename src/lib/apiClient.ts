// Mentor Note: 
// Native fetch is great, but wrapping it allows us to centralize our base URL, 
// default headers, and, most importantly, our error handling. 
// If the API changes its domain or authentication requirements tomorrow, 
// we only need to update this single file instead of hunting down 50 fetch calls across components.
// We also strictly define the return type using a generic <T> so that every API call is strictly typed.

const BASE_URL = 'https://dummyjson.com';

interface FetchOptions extends RequestInit {
  // We can add custom options here in the future, like `requiresAuth: boolean`
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}` -> Example of where auth would go centrally
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Mentor Note: 
    // fetch only throws an error if the network request itself fails.
    // It does NOT throw on HTTP error statuses (like 404 or 500).
    // Therefore, we must manually check `response.ok` and throw an error to trigger React Query's error boundary.
    if (!response.ok) {
      // In a real app, you might parse response.json() to get a specific backend error message
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Since dummyjson always returns JSON, we safely parse and return it cast to our Generic Type <T>
    const data: T = await response.json();
    return data;
  } catch (error) {
    // Mentor Note: Centralized error logging could go here (e.g., Sentry, Datadog)
    console.error(`[apiClient] Error fetching ${url}:`, error);
    throw error;
  }
}
