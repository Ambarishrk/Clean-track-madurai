
'use client';

import { useQuery } from '@tanstack/react-query';
import { postService } from '@/lib/services/postService';
import { useAuthStore } from '@/lib/store/useAuthStore';
import CreatePost from '@/components/posts/CreatePost';
import PostCard from '@/components/posts/PostCard';
import IdeaGenerator from '@/components/ai/IdeaGenerator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, PlusCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuthStore();
  
  const { data: posts, isLoading: isPostsLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.getAllPosts(),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar - AI Tools & Info */}
        <aside className="lg:col-span-4 order-2 lg:order-1 sticky top-24 space-y-6">
          <IdeaGenerator />
          
          <div className="p-6 rounded-3xl bg-primary text-primary-foreground shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              Welcome back!
            </h3>
            <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
              SyncSphere is where your ideas find their home. Use our AI tools to boost your creativity today.
            </p>
            {!user && !isAuthLoading && (
              <Link href="/login">
                <Button variant="secondary" className="w-full font-bold shadow-sm">
                  Join the Community
                </Button>
              </Link>
            )}
          </div>
        </aside>

        {/* Main Feed Content */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
          {user ? (
            <CreatePost />
          ) : !isAuthLoading && (
            <div className="mb-8 p-12 rounded-3xl bg-white border border-primary/5 text-center shadow-sm">
              <div className="h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Welcome to SyncSphere</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Connect with the world and share your story. Log in to start creating.
              </p>
              <Link href="/login">
                <Button className="px-10 py-6 rounded-full text-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                  Start Your Journey
                </Button>
              </Link>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2 ml-1">
              Latest Stories
            </h2>

            {isPostsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white space-y-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-40 w-full rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="p-12 text-center rounded-3xl bg-red-50 text-red-600 border border-red-100">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-bold text-lg">Failed to load posts</h3>
                <p className="text-sm opacity-80">Check your connection and try again.</p>
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="p-20 text-center rounded-3xl bg-white shadow-sm border border-dashed flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                  <PlusCircle className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="font-bold text-xl text-muted-foreground/50">No posts yet</h3>
                <p className="text-muted-foreground/40 mt-2">Be the first one to share a story!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
