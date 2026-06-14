'use client';

import React, { useState } from 'react';
import { useProduct } from '@/services/queries/product.queries';
import { Button } from '@/components/common/Button';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';

interface ProductDetailsProps {
  id: string;
}

export function ProductDetails({ id }: ProductDetailsProps) {
  const dispatch = useAppDispatch();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-12 animate-pulse">
        {/* Gallery Skeleton */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="aspect-square w-full bg-neutral-200 rounded-xl"></div>
          <div className="flex gap-4 overflow-x-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-20 shrink-0 bg-neutral-200 rounded-md"></div>
            ))}
          </div>
        </div>
        {/* Info Skeleton */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="h-4 w-24 bg-neutral-200 rounded"></div>
          <div className="h-10 w-3/4 bg-neutral-200 rounded"></div>
          <div className="h-6 w-1/4 bg-neutral-200 rounded"></div>
          <div className="h-24 w-full bg-neutral-200 rounded"></div>
          <div className="h-12 w-48 bg-neutral-200 rounded-full mt-8"></div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <svg className="mb-4 h-16 w-16 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mb-4 text-2xl font-bold text-neutral-900">Product not found</h2>
        <p className="mb-8 text-neutral-500 max-w-md mx-auto">We couldn't locate the product you're looking for. It may have been removed or the ID is invalid.</p>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="outline">Back to Products</Button>
          </Link>
          <Button onClick={() => refetch()} variant="primary">Try Again</Button>
        </div>
      </div>
    );
  }

  const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);
  const mainImage = selectedImage || product.thumbnail;

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Image Gallery */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="relative aspect-square w-full rounded-2xl bg-white border border-neutral-200 overflow-hidden flex items-center justify-center p-8 shadow-sm">
          <img 
            src={mainImage} 
            alt={product.title} 
            className="w-full h-full object-contain"
          />
        </div>
        {product.images && product.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative h-20 w-20 shrink-0 rounded-lg border-2 overflow-hidden bg-white ${
                  mainImage === img ? 'border-black' : 'border-transparent hover:border-neutral-300'
                } transition-colors`}
              >
                <img src={img} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="w-full lg:w-1/2 flex flex-col pt-4">
        {/* Breadcrumbs & Brand */}
        <div className="mb-4 flex items-center gap-2 text-sm text-neutral-500 uppercase tracking-wider font-semibold">
          <span>{product.category}</span>
          {product.brand && (
            <>
              <span>&bull;</span>
              <span className="text-black">{product.brand}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight">
          {product.title}
        </h1>

        {/* Rating & Stock */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-1">
            <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-neutral-700">{product.rating} Rating</span>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-bold ${
            product.availabilityStatus === 'In Stock' || product.stock > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.availabilityStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock')}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-end gap-4 mb-8">
          <span className="text-4xl font-extrabold text-black">${product.price.toFixed(2)}</span>
          {product.discountPercentage > 0 && (
            <div className="flex flex-col mb-1">
              <span className="text-sm font-bold text-red-500">Save {Math.round(product.discountPercentage)}%</span>
              <span className="text-lg text-neutral-400 line-through">${originalPrice}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="prose prose-neutral mb-10">
          <p className="text-neutral-600 leading-relaxed text-lg">
            {product.description}
          </p>
        </div>

        {/* Add to Cart Actions */}
        <div className="mt-auto border-t border-neutral-200 pt-8 flex gap-4">
          <Button 
            variant="primary" 
            className="flex-1 py-4 text-lg"
            onClick={() => {
              dispatch(addToCart(product));
              // Optionally we could show a toast notification here
            }}
          >
            Add to Cart
          </Button>
          <Button variant="outline" className="px-6">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Button>
        </div>
        
        <div className="mt-6 flex flex-col gap-2 text-sm text-neutral-500">
          <p className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            {product.shippingInformation}
          </p>
          <p className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            {product.warrantyInformation}
          </p>
        </div>
      </div>
    </div>
  );
}
