import { NextResponse } from 'next/server';
import { getSessionState, setSessionState } from '@/lib/session';
import { safeParseJson, apiError } from '@/lib/apiUtils';
import { requireCsrf } from '@/lib/csrf';

/**
 * POST /api/stars/add - Add stars to the user's total
 */
export async function POST(request: Request) {
  try {
    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const body = await safeParseJson(request);
    if (!body) {
      return apiError('Invalid JSON body');
    }

    const stars = body.stars;
    const state = await getSessionState();

    if (typeof stars === 'number' && stars > 0) {
      state.totalStars += Math.floor(stars);
    }

    await setSessionState(state);
    return NextResponse.json({
      success: true,
      totalStars: state.totalStars,
    });
  } catch (error) {
    console.error('Error adding stars:', error);
    return apiError('Failed to add stars', 500);
  }
}
