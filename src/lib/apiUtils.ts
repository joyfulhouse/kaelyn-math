import { NextResponse } from 'next/server';

/**
 * Standard API error response
 */
export function apiError(message: string, status: number = 400): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

/**
 * Standard API success response
 */
export function apiSuccess<T>(data: T): NextResponse {
  return NextResponse.json({ success: true, ...data });
}

/**
 * Safely parse JSON from request body
 * Returns null if parsing fails
 */
export async function safeParseJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    if (typeof body === 'object' && body !== null) {
      return body as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Wrap an API handler with error handling
 */
export function withErrorHandling(
  handler: (request: Request, context?: unknown) => Promise<NextResponse>
) {
  return async (request: Request, context?: unknown): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API error:', error);
      return apiError('An unexpected error occurred', 500);
    }
  };
}
