
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  createdAt: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  imageUrl?: string;
  createdAt: number;
  likesCount: number;
  commentsCount: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  createdAt: number;
}
