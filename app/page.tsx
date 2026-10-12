import { PostList } from '@/components/PostList/PostList';
import { postsService } from '@/services/posts.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function HomePage() {
  const posts = postsService.list();

  return <PostList initialPosts={posts} />;
}
