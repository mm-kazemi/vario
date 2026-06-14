'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Mentor Note:
// Just like Redux, TanStack Query (React Query) relies on React Context via <QueryClientProvider>.
// We must wrap it in a `"use client"` directive so we can inject it into our Server Component layout.
//
// Crucial Architecture Decision:
// We instantiate the QueryClient inside `useState` rather than outside the component.
// Why? Because if we declare it globally outside the component, Next.js could potentially share the SAME 
// QueryClient instance across different users during Server-Side Rendering (SSR). This would leak 
// User A's fetched data into User B's page. `useState` ensures a unique instance is created per user/request.

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Mentor Note:
            // StaleTime determines how long fetched data is considered "fresh".
            // During this time, TanStack Query will NOT refetch the data in the background.
            // Setting this to something above 0 (e.g., 60 seconds) prevents unnecessary API calls
            // when navigating back and forth quickly.
            staleTime: 60 * 1000, 
            refetchOnWindowFocus: false, // Prevents refetching just because the user switched browser tabs
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
