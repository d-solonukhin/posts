import { postsService } from '@/services/posts.service';
import type { PostStreamEvent } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export function GET() {
  const encoder = new TextEncoder();
  let closeStream = () => {};

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const write = (chunk: string) => {
        if (closed) {
          return;
        }

        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          closeStream();
        }
      };

      const unsubscribe = postsService.subscribe((event: PostStreamEvent) => {
        write(`data: ${JSON.stringify(event)}\n\n`);
      });

      const heartbeat = setInterval(() => {
        write(': ping\n\n');
      }, 15000);

      closeStream = () => {
        if (closed) {
          return;
        }

        closed = true;
        clearInterval(heartbeat);
        unsubscribe();

        try {
          controller.close();
        } catch {}
      };

      const snapshot: PostStreamEvent = {
        type: 'snapshot',
        posts: postsService.list(),
      };

      write(`data: ${JSON.stringify(snapshot)}\n\n`);
    },
    cancel() {
      closeStream();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
