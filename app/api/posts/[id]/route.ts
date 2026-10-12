import { NextResponse } from 'next/server';
import { postsService } from '@/services/posts.service';
import { noStoreHeaders, postErrorResponse, readJson } from '../http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const post = postsService.getById(id);

  if (!post) {
    return NextResponse.json({ error: 'Пост не найден' }, { status: 404, headers: noStoreHeaders });
  }

  return NextResponse.json({ post }, { headers: noStoreHeaders });
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const post = postsService.update(id, await readJson(request));

    return NextResponse.json({ post }, { headers: noStoreHeaders });
  } catch (error) {
    return postErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    postsService.remove(id);

    return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
  } catch (error) {
    return postErrorResponse(error);
  }
}
