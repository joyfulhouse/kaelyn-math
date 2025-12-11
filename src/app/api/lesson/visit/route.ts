import { NextResponse } from 'next/server';
import { getSessionState, setSessionState } from '@/lib/session';
import { safeParseJson, apiError } from '@/lib/apiUtils';
import { requireCsrf } from '@/lib/csrf';

/**
 * POST /api/lesson/visit - Record a lesson visit
 */
export async function POST(request: Request) {
  try {
    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const body = await safeParseJson(request);
    if (!body) {
      return apiError('Invalid JSON body');
    }

    const lesson = body.lesson as string | undefined;
    const state = await getSessionState();

    if (lesson && typeof lesson === 'string' && !state.lessonsVisited.includes(lesson)) {
      state.lessonsVisited.push(lesson);
    }

    await setSessionState(state);
    return NextResponse.json({
      success: true,
      lessonsVisited: state.lessonsVisited,
    });
  } catch (error) {
    console.error('Error recording lesson visit:', error);
    return apiError('Failed to record lesson visit', 500);
  }
}
