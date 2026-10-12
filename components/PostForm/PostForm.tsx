'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NotFoundView } from '@/components/NotFoundView/NotFoundView';
import { usePostStream } from '@/hooks/usePostStream';
import type { Post } from '@/lib/types';
import { pickPostFromEvent } from '@/lib/utils';
import cl from './PostForm.module.css';

type PostFormProps = { mode: 'create' } | { mode: 'edit'; post: Post };

export function PostForm(props: PostFormProps) {
  const router = useRouter();

  const postId: string | null = props.mode === 'edit' ? props.post.id : null;

  const [title, setTitle] = useState<string>(props.mode === 'edit' ? props.post.title : '');

  const [content, setContent] = useState<string>(props.mode === 'edit' ? props.post.content : '');

  const [error, setError] = useState<string | null>(null);

  const [pending, setPending] = useState<boolean>(false);
  const [missing, setMissing] = useState<boolean>(false);
  const [remotePost, setRemotePost] = useState<Post | null>(null);

  const dirtyRef = useRef(false);

  usePostStream((event) => {
    if (!postId) {
      return;
    }

    const next = pickPostFromEvent(postId, event);

    if (next === undefined) {
      return;
    }

    if (next === null) {
      setMissing(true);
      return;
    }

    if (!dirtyRef.current) {
      setTitle(next.title);
      setContent(next.content);
      setRemotePost(null);
      return;
    }

    if (next.title === title && next.content === content) {
      setRemotePost(null);
      return;
    }

    setRemotePost(next);
  });

  if (missing) {
    return <NotFoundView />;
  }

  function markDirty() {
    dirtyRef.current = true;
    setError(null);
  }

  function applyRemote() {
    if (!remotePost) {
      return;
    }

    setTitle(remotePost.title);
    setContent(remotePost.content);
    dirtyRef.current = false;
    setRemotePost(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch(postId ? `/api/posts/${postId}` : '/api/posts', {
        method: postId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      const payload = (await response.json().catch(() => null)) as {
        post?: Post;
        error?: string;
      } | null;

      if (!response.ok || !payload?.post) {
        setError(payload?.error ?? 'Не удалось сохранить запись');
        setPending(false);
        return;
      }

      dirtyRef.current = false;
      router.push(`/posts/${payload.post.id}`);
      router.refresh();
    } catch {
      setError('Не удалось связаться с сервером');
      setPending(false);
    }
  }

  const cancelHref = postId ? `/posts/${postId}` : '/';

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={pending}>
      <h1 className={cl['post-form__title']}>{postId ? 'Редактирование' : 'Новая запись'}</h1>

      {remotePost ? (
        <div className={cl['post-form__remote']}>
          <p className={cl['post-form__text']}>Эту запись изменили в другой вкладке.</p>

          <button type="button" className={cl['post-form__button']} onClick={applyRemote}>
            Показать новую версию
          </button>
        </div>
      ) : null}

      <div className={cl['post-form__field']}>
        <label className={cl['post-form__label']} htmlFor="post-title">
          Заголовок
        </label>

        <input
          id="post-title"
          name="title"
          className={cl['post-form__input']}
          value={title}
          autoComplete="off"
          disabled={pending}
          onChange={(event) => {
            markDirty();
            setTitle(event.target.value);
          }}
        />
      </div>

      <div className={cl['post-form__field']}>
        <label className={cl['post-form__label']} htmlFor="post-content">
          Текст
        </label>

        <textarea
          id="post-content"
          name="content"
          className={cl['post-form__textarea']}
          value={content}
          disabled={pending}
          onChange={(event) => {
            markDirty();
            setContent(event.target.value);
          }}
        />
      </div>

      {error ? (
        <p className={cl['post-form__error']} role="alert">
          {error}
        </p>
      ) : null}

      <div className={cl['post-form__actions']}>
        <button type="submit" className={cl['post-form__button']} disabled={pending}>
          {pending ? 'Сохранение…' : postId ? 'Сохранить' : 'Опубликовать'}
        </button>

        <Link href={cancelHref} className={cl['post-form__cancel']}>
          Отмена
        </Link>
      </div>
    </form>
  );
}
