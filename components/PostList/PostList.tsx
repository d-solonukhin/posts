'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LiveStatus } from '@/components/LiveStatus/LiveStatus';
import { usePostStream } from '@/hooks/usePostStream';
import type { Post } from '@/lib/types';
import { applyPostEvent, formatDate } from '@/lib/utils';
import cl from './PostList.module.css';

type PostListProps = {
  initialPosts: Post[];
};

export function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState(initialPosts);

  const connected = usePostStream((event) => {
    setPosts((current) => applyPostEvent(current, event));
  });

  return (
    <section>
      <div className={cl['post-list__header']}>
        <h1 className={cl['post-list__title']}>Все записи</h1>

        <LiveStatus connected={connected} />
      </div>

      {posts.length === 0 ? (
        <div>
          <p className={cl['post-list__empty']}>Пока нет ни одной записи.</p>

          <Link href="/posts/new">Создать пост</Link>
        </div>
      ) : (
        <ul className={cl['post-list__list']}>
          {posts.map((post) => (
            <li key={post.id} className={cl['post-list__item']}>
              <Link href={`/posts/${post.id}`} className={cl['post-list__item-title']}>
                {post.title}
              </Link>

              <p className={cl['post-list__dates']}>
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
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
