import { NextResponse } from 'next/server';
import { getSessionState, setSessionState } from '@/lib/session';
import { safeParseJson, apiError } from '@/lib/apiUtils';
import { requireCsrf } from '@/lib/csrf';

type ModuleKey = 'numberPlaces' | 'stackedMath' | 'multiplication' | 'division' | 'carryOver' | 'borrowing' | 'practice';

const validModules: ModuleKey[] = [
  'numberPlaces',
  'stackedMath',
  'multiplication',
  'division',
  'carryOver',
  'borrowing',
  'practice',
];

/**
 * POST /api/progress/[module] - Update specific module progress
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const { module } = await params;

    if (!validModules.includes(module as ModuleKey)) {
      return apiError('Invalid module');
    }

    const updates = await safeParseJson(request);
    if (!updates) {
      return apiError('Invalid JSON body');
    }

    const state = await getSessionState();
    const moduleKey = module as ModuleKey;
    const moduleData = state[moduleKey];

    if (moduleData && typeof moduleData === 'object') {
      // Merge updates into the module data
      Object.assign(moduleData, updates);

      await setSessionState(state);
      return NextResponse.json({
        success: true,
        module: moduleKey,
        data: state[moduleKey],
      });
    }

    return apiError('Invalid module');
  } catch (error) {
    console.error('Error updating module progress:', error);
    return apiError('Failed to update module progress', 500);
  }
}
