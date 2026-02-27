
'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { postService } from '@/lib/services/postService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Send, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Error", description: "Image size must be less than 5MB", variant: "destructive" });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await postService.createPost({
        authorId: user.uid,
        authorName: user.displayName || user.email || 'Anonymous',
        authorAvatar: user.photoURL,
        content: content.trim(),
      }, imageFile || undefined);

      setContent('');
      removeImage();
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({ title: "Success", description: "Post published successfully!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to publish post", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-6 border-none shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-primary">Share something</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            className="min-h-[100px] resize-none border-none bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary/20 p-4 rounded-xl"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          {imagePreview && (
            <div className="relative group rounded-xl overflow-hidden border">
              <div className="relative aspect-video w-full">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-muted/5 py-3">
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-5 w-5 mr-2" />
              Image
            </Button>
          </div>
          <Button 
            type="submit" 
            className="rounded-full px-6 shadow-md hover:scale-105 transition-transform"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Publish
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
