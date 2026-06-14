import React, { ButtonHTMLAttributes } from 'react';

// Mentor Note:
// In an enterprise application, you DO NOT want developers styling individual buttons across 100 different pages.
// This leads to design inconsistencies, massive code duplication, and makes a global rebrand nearly impossible.
// By creating a single, centralized `Button` component that strictly extends `React.ButtonHTMLAttributes<HTMLButtonElement>`, 
// we guarantee that our custom button accepts all native HTML properties (like `type="submit"`, `onClick`, `disabled`, `aria-labels`) 
// out of the box, without needing to manually redefine them in our component's interface. 

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled, 
  ...props 
}: ButtonProps) {
  
  // Base classes that every button shares (flexbox alignment, typography, transitions)
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Variant-specific styling mapping
  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800 focus:ring-black",
    outline: "border-2 border-neutral-200 text-black hover:border-black hover:bg-neutral-50 focus:ring-black",
    ghost: "text-black hover:bg-neutral-100 focus:ring-neutral-200"
  };

  // Sizing (could be extracted to a prop if we needed sm/md/lg buttons)
  const sizeClasses = "px-4 py-2 text-sm";

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizeClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
