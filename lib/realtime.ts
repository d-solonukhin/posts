import 'server-only';
import type { PostListener, PostStreamEvent } from '@/lib/types';

type RealtimeGlobal = typeof globalThis & {
  __postsListeners?: Set<PostListener>;
};

function getListeners(): Set<PostListener> {
  const scope = globalThis as RealtimeGlobal;

  if (!scope.__postsListeners) {
    scope.__postsListeners = new Set();
  }

  return scope.__postsListeners;
}

export function addPostListener(listener: PostListener): () => void {
  const listeners = getListeners();

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function broadcast(event: PostStreamEvent): void {
  for (const listener of getListeners()) {
    try {
      listener(event);
    } catch {
      getListeners().delete(listener);
    }
  }
}
