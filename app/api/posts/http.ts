import { isPostNotFoundError, isPostValidationError } from '@/services/posts.errors';
import { NextResponse } from 'next/server';

export const noStoreHeaders = {
  'Cache-Control': 'no-store',
};

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function postErrorResponse(error: unknown): NextResponse {
  if (isPostValidationError(error)) {
    return NextResponse.json({ error: error.message }, { status: 400, headers: noStoreHeaders });
  }

  if (isPostNotFoundError(error)) {
    return NextResponse.json({ error: 'Пост не найден' }, { status: 404, headers: noStoreHeaders });
  }

  throw error;
}
