import { NextResponse } from 'next/server';
import { getSessionState, setSessionState } from '@/lib/session';
import { safeParseJson, apiError } from '@/lib/apiUtils';
import { requireCsrf } from '@/lib/csrf';

/**
 * POST /api/lesson/complete - Mark a lesson as completed
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

    if (lesson && typeof lesson === 'string' && !state.lessonsCompleted.includes(lesson)) {
      state.lessonsCompleted.push(lesson);
    }

    await setSessionState(state);
    return NextResponse.json({
      success: true,
      lessonsCompleted: state.lessonsCompleted,
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    return apiError('Failed to complete lesson', 500);
  }
}
