'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store/store';

// Mentor Note:
// Redux Toolkit requires the store to be passed down via the <Provider> component, which relies on React Context.
// Context is exclusively a client-side feature. If we put <Provider> directly in our Root Layout (`layout.tsx`), 
// we would have to mark the entire layout with `"use client"`, which disables Server-Side Rendering (SSR) 
// for everything inside it. 
// By creating this separate wrapper file with `"use client"`, the Root Layout remains a Server Component, 
// and only the Provider boundary and its direct React Context consumers become client-aware.

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // We use useRef to ensure that the store is only created once per client session
  const storeRef = useRef<AppStore>(null);
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
