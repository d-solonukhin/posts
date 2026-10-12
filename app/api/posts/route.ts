import { NextResponse } from 'next/server';
import { postsService } from '@/services/posts.service';
import { noStoreHeaders, postErrorResponse, readJson } from './http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({ posts: postsService.list() }, { headers: noStoreHeaders });
}

export async function POST(request: Request) {
  try {
    const post = postsService.create(await readJson(request));
    return NextResponse.json({ post }, { status: 201, headers: noStoreHeaders });
  } catch (error) {
    return postErrorResponse(error);
  }
}
