'use client';

import React from 'react';
import { useURLFilters } from '@/hooks/useURLFilters';
import { Button } from '@/components/common/Button';

interface PaginationProps {
  total: number;
  limit: number;
}

export function Pagination({ total, limit }: PaginationProps) {
  const { searchParams, updateFilters } = useURLFilters();

  const currentSkip = parseInt(searchParams.get('skip') || '0', 10);
  const currentPage = Math.floor(currentSkip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    const newSkip = Math.max(0, currentSkip - limit);
    updateFilters({ skip: newSkip === 0 ? null : newSkip });
  };

  const handleNext = () => {
    const newSkip = currentSkip + limit;
    if (newSkip < total) {
      updateFilters({ skip: newSkip });
    }
  };

  return (
    <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-4 py-3 sm:px-6 mt-8 rounded-xl shadow-sm">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-700">
            Showing <span className="font-medium">{currentSkip + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentSkip + limit, total)}</span> of{' '}
            <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentSkip === 0}
          >
            Previous
          </Button>
          <div className="flex items-center justify-center px-4 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button 
            variant="outline" 
            onClick={handleNext} 
            disabled={currentSkip + limit >= total}
          >
            Next
          </Button>
        </div>
      </div>
      
      {/* Mobile view */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button variant="outline" onClick={handlePrevious} disabled={currentSkip === 0}>
          Previous
        </Button>
        <Button variant="outline" onClick={handleNext} disabled={currentSkip + limit >= total}>
          Next
        </Button>
      </div>
    </div>
  );
}
