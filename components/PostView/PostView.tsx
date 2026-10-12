'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LiveStatus } from '@/components/LiveStatus/LiveStatus';
import { NotFoundView } from '@/components/NotFoundView/NotFoundView';
import { usePostStream } from '@/hooks/usePostStream';
import type { Post } from '@/lib/types';
import { formatDate, pickPostFromEvent } from '@/lib/utils';
import cl from './PostView.module.css';

type PostViewProps = {
  initialPost: Post;
};

export function PostView({ initialPost }: PostViewProps) {
  const router = useRouter();
  const postId = initialPost.id;
  const [post, setPost] = useState<Post | null>(initialPost);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connected = usePostStream((event) => {
    setPost((current) => {
      const next = pickPostFromEvent(postId, event);

      if (next === undefined) {
        return current;
      }

      return next;
    });
  });

  if (!post) {
    return <NotFoundView />;
  }

  async function handleDelete() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.status === 404) {
        setPost(null);
        setPending(false);
        return;
      }

      if (!response.ok) {
        setError('Не удалось удалить запись');
        setPending(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Не удалось связаться с сервером');
      setPending(false);
    }
  }

  return (
    <article className={cl['post-view']}>
      <Link href="/" className={cl['post-view__link']}>
        ← Все записи
      </Link>

      <div className={cl['post-view__wrapper']}>
        <h1 className={cl['post-view__title']}>{post.title}</h1>

        <LiveStatus connected={connected} />
      </div>

      <p className={cl['post-view__dates']}>
        <span>
          Создан{' '}
          <time dateTime={post.createdAt} suppressHydrationWarning>
            {formatDate(post.createdAt)}
          </time>
        </span>

        <span>
          Изменён{' '}
          <time dateTime={post.updatedAt} suppressHydrationWarning>
            {formatDate(post.updatedAt)}
          </time>
        </span>
      </p>

      <p className={cl['post-view__content']}>{post.content}</p>

      <div className={cl['post-view__actions']}>
        <Link href={`/posts/${post.id}/edit`} className={cl['post-view__edit']}>
          Редактировать
        </Link>

        <button type="button" className={cl['post-view__button']} onClick={handleDelete}>
          {pending ? 'Удаление…' : 'Удалить'}
        </button>
      </div>

      {error ? (
        <p className={cl['post-view__error']} role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}
