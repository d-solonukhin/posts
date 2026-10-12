import 'server-only';
import type { Post } from '@/lib/types';

type PostsGlobal = typeof globalThis & {
  __posts?: Map<string, Post>;
};

function copyPost(post: Post): Post {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function getPosts(): Map<string, Post> {
  const scope = globalThis as PostsGlobal;

  if (!scope.__posts) {
    const posts = new Map<string, Post>();

    scope.__posts = posts;
  }

  return scope.__posts;
}

export const postsStore = {
  getAll(): Post[] {
    return [...getPosts().values()].map(copyPost);
  },

  getById(id: string): Post | null {
    const post = getPosts().get(id);

    return post ? copyPost(post) : null;
  },

  insert(post: Post): Post {
    const posts = getPosts();

    if (posts.has(post.id)) {
      throw new Error(`Post already exists: ${post.id}`);
    }

    const stored = copyPost(post);
    posts.set(stored.id, stored);

    return copyPost(stored);
  },

  update(post: Post): Post | null {
    const posts = getPosts();

    if (!posts.has(post.id)) {
      return null;
    }

    const stored = copyPost(post);
    posts.set(stored.id, stored);

    return copyPost(stored);
  },

  remove(id: string): boolean {
    return getPosts().delete(id);
  },
};
