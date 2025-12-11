/**
 * Calculate carry positions for addition
 * Returns array where carries[i] = true means there's a carry INTO position i (from position i+1)
 */
export function calculateCarryPositions(num1: number, num2: number, totalLen: number): boolean[] {
  const str1 = num1.toString().padStart(totalLen, '0');
  const str2 = num2.toString().padStart(totalLen, '0');
  const carries: boolean[] = Array(totalLen).fill(false);
  let carry = 0;

  // Process from right to left (ones to highest place)
  for (let i = totalLen - 1; i >= 0; i--) {
    const d1 = parseInt(str1[i]) || 0;
    const d2 = parseInt(str2[i]) || 0;
    const sum = d1 + d2 + carry;
    carry = sum >= 10 ? 1 : 0;
    // Mark the column to the LEFT as receiving a carry
    if (carry === 1 && i > 0) {
      carries[i - 1] = true;
    }
  }

  return carries;
}

/**
 * Calculate borrow adjustments for subtraction
 */
export function calculateBorrowAdjustments(
  num1: number,
  num2: number,
  totalLen: number
): { borrows: boolean[]; adjusted: number[] } {
  const str1 = num1.toString().padStart(totalLen, '0');
  const str2 = num2.toString().padStart(totalLen, '0');
  const adjusted = str1.split('').map(Number);
  const borrows: boolean[] = [];

  for (let i = totalLen - 1; i >= 0; i--) {
    const d2 = parseInt(str2[i]) || 0;
    if (adjusted[i] < d2 && i > 0) {
      borrows[i] = true;
      adjusted[i] += 10;
      let j = i - 1;
      while (j >= 0 && adjusted[j] === 0) {
        adjusted[j] = 9;
        j--;
      }
      if (j >= 0) adjusted[j] -= 1;
    }
  }

  return { borrows, adjusted };
}

/**
 * Calculate column sums for interactive carry validation
 */
export function calculateColumnSums(
  num1: number,
  num2: number,
  totalLen: number
): { columnSums: number[]; finalCarry: number } {
  const str1 = num1.toString().padStart(totalLen, '0');
  const str2 = num2.toString().padStart(totalLen, '0');
  const columnSums: number[] = [];
  let carry = 0;

  for (let i = totalLen - 1; i >= 0; i--) {
    const d1 = parseInt(str1[i]) || 0;
    const d2 = parseInt(str2[i]) || 0;
    const sum = d1 + d2 + carry;
    columnSums[i] = sum;
    carry = sum >= 10 ? 1 : 0;
  }

  return { columnSums, finalCarry: carry };
}

/**
 * Check if subtraction needs borrowing
 */
export function needsBorrow(num1: number, num2: number): boolean {
  const str1 = num1.toString().padStart(3, '0');
  const str2 = num2.toString().padStart(3, '0');

  for (let i = str1.length - 1; i >= 0; i--) {
    if (parseInt(str1[i]) < parseInt(str2[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Check if addition needs carrying
 */
export function needsCarry(num1: number, num2: number): boolean {
  const str1 = num1.toString().padStart(3, '0');
  const str2 = num2.toString().padStart(3, '0');

  let carry = 0;
  for (let i = str1.length - 1; i >= 0; i--) {
    const sum = parseInt(str1[i]) + parseInt(str2[i]) + carry;
    if (sum >= 10) return true;
    carry = 0;
  }
  return false;
}

/**
 * Get digit at specific place value
 */
export function getDigitAtPlace(
  number: number,
  place: 'thousands' | 'hundreds' | 'tens' | 'ones'
): number {
  const placeValues = {
    thousands: 1000,
    hundreds: 100,
    tens: 10,
    ones: 1,
  };

  return Math.floor((number % (placeValues[place] * 10)) / placeValues[place]);
}

/**
 * Parse number into place value digits
 */
export function parseIntoPlaceValues(number: number): {
  thousands: number;
  hundreds: number;
  tens: number;
  ones: number;
} {
  return {
    thousands: Math.floor(number / 1000) % 10,
    hundreds: Math.floor(number / 100) % 10,
    tens: Math.floor(number / 10) % 10,
    ones: number % 10,
  };
}

/**
 * Format number with padding for display
 */
export function padNumber(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}
