import type { Problem, Difficulty, ProblemType, PlaceValueQuiz, MultiplicationQuiz, DivisionQuiz } from '@/types';
import { needsCarry, needsBorrow } from './mathUtils';

/**
 * Get range based on difficulty
 */
function getRange(difficulty: Difficulty): { min: number; max: number } {
  switch (difficulty) {
    case 'easy':
      return { min: 1, max: 10 };
    case 'medium':
      return { min: 10, max: 100 };
    case 'hard':
      return { min: 100, max: 1000 };
    default:
      return { min: 1, max: 10 };
  }
}

/**
 * Generate a random number in range
 */
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate an addition problem
 */
export function generateAdditionProblem(difficulty: Difficulty): Problem {
  const { min, max } = getRange(difficulty);
  const num1 = randomInRange(min, max);
  const num2 = randomInRange(min, max);
  return {
    num1,
    num2,
    answer: num1 + num2,
    type: 'addition',
  };
}

/**
 * Generate a subtraction problem (ensures positive result)
 */
export function generateSubtractionProblem(difficulty: Difficulty): Problem {
  const { min, max } = getRange(difficulty);
  let num1 = randomInRange(min, max);
  let num2 = randomInRange(min, max);

  // Ensure num1 >= num2 for positive result
  if (num2 > num1) {
    [num1, num2] = [num2, num1];
  }

  return {
    num1,
    num2,
    answer: num1 - num2,
    type: 'subtraction',
  };
}

/**
 * Generate a multiplication problem (capped at 12x12)
 */
export function generateMultiplicationProblem(_difficulty: Difficulty): Problem {
  // Multiplication is always 1-12 regardless of difficulty
  const num1 = randomInRange(1, 12);
  const num2 = randomInRange(1, 12);
  return {
    num1,
    num2,
    answer: num1 * num2,
    type: 'multiplication',
  };
}

/**
 * Generate a division problem (clean division, capped at 12)
 */
export function generateDivisionProblem(_difficulty: Difficulty): Problem {
  // Generate factors first to ensure clean division
  const num2 = randomInRange(1, 12); // divisor
  const answer = randomInRange(1, 12); // quotient
  const num1 = num2 * answer; // dividend

  return {
    num1,
    num2,
    answer,
    type: 'division',
  };
}

const MAX_ITERATIONS = 100;

/**
 * Generate a problem that requires carrying
 */
export function generateCarryProblem(): Problem {
  let num1: number, num2: number;
  let iterations = 0;

  do {
    num1 = randomInRange(100, 799);
    num2 = randomInRange(100, 799);
    iterations++;
    // Safety guard: if we can't find a valid problem, use fallback values
    if (iterations >= MAX_ITERATIONS) {
      num1 = 156;
      num2 = 278;
      break;
    }
  } while (!needsCarry(num1, num2));

  return {
    num1,
    num2,
    answer: num1 + num2,
    type: 'addition',
  };
}

/**
 * Generate a problem that requires borrowing
 */
export function generateBorrowProblem(): Problem {
  let num1: number, num2: number;
  let iterations = 0;

  do {
    num1 = randomInRange(200, 599);
    num2 = randomInRange(100, num1 - 100);
    iterations++;
    // Safety guard: if we can't find a valid problem, use fallback values
    if (iterations >= MAX_ITERATIONS) {
      num1 = 423;
      num2 = 187;
      break;
    }
  } while (!needsBorrow(num1, num2) || num1 <= num2);

  return {
    num1,
    num2,
    answer: num1 - num2,
    type: 'subtraction',
  };
}

/**
 * Generate a problem based on type and difficulty
 */
export function generateProblem(type: ProblemType, difficulty: Difficulty): Problem {
  switch (type) {
    case 'addition':
      return generateAdditionProblem(difficulty);
    case 'subtraction':
      return generateSubtractionProblem(difficulty);
    case 'multiplication':
      return generateMultiplicationProblem(difficulty);
    case 'division':
      return generateDivisionProblem(difficulty);
    case 'mixed':
      const types: ProblemType[] = ['addition', 'subtraction', 'multiplication', 'division'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      return generateProblem(randomType, difficulty);
    default:
      return generateAdditionProblem(difficulty);
  }
}

/**
 * Generate multiple problems
 */
export function generateProblems(
  type: ProblemType,
  count: number,
  difficulty: Difficulty
): Problem[] {
  return Array.from({ length: count }, () => generateProblem(type, difficulty));
}

/**
 * Generate a place value quiz question
 */
export function generatePlaceValueQuiz(maxNumber: number = 9999): PlaceValueQuiz {
  const number = randomInRange(1, maxNumber);
  const places: ('thousands' | 'hundreds' | 'tens' | 'ones')[] = ['thousands', 'hundreds', 'tens', 'ones'];
  const place = places[Math.floor(Math.random() * places.length)];

  const placeValues = {
    thousands: Math.floor(number / 1000) % 10,
    hundreds: Math.floor(number / 100) % 10,
    tens: Math.floor(number / 10) % 10,
    ones: number % 10,
  };

  const answer = placeValues[place];

  // Generate options from the digits in the number (in order)
  const digits = number.toString().split('').map(Number);
  const uniqueDigits = [...new Set(digits)];

  // If we have fewer than 4 unique digits, add some random ones
  while (uniqueDigits.length < 4) {
    const randomDigit = randomInRange(0, 9);
    if (!uniqueDigits.includes(randomDigit)) {
      uniqueDigits.push(randomDigit);
    }
  }

  // Keep digits in the order they appear in the number, then add extras
  const options = digits.slice(0, 4);
  if (options.length < 4) {
    const extras = uniqueDigits.filter(d => !options.includes(d));
    options.push(...extras.slice(0, 4 - options.length));
  }

  return {
    number,
    place,
    answer,
    options: options.slice(0, 4),
  };
}

/**
 * Generate a multiplication quiz
 */
export function generateMultiplicationQuiz(): MultiplicationQuiz {
  const a = randomInRange(1, 12);
  const b = randomInRange(1, 12);
  return {
    a,
    b,
    answer: a * b,
  };
}

/**
 * Generate a division quiz (clean division)
 */
export function generateDivisionQuiz(): DivisionQuiz {
  const groups = randomInRange(1, 12);
  const answer = randomInRange(1, 12);
  const total = groups * answer;

  return {
    total,
    groups,
    answer,
  };
}
