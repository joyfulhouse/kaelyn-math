// Session State Types
export interface ModuleProgress {
  questionsAttempted: number;
  questionsCorrect: number;
  bestStreak: number;
}

export interface StackedMathProgress {
  additionAttempted: number;
  additionCorrect: number;
  subtractionAttempted: number;
  subtractionCorrect: number;
}

export interface NumberPlacesProgress extends ModuleProgress {
  highestNumber: number;
}

export interface MultiplicationProgress extends ModuleProgress {
  tablesCompleted: number[];
}

export interface PracticeSession {
  score: number;
  total: number;
  type: ProblemType;
  date: string;
}

export interface PracticeProgress {
  totalSessions: number;
  totalProblems: number;
  totalCorrect: number;
  bestScore: number;
  recentScores: PracticeSession[];
}

// Reading Progress Types
export interface SightWordsProgress extends ModuleProgress {
  wordsLearned: string[];
  currentLevel: number;
}

export interface LettersProgress extends ModuleProgress {
  lettersLearned: string[];
  uppercaseComplete: boolean;
  lowercaseComplete: boolean;
}

export interface PhonicsProgress extends ModuleProgress {
  phonemesLearned: string[];
  wordsBlended: string[];
  currentUnit: number;
  unitsCompleted: number[];
}

export interface SessionState {
  userName: string;
  lessonsVisited: string[];
  lessonsCompleted: string[];
  // Math progress
  numberPlaces: NumberPlacesProgress;
  stackedMath: StackedMathProgress;
  multiplication: MultiplicationProgress;
  division: ModuleProgress;
  carryOver: ModuleProgress;
  borrowing: ModuleProgress;
  setsPairs: ModuleProgress;
  practice: PracticeProgress;
  // Reading progress
  sightWords: SightWordsProgress;
  letters: LettersProgress;
  phonics: PhonicsProgress;
  // Global
  totalStars: number;
  achievements: string[];
  lastActive: string;
}

// Problem Types
export type ProblemType = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Operation = 'addition' | 'subtraction';

export interface Problem {
  num1: number;
  num2: number;
  answer: number;
  type: ProblemType;
}

export interface StackedProblem extends Problem {
  carries?: boolean[];
  borrows?: boolean[];
}

export interface PlaceValueQuiz {
  number: number;
  place: 'thousands' | 'hundreds' | 'tens' | 'ones';
  answer: number;
  options: number[];
}

export interface MultiplicationQuiz {
  a: number;
  b: number;
  answer: number;
}

export interface DivisionQuiz {
  total: number;
  groups: number;
  answer: number;
}

// Sets and Pairs Quiz Types
export interface SetsQuiz {
  numSets: number;
  itemsPerSet: number;
  total: number;
  questionType: 'find-total' | 'find-sets' | 'find-items';
  options: number[];
}

export interface PairsQuiz {
  number: number;
  isEven: boolean;
  numPairs: number;
  leftover: number;
}

export interface CompareQuiz {
  setA: number;
  setB: number;
  answer: 'more' | 'fewer' | 'same';
}

// Subject Types
export type SubjectId = 'math' | 'reading';

// Navigation Types
export type SectionId =
  // Global
  | 'home'
  // Math sections
  | 'number-places'
  | 'stacked-math'
  | 'carry-over'
  | 'borrowing'
  | 'multiplication'
  | 'division'
  | 'sets-pairs'
  | 'practice'
  // Reading sections
  | 'sight-words'
  | 'letters'
  | 'phonics';

// Subject configuration
export interface SubjectConfig {
  id: SubjectId;
  label: string;
  icon: string;
  color: string;
  sections: SectionId[];
}

// Animation State
export interface AnimationState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
}

// Carry/Borrow State
export interface CarryState {
  carriedColumns: boolean[];
  columnSums: number[];
  finalCarry: number;
}

export interface BorrowState {
  displayDigits: number[];
  originalDigits: number[];
  bottomDigits: number[];
  borrowed: boolean[];
  receivedBorrow: boolean[];
}

// Score Tracking
export interface Score {
  correct: number;
  total: number;
}

// Place Value
export type PlaceValue = 'thousands' | 'hundreds' | 'tens' | 'ones';

// Re-export StepIconType from StepIcon component for convenience
export type { StepIconType } from '@/components/common/StepIcon';

export const PLACE_VALUES: PlaceValue[] = ['thousands', 'hundreds', 'tens', 'ones'];

export const PLACE_VALUE_MULTIPLIERS: Record<PlaceValue, number> = {
  thousands: 1000,
  hundreds: 100,
  tens: 10,
  ones: 1,
};

export const PLACE_VALUE_COLORS: Record<PlaceValue, string> = {
  thousands: 'coral',
  hundreds: 'yellow',
  tens: 'sage',
  ones: 'sky',
};
