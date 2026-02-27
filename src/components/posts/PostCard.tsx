
'use client';

import { Post } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="mb-4 border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center space-y-0 p-4">
        <Avatar className="h-10 w-10 border-2 border-primary/5">
          <AvatarImage src={post.authorAvatar || ''} alt={post.authorName} />
          <AvatarFallback className="bg-primary/5 text-primary">
            {post.authorName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3 flex-1">
          <p className="text-sm font-bold text-foreground leading-none">{post.authorName}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(post.createdAt)} ago
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">{post.content}</p>
        {post.imageUrl && (
          <div className="relative mt-4 aspect-video w-full rounded-2xl overflow-hidden shadow-inner border">
            <Image
              src={post.imageUrl}
              alt="Post attachment"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center px-4 py-2 border-t bg-muted/5">
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-50">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{post.likesCount || 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.commentsCount || 0}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-primary">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
