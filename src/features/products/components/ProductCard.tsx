'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product.types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, removeFromCart, updateQuantity } from '@/store/slices/cartSlice';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector((state) => state.cart.items.find(item => item.product.id === product.id));
  const currentQuantity = cartItem?.quantity || 0;

  const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

  // Mentor Note: Smart Inline Quantity Control
  // Why add inline controls on the product card itself?
  // 1. Reduced Friction: In a typical e-commerce flow, adding an item opens a disruptive modal. 
  //    If a user wants 3 of the same item, they have to click, open modal, click '+', '+', and close modal.
  // 2. Conversion Optimization: By mutating the Add button into an inline counter instantly, 
  //    the user stays focused on the product grid and can rapidly increment quantities without losing context.
  
  const handleDecrement = () => {
    if (currentQuantity === 1) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(updateQuantity({ id: product.id, quantity: currentQuantity - 1 }));
    }
  };

  const handleIncrement = () => {
    dispatch(updateQuantity({ id: product.id, quantity: currentQuantity + 1 }));
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-50/50 flex items-center justify-center p-6">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white tracking-wider">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <Link href={`/products/${product.id}`} className="text-base font-bold text-neutral-900 line-clamp-2 hover:text-black leading-snug" title={product.title}>
            {product.title}
          </Link>
          <div className="flex items-center gap-1 shrink-0 bg-neutral-100 px-2 py-1 rounded-md">
            <svg className="h-3.5 w-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold text-neutral-700">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between pt-4 gap-4 sm:gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-black">${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="text-sm font-medium text-neutral-400 line-through">${originalPrice}</span>
              )}
            </div>
          </div>
          
          <div className="shrink-0 flex items-center justify-end">
            {currentQuantity > 0 ? (
              <div className="flex items-center rounded-full border border-black bg-white shadow-sm overflow-hidden h-10 w-full sm:w-28 transition-all">
                <button 
                  onClick={handleDecrement}
                  className="flex-1 h-full flex items-center justify-center hover:bg-neutral-100 text-black font-medium transition-colors"
                  aria-label="Decrease quantity"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </button>
                <span className="w-8 text-center text-sm font-bold text-black border-x border-neutral-200">
                  {currentQuantity}
                </span>
                <button 
                  onClick={handleIncrement}
                  className="flex-1 h-full flex items-center justify-center hover:bg-neutral-100 text-black font-medium transition-colors"
                  aria-label="Increase quantity"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => dispatch(addToCart(product))}
                className="flex items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition-colors h-10 px-5 w-full sm:w-auto font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                aria-label="Add to cart"
              >
                Add
                <svg className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
