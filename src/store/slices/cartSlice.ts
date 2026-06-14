import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Product } from '@/types/product.types';
import { RootState } from '../store';

// Mentor Note:
// WHY REDUX TOOLKIT HERE AND NOT TANSTACK QUERY?
// TanStack Query is perfect for "Server State" (asynchronous, owned by the server, needs caching/refetching).
// The Shopping Cart, however, is pure "Client State". It is synchronous, heavily interacted with locally,
// and must be globally shared across completely unrelated components (e.g., the Header icon, the Cart Sidebar, 
// and the Product pages). Redux Toolkit excels at this predictability and strict unidirectional data flow.

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.product.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Mentor Note: Derived Data (Selectors)
// Enterprise Best Practice: Notice how we DO NOT store `totalPrice` or `totalItems` inside the Redux State object.
// Why? Because it leads to state synchronization bugs (e.g., updating an item quantity but forgetting to update the total).
// Instead, we store the absolute minimum state (the items array) and DERIVE the totals on the fly using Selectors.
// `createSelector` memoizes the result, so it only recalculates when the `items` array actually changes, ensuring high performance.

const selectCartItems = (state: RootState) => state.cart.items;

export const selectTotalItems = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectTotalPrice = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => {
    // Optionally calculate with discount if desired, using raw price here
    return total + (item.product.price * item.quantity);
  }, 0)
);

export default cartSlice.reducer;
