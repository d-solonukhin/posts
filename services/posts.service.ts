import 'server-only';
import { broadcast, addPostListener } from '@/lib/realtime';
import { postsStore } from '@/lib/store';
import type { Post, PostListener } from '@/lib/types';
import { PostNotFoundError, PostValidationError } from './posts.errors';

function asRecord(input: unknown): Record<string, unknown> {
  if (typeof input === 'object' && input !== null) {
    return input as Record<string, unknown>;
  }

  return {};
}

function requireText(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new PostValidationError(`${label} не может быть пустым`);
  }

  return value.trim();
}

function byCreatedDesc(left: Post, right: Post): number {
  if (left.createdAt === right.createdAt) {
    return right.id.localeCompare(left.id);
  }

  return right.createdAt.localeCompare(left.createdAt);
}

export const postsService = {
  list(): Post[] {
    return postsStore.getAll().sort(byCreatedDesc);
  },

  getById(id: string): Post | null {
    return postsStore.getById(id);
  },

  create(input: unknown): Post {
    const data = asRecord(input);
    const title = requireText(data.title, 'Заголовок');
    const content = requireText(data.content, 'Текст');
    const now = new Date().toISOString();
    const post = postsStore.insert({
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
    });
    broadcast({ type: 'created', post });
    return post;
  },

  update(id: string, input: unknown): Post {
    const existing = postsStore.getById(id);
    if (!existing) throw new PostNotFoundError();

    const data = asRecord(input);
    const title = requireText(data.title, 'Заголовок');
    const content = requireText(data.content, 'Текст');
    const saved = postsStore.update({
      ...existing,
      title,
      content,
      updatedAt: new Date().toISOString(),
    });

    if (!saved) throw new PostNotFoundError();
    broadcast({ type: 'updated', post: saved });
    return saved;
  },

  remove(id: string): void {
    const removed = postsStore.remove(id);
    if (!removed) throw new PostNotFoundError();
    broadcast({ type: 'deleted', id });
  },

  subscribe(listener: PostListener): () => void {
    return addPostListener(listener);
  },
};
