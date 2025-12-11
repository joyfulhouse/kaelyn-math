import { NextResponse } from 'next/server';
import { clearSession, getDefaultSessionState, setSessionState } from '@/lib/session';
import { apiError } from '@/lib/apiUtils';
import { requireCsrf } from '@/lib/csrf';

/**
 * POST /api/reset - Reset session state (for testing)
 */
export async function POST(request: Request) {
  try {
    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    await clearSession();
    const state = getDefaultSessionState();
    await setSessionState(state);

    return NextResponse.json({
      success: true,
      message: 'Session reset',
      state,
    });
  } catch (error) {
    console.error('Error resetting session:', error);
    return apiError('Failed to reset session', 500);
  }
}
