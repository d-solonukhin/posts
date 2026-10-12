'use client';

import { useEffect, useRef, useState } from 'react';
import type { PostStreamEvent } from '@/lib/types';

export function usePostStream(onEvent: (event: PostStreamEvent) => void): boolean {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const source = new EventSource('/api/posts/stream');

    source.onopen = () => {
      setConnected(true);
    };

    source.onerror = () => {
      setConnected(false);
    };

    source.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as PostStreamEvent;
        onEventRef.current(event);
      } catch {}
    };

    return () => {
      source.close();
      setConnected(false);
    };
  }, []);

  return connected;
}
