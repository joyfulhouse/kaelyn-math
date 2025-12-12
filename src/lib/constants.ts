import type { SectionId, SubjectId, SubjectConfig } from '@/types';

export interface NavItem {
  id: SectionId;
  label: string;
  shortLabel: string;
  icon: string; // SVG path data
}

// Subject configurations
export const SUBJECTS: SubjectConfig[] = [
  {
    id: 'math',
    label: 'Math',
    icon: 'M12 4v16m-8-8h16', // Plus sign
    color: 'coral',
    sections: ['home', 'number-places', 'stacked-math', 'carry-over', 'borrowing', 'multiplication', 'division', 'sets-pairs', 'practice'],
  },
  {
    id: 'reading',
    label: 'Reading',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', // Book icon
    color: 'sage',
    sections: ['home', 'sight-words', 'letters', 'phonics'],
  },
];

// Math navigation items
export const MATH_NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    shortLabel: 'Home',
    icon: 'M3 12L12 3L21 12V21H15V15H9V21H3V12Z',
  },
  {
    id: 'number-places',
    label: 'Number Places',
    shortLabel: 'Places',
    icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  },
  {
    id: 'stacked-math',
    label: 'Stacked Math',
    shortLabel: 'Stack',
    icon: 'M4 4h16v4H4zM4 10h16v4H4zM4 16h16v4H4z',
  },
  {
    id: 'carry-over',
    label: 'Carry Over',
    shortLabel: 'Carry',
    icon: 'M12 19V5M12 5L5 12M12 5L19 12',
  },
  {
    id: 'borrowing',
    label: 'Borrowing',
    shortLabel: 'Borrow',
    icon: 'M12 5V19M12 19L5 12M12 19L19 12',
  },
  {
    id: 'multiplication',
    label: 'Multiplication',
    shortLabel: 'Multiply',
    icon: 'M18 6L6 18M6 6L18 18',
  },
  {
    id: 'division',
    label: 'Division',
    shortLabel: 'Divide',
    icon: 'M12 6a2 2 0 100-4 2 2 0 000 4zM5 12h14M12 18a2 2 0 100 4 2 2 0 000-4z',
  },
  {
    id: 'sets-pairs',
    label: 'Sets & Pairs',
    shortLabel: 'Sets',
    icon: 'M4 4h6v6H4zM14 4h6v6h-6zM9 14h6v6H9z',
  },
  {
    id: 'practice',
    label: 'Practice',
    shortLabel: 'Practice',
    icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM12 14a2 2 0 100-4 2 2 0 000 4z',
  },
];

// Reading navigation items
export const READING_NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    shortLabel: 'Home',
    icon: 'M3 12L12 3L21 12V21H15V15H9V21H3V12Z',
  },
  {
    id: 'sight-words',
    label: 'Sight Words',
    shortLabel: 'Words',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  },
  {
    id: 'letters',
    label: 'Letters & ABC',
    shortLabel: 'ABC',
    icon: 'M3 7h4l3 10h4l3-10h4M7 12h10',
  },
  {
    id: 'phonics',
    label: 'Phonics',
    shortLabel: 'Phonics',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  },
];

// Legacy export for backwards compatibility
export const NAV_ITEMS = MATH_NAV_ITEMS;

// Get navigation items for a specific subject
export function getNavItemsForSubject(subjectId: SubjectId): NavItem[] {
  return subjectId === 'math' ? MATH_NAV_ITEMS : READING_NAV_ITEMS;
}

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy (1-10)' },
  { value: 'medium', label: 'Medium (10-100)' },
  { value: 'hard', label: 'Hard (100-1000)' },
] as const;

export const PROBLEM_TYPE_OPTIONS = [
  { value: 'addition', label: 'Addition' },
  { value: 'subtraction', label: 'Subtraction' },
  { value: 'multiplication', label: 'Multiplication' },
  { value: 'division', label: 'Division' },
  { value: 'mixed', label: 'Mixed' },
] as const;
