import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostView } from '@/components/PostView/PostView';
import { postsService } from '@/services/posts.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = postsService.getById(id);

  if (!post) {
    return { title: 'Пост не найден' };
  }

  return { title: post.title };
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = postsService.getById(id);

  if (!post) {
    notFound();
  }

  return <PostView initialPost={post} />;
}
