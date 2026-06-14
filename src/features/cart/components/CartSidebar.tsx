'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  selectTotalItems, 
  selectTotalPrice 
} from '@/store/slices/cartSlice';
import { Button } from '@/components/common/Button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalItems = useAppSelector(selectTotalItems);
  const totalPrice = useAppSelector(selectTotalPrice);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Shopping Cart ({totalItems})</h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-black transition-colors p-2"
            aria-label="Close Cart"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-neutral-500">
              <svg className="h-16 w-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-lg font-medium text-neutral-900">Your cart is empty.</p>
              <Button onClick={onClose} variant="outline">Continue Shopping</Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product.id} className="flex gap-4 items-center">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 p-2">
                  <img 
                    src={item.product.thumbnail} 
                    alt={item.product.title} 
                    className="h-full w-full object-contain"
                  />
                </div>
                
                <div className="flex flex-1 flex-col">
                  <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1">{item.product.title}</h3>
                  <p className="text-sm font-medium text-neutral-500 mt-1">${item.product.price.toFixed(2)}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center rounded border border-neutral-300 bg-white">
                      <button 
                        className="px-2 py-1 text-neutral-500 hover:text-black hover:bg-neutral-100"
                        onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity - 1 }))}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-2 py-1 text-xs font-semibold text-neutral-900 border-x border-neutral-300 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        className="px-2 py-1 text-neutral-500 hover:text-black hover:bg-neutral-100"
                        onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity + 1 }))}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => dispatch(removeFromCart(item.product.id))}
                      className="text-xs font-medium text-red-500 hover:text-red-700 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-6 space-y-4">
            <div className="flex justify-between text-base font-semibold text-neutral-900">
              <p>Subtotal</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <p className="text-xs text-neutral-500">Shipping and taxes calculated at checkout.</p>
            <div className="flex flex-col gap-2">
              <Button variant="primary" className="w-full py-3 text-base">
                Checkout
              </Button>
              <Button variant="ghost" onClick={() => dispatch(clearCart())} className="text-neutral-500">
                Clear Cart
              </Button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
