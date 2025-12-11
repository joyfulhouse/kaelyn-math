import { NextResponse } from 'next/server';
import { getSessionState, setSessionState } from '@/lib/session';
import { safeParseJson, apiError } from '@/lib/apiUtils';
import type { ProblemType } from '@/types';

const VALID_TYPES: ProblemType[] = ['addition', 'subtraction', 'multiplication', 'division', 'mixed'];

/**
 * POST /api/practice/record - Record a practice session result
 */
export async function POST(request: Request) {
  try {
    const body = await safeParseJson(request);
    if (!body) {
      return apiError('Invalid JSON body');
    }

    // Validate inputs
    const correct = typeof body.correct === 'number' ? Math.max(0, Math.floor(body.correct)) : 0;
    const total = typeof body.total === 'number' ? Math.max(1, Math.floor(body.total)) : 1;
    const rawType = body.type as string;
    const type: ProblemType = VALID_TYPES.includes(rawType as ProblemType) ? rawType as ProblemType : 'mixed';

    const state = await getSessionState();

    state.practice.totalSessions++;
    state.practice.totalProblems += total;
    state.practice.totalCorrect += Math.min(correct, total); // Correct can't exceed total

    const score = Math.round((correct / total) * 100);
    if (score > state.practice.bestScore) {
      state.practice.bestScore = score;
    }

    // Keep last 10 scores
    state.practice.recentScores.push({
      score,
      total,
      type,
      date: new Date().toISOString(),
    });
    if (state.practice.recentScores.length > 10) {
      state.practice.recentScores.shift();
    }

    // Award stars based on performance
    let starsEarned = 0;
    if (score >= 100) starsEarned = 5;
    else if (score >= 80) starsEarned = 4;
    else if (score >= 60) starsEarned = 3;
    else if (score >= 40) starsEarned = 2;
    else if (score >= 20) starsEarned = 1;

    state.totalStars += starsEarned;

    await setSessionState(state);
    return NextResponse.json({
      success: true,
      practice: state.practice,
      starsEarned,
      totalStars: state.totalStars,
    });
  } catch (error) {
    console.error('Error recording practice session:', error);
    return apiError('Failed to record practice session', 500);
  }
}
