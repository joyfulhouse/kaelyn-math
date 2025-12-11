import { cookies } from 'next/headers';
import type { SessionState } from '@/types';

const SESSION_COOKIE_NAME = 'kaelyn-math-session';
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Default session state for new users
 */
export function getDefaultSessionState(): SessionState {
  return {
    userName: 'Kaelyn',
    lessonsVisited: [],
    lessonsCompleted: [],
    numberPlaces: {
      questionsAttempted: 0,
      questionsCorrect: 0,
      bestStreak: 0,
      highestNumber: 0,
    },
    stackedMath: {
      additionAttempted: 0,
      additionCorrect: 0,
      subtractionAttempted: 0,
      subtractionCorrect: 0,
    },
    multiplication: {
      questionsAttempted: 0,
      questionsCorrect: 0,
      tablesCompleted: [],
      bestStreak: 0,
    },
    division: {
      questionsAttempted: 0,
      questionsCorrect: 0,
      bestStreak: 0,
    },
    carryOver: {
      questionsAttempted: 0,
      questionsCorrect: 0,
      bestStreak: 0,
    },
    borrowing: {
      questionsAttempted: 0,
      questionsCorrect: 0,
      bestStreak: 0,
    },
    practice: {
      totalSessions: 0,
      totalProblems: 0,
      totalCorrect: 0,
      bestScore: 0,
      recentScores: [],
    },
    totalStars: 0,
    achievements: [],
    lastActive: new Date().toISOString(),
  };
}

/**
 * Get the current session state from cookies
 */
export async function getSessionState(): Promise<SessionState> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (sessionCookie?.value) {
    try {
      const state = JSON.parse(sessionCookie.value) as SessionState;
      return state;
    } catch {
      // Invalid JSON, return default
      return getDefaultSessionState();
    }
  }

  return getDefaultSessionState();
}

/**
 * Save session state to cookies
 */
export async function setSessionState(state: SessionState): Promise<void> {
  const cookieStore = await cookies();

  // Update lastActive timestamp
  state.lastActive = new Date().toISOString();

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(state), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Clear the session (for testing/reset)
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
