'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';

type InputSize = 'sm' | 'md' | 'lg' | 'digit';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  error?: boolean;
  success?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-base rounded-xl',
  lg: 'px-5 py-3 text-lg rounded-2xl',
  digit:
    'w-12 h-14 text-center text-2xl font-display font-bold rounded-xl',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', error = false, success = false, className = '', ...props }, ref) => {
    const stateStyles = error
      ? 'border-coral focus:border-coral focus:ring-coral/20'
      : success
        ? 'border-sage focus:border-sage focus:ring-sage/20'
        : 'border-chocolate/20 focus:border-sky focus:ring-sky/20';

    return (
      <input
        ref={ref}
        className={`
          border-2 bg-cream font-body text-chocolate
          outline-none transition-all duration-200
          placeholder:text-chocolate/40
          focus:ring-4
          disabled:cursor-not-allowed disabled:opacity-50
          ${sizeStyles[size]}
          ${stateStyles}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

// Special digit input for math problems
interface DigitInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean;
  success?: boolean;
  highlighted?: boolean;
}

export const DigitInput = forwardRef<HTMLInputElement, DigitInputProps>(
  ({ error = false, success = false, highlighted = false, className = '', ...props }, ref) => {
    const stateStyles = error
      ? 'border-coral bg-coral/10 animate-shake'
      : success
        ? 'border-sage bg-sage/10'
        : highlighted
          ? 'border-yellow bg-yellow/10'
          : 'border-chocolate/20 bg-cream';

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        maxLength={2}
        className={`
          w-12 h-14 text-center text-2xl font-display font-bold rounded-xl
          border-2 outline-none transition-all duration-200
          focus:border-sky focus:ring-4 focus:ring-sky/20
          disabled:cursor-not-allowed disabled:opacity-50
          ${stateStyles}
          ${className}
        `}
        {...props}
      />
    );
  }
);

DigitInput.displayName = 'DigitInput';
