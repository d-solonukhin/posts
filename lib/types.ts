export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type PostStreamEvent =
  | { type: 'snapshot'; posts: Post[] }
  | { type: 'created'; post: Post }
  | { type: 'updated'; post: Post }
  | { type: 'deleted'; id: string };

export type PostListener = (event: PostStreamEvent) => void;
