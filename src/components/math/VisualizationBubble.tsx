'use client';

import { type ReactNode } from 'react';

interface VisualizationBubbleProps {
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'info' | 'success' | 'warning' | 'highlight';
  showPointer?: boolean;
}

const variantStyles = {
  info: 'bg-sky/20 border-sky text-sky',
  success: 'bg-sage/20 border-sage text-sage',
  warning: 'bg-yellow/20 border-yellow text-chocolate',
  highlight: 'bg-coral/20 border-coral text-coral',
};

export function VisualizationBubble({
  children,
  position = 'top',
  variant = 'info',
  showPointer = true,
}: VisualizationBubbleProps) {
  return (
    <div
      className={`
        relative rounded-xl border-2 px-4 py-2 font-body text-sm
        ${variantStyles[variant]}
      `}
    >
      {children}

      {showPointer && (
        <div
          className={`
            absolute h-3 w-3 rotate-45 border-2
            ${variantStyles[variant]}
            ${
              position === 'top'
                ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-t-0 border-l-0 bg-inherit'
                : position === 'bottom'
                  ? '-top-1.5 left-1/2 -translate-x-1/2 border-b-0 border-r-0 bg-inherit'
                  : position === 'left'
                    ? '-right-1.5 top-1/2 -translate-y-1/2 border-l-0 border-b-0 bg-inherit'
                    : '-left-1.5 top-1/2 -translate-y-1/2 border-r-0 border-t-0 bg-inherit'
            }
          `}
        />
      )}
    </div>
  );
}

// Helper text for explanations
interface ExplanationTextProps {
  children: ReactNode;
  highlight?: string;
}

export function ExplanationText({ children, highlight }: ExplanationTextProps) {
  return (
    <p className="font-body text-base text-chocolate leading-relaxed">
      {children}
      {highlight && (
        <span className="ml-1 font-semibold text-coral">{highlight}</span>
      )}
    </p>
  );
}

// Step-by-step instruction box
interface InstructionBoxProps {
  step: number;
  title: string;
  description: string;
  isActive?: boolean;
}

export function InstructionBox({
  step,
  title,
  description,
  isActive = false,
}: InstructionBoxProps) {
  return (
    <div
      className={`
        flex gap-4 rounded-xl p-4 transition-all duration-200
        ${isActive ? 'bg-coral/10 ring-2 ring-coral' : 'bg-cream'}
      `}
    >
      <div
        className={`
          flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full
          font-display font-bold
          ${isActive ? 'bg-coral text-cream' : 'bg-chocolate/10 text-chocolate/60'}
        `}
      >
        {step}
      </div>
      <div>
        <h4
          className={`
            font-display font-semibold
            ${isActive ? 'text-coral' : 'text-chocolate'}
          `}
        >
          {title}
        </h4>
        <p className="mt-1 font-body text-sm text-chocolate/70">{description}</p>
      </div>
    </div>
  );
}
