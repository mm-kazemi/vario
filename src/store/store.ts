import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';

// Mentor Note:
// In Next.js App Router, the server can handle multiple requests simultaneously. 
// If we define the Redux store as a global variable outside of a function, 
// state from User A could leak into User B's request (Cross-Request State Pollution). 
// To fix this, we use the `makeStore` pattern to ensure a fresh, isolated store instance is created per request.

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    // Middleware can be customized here if needed
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
