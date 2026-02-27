
'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { postService } from '@/lib/services/postService';
import { userService } from '@/lib/services/userService';
import PostCard from '@/components/posts/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, MapPin, Calendar, FileText, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: () => userService.getProfile(user!.uid),
    enabled: !!user,
  });

  const { data: userPosts, isLoading: isPostsLoading } = useQuery({
    queryKey: ['user-posts', user?.uid],
    queryFn: () => postService.getPostsByUser(user!.uid),
    enabled: !!user,
  });

  if (isAuthLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Profile Header */}
      <div className="relative mb-8">
        <div className="h-48 w-full rounded-[2.5rem] bg-gradient-to-r from-primary via-primary/80 to-secondary shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
        </div>
        <div className="flex flex-col items-center -mt-20 px-6">
          <Avatar className="h-40 w-40 border-[8px] border-background shadow-xl">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
            <AvatarFallback className="bg-primary/5 text-primary text-4xl font-bold">
              {user.displayName?.charAt(0) || user.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 text-center">
            <h1 className="text-3xl font-extrabold text-foreground">{user.displayName || 'SyncSphere Member'}</h1>
            <p className="text-muted-foreground mt-1 font-medium">{user.email}</p>
          </div>
          <div className="flex gap-4 mt-6">
            <Button className="rounded-full px-8 shadow-md font-bold">Edit Profile</Button>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-2">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-primary mb-2">About</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary/60" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary/60" />
                <span>Joined {profile?.createdAt ? format(profile.createdAt, 'MMMM yyyy') : 'Recently'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 text-primary/60" />
                <span>{userPosts?.length || 0} Stories shared</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Column */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 ml-1">
            <UserCircle className="h-6 w-6 text-primary" />
            Your Stories
          </h2>
          {isPostsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-3xl" />
              ))}
            </div>
          ) : userPosts && userPosts.length > 0 ? (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="p-20 text-center rounded-[2rem] bg-white shadow-sm border border-dashed flex flex-col items-center">
              <FileText className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <h3 className="font-bold text-lg text-muted-foreground/50">You haven't shared anything yet</h3>
              <p className="text-sm text-muted-foreground/40 mt-1">Start sharing your ideas with the world.</p>
              <Button variant="link" className="text-primary mt-4 font-bold" onClick={() => router.push('/')}>Go to Feed</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
