import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostForm } from '@/components/PostForm/PostForm';
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

  return { title: `Редактирование: ${post.title}` };
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = postsService.getById(id);

  if (!post) {
    notFound();
  }

  return <PostForm mode="edit" post={post} />;
}
