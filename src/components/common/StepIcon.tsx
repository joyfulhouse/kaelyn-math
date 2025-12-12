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
  | 'divide'
  // Reading icons
  | 'word'
  | 'letter'
  | 'book'
  | 'phonics';

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

    // Eye icon for "Word" - sight words
    word: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),

    // ABC letters for "Letter"
    letter: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
      </svg>
    ),

    // Open book for "Book"
    book: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
      </svg>
    ),

    // Speaker with sound waves for "Phonics"
    phonics: (
      <svg className={`${sizeClass} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
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
    // Reading mappings
    word: 'word',
    letter: 'letter',
    book: 'book',
    phonics: 'phonics',
    'sight-words': 'word',
    letters: 'letter',
    reading: 'book',
  };

  return labelMap[label.toLowerCase()] || 'start';
}
