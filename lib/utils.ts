import type { Post, PostStreamEvent } from '@/lib/types';

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU');
}

export function applyPostEvent(posts: Post[], event: PostStreamEvent): Post[] {
  switch (event.type) {
    case 'snapshot':
      return event.posts;
    case 'created':
      return [event.post, ...posts.filter((post) => post.id !== event.post.id)];
    case 'updated':
      return posts.map((post) => (post.id === event.post.id ? event.post : post));
    case 'deleted':
      return posts.filter((post) => post.id !== event.id);
  }
}

export function pickPostFromEvent(postId: string, event: PostStreamEvent): Post | null | undefined {
  switch (event.type) {
    case 'snapshot':
      return event.posts.find((post) => post.id === postId) ?? null;
    case 'created':
    case 'updated':
      return event.post.id === postId ? event.post : undefined;
    case 'deleted':
      return event.id === postId ? null : undefined;
  }
}
