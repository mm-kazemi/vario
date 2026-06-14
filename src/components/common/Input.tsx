import React, { InputHTMLAttributes } from 'react';

// Mentor Note:
// Similar to the Button component, our Input component extends `React.InputHTMLAttributes<HTMLInputElement>`.
// This is critical because forms require native accessibility features (aria-attributes), 
// standard events (onChange, onFocus, onBlur), and standard attributes (value, defaultValue, placeholder).
// If we didn't extend native types, we'd have to manually map every single input event and property, 
// creating a fragile and unmaintainable component. This component acts as a "Dumb" (stateless) presentation layer.

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // We can add custom props later, like `hasError`, `icon`, or `helperText`
}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder-neutral-400 
      focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50 
      disabled:bg-neutral-100 ${className}`}
      {...props}
    />
  );
}
