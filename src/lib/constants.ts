import type { SectionId } from '@/types';

export interface NavItem {
  id: SectionId;
  label: string;
  shortLabel: string;
  icon: string; // SVG path data
}

export const NAV_ITEMS: NavItem[] = [
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
    id: 'practice',
    label: 'Practice',
    shortLabel: 'Practice',
    icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM12 14a2 2 0 100-4 2 2 0 000 4z',
  },
];

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
