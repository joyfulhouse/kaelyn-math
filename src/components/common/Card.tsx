'use client';

import { type HTMLAttributes, forwardRef } from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'module';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-paper shadow-soft',
  elevated: 'bg-paper shadow-medium',
  outlined: 'bg-paper border-2 border-chocolate/10',
  module:
    'bg-paper shadow-soft hover:shadow-lifted hover:-translate-y-1 cursor-pointer',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', interactive = false, className = '', children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl p-6 transition-all duration-200
          ${variantStyles[variant]}
          ${interactive ? 'cursor-pointer hover:shadow-lifted hover:-translate-y-0.5' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card subcomponents
export function CardHeader({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`font-display text-xl font-bold text-chocolate ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`mt-1 font-body text-sm text-chocolate/70 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 flex items-center gap-2 ${className}`} {...props}>
      {children}
    </div>
  );
}
