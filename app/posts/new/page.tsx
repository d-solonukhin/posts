import type { Metadata } from 'next';
import { PostForm } from '@/components/PostForm/PostForm';

export const metadata: Metadata = {
  title: 'Новая запись',
};

export default function NewPostPage() {
  return <PostForm mode="create" />;
}
