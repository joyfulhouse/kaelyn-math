import { NextResponse } from 'next/server';
import { generateProblems } from '@/lib/problemGenerators';
import { safeParseJson, apiError } from '@/lib/apiUtils';
import type { ProblemType, Difficulty } from '@/types';

const VALID_TYPES: ProblemType[] = ['addition', 'subtraction', 'multiplication', 'division', 'mixed'];
const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const MAX_COUNT = 50;

/**
 * POST /api/generate-problems - Generate math problems
 */
export async function POST(request: Request) {
  try {
    const body = await safeParseJson(request);
    if (!body) {
      return apiError('Invalid JSON body');
    }

    // Validate and sanitize inputs
    const type: ProblemType = VALID_TYPES.includes(body.type as ProblemType)
      ? (body.type as ProblemType)
      : 'mixed';
    const difficulty: Difficulty = VALID_DIFFICULTIES.includes(body.difficulty as Difficulty)
      ? (body.difficulty as Difficulty)
      : 'easy';
    const count = typeof body.count === 'number'
      ? Math.max(1, Math.min(MAX_COUNT, Math.floor(body.count)))
      : 5;

    const problems = generateProblems(type, count, difficulty);

    return NextResponse.json({ success: true, problems });
  } catch (error) {
    console.error('Error generating problems:', error);
    return apiError('Failed to generate problems', 500);
  }
}
