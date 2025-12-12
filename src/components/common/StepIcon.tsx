'use client';

export type StepIconType =
  | 'start'
  | 'ones'
  | 'tens'
  | 'hundreds'
  | 'thousands'
  | 'carry'
  | 'borrow'
  | 'check'
  | 'done'
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide';

interface StepIconProps {
  type: StepIconType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function StepIcon({ type, size = 'md', className = '' }: StepIconProps) {
  const sizeClass = SIZES[size];

  const icons: Record<StepIconType, React.ReactNode> = {
    // Eye icon for "Start" - look at the problem
    start: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
    ),

    // Single dot for "Ones"
    ones: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="6" />
      </svg>
    ),

    // Row of dots for "Tens"
    tens: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="6" cy="12" r="3" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
      </svg>
    ),

    // Grid of dots for "Hundreds"
    hundreds: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="12" cy="6" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="12" cy="12" r="2.5" />
        <circle cx="18" cy="12" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
      </svg>
    ),

    // Cube for "Thousands"
    thousands: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19 8l-7 3.5L5 8l7-3.5zM4 9.5l7 3.5v6.5l-7-3.5V9.5zm16 0v6.5l-7 3.5v-6.5l7-3.5z" />
      </svg>
    ),

    // Arrow up for "Carry"
    carry: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4l-8 8h5v8h6v-8h5l-8-8z" />
      </svg>
    ),

    // Arrow down for "Borrow"
    borrow: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 20l8-8h-5V4H9v8H4l8 8z" />
      </svg>
    ),

    // Checkmark in circle for "Check"
    check: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),

    // Checkmark for "Done"
    done: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    ),

    // Plus for "Add"
    add: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    ),

    // Minus for "Subtract"
    subtract: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13H5v-2h14v2z" />
      </svg>
    ),

    // X for "Multiply"
    multiply: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </svg>
    ),

    // Division symbol for "Divide"
    divide: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="6" r="2" />
        <path d="M5 11h14v2H5z" />
        <circle cx="12" cy="18" r="2" />
      </svg>
    ),
  };

  return icons[type] || null;
}

// Map text labels to icon types
export function labelToIconType(label: string): StepIconType {
  const labelMap: Record<string, StepIconType> = {
    start: 'start',
    ones: 'ones',
    tens: 'tens',
    hundreds: 'hundreds',
    thousands: 'thousands',
    carry: 'carry',
    borrow: 'borrow',
    check: 'check',
    done: 'done',
    add: 'add',
    subtract: 'subtract',
    multiply: 'multiply',
    divide: 'divide',
    addition: 'add',
    subtraction: 'subtract',
    multiplication: 'multiply',
    division: 'divide',
  };

  return labelMap[label.toLowerCase()] || 'start';
}
