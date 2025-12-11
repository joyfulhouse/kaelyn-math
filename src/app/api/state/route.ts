import { NextResponse } from 'next/server';
import { getSessionState, setSessionState } from '@/lib/session';
import { safeParseJson, apiError } from '@/lib/apiUtils';
import type { SessionState } from '@/types';

/**
 * GET /api/state - Get current session state
 */
export async function GET() {
  try {
    const state = await getSessionState();
    return NextResponse.json({ success: true, state });
  } catch (error) {
    console.error('Error getting session state:', error);
    return apiError('Failed to get session state', 500);
  }
}

/**
 * POST /api/state - Update session state with partial updates
 */
export async function POST(request: Request) {
  try {
    const body = await safeParseJson(request);
    if (!body) {
      return apiError('Invalid JSON body');
    }

    const updates = body as Partial<SessionState>;
    const state = await getSessionState();

    // Type-safe merge of updates into state
    for (const [key, value] of Object.entries(updates)) {
      const stateKey = key as keyof SessionState;
      const currentValue = state[stateKey];

      if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        currentValue !== null &&
        typeof currentValue === 'object' &&
        !Array.isArray(currentValue)
      ) {
        // Deep merge for nested objects
        Object.assign(currentValue, value);
      } else if (stateKey in state) {
        // Direct assignment for primitives and arrays
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state as any)[stateKey] = value;
      }
    }

    await setSessionState(state);
    return NextResponse.json({ success: true, state });
  } catch (error) {
    console.error('Error updating session state:', error);
    return apiError('Failed to update session state', 500);
  }
}
