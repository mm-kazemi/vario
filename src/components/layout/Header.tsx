'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAppSelector } from '@/store/hooks';
import { selectTotalItems } from '@/store/slices/cartSlice';
import { CartSidebar } from '@/features/cart/components/CartSidebar';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Mentor Note:
  // Here we consume the derived selector from our Redux store.
  // Because it's managed by Redux Toolkit, any component anywhere in the app 
  // can dispatch an `addToCart` action, and this Header badge will instantly and reactively update.
  const totalItems = useAppSelector(selectTotalItems);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <Link href="/" className="font-bold text-2xl tracking-tighter text-black flex-shrink-0">
            VARIO.
          </Link>

          <div className="flex-1 max-w-lg hidden md:block">
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="pl-10 rounded-full bg-neutral-100 border-transparent focus:bg-white focus:border-black"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              aria-label="Shopping Cart"
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <svg className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-1 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
          
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
