
'use client';

import { useState } from 'react';
import { generatePostIdeas } from '@/ai/flows/generate-post-ideas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function IdeaGenerator() {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const result = await generatePostIdeas({ topicOrKeywords: topic });
      setIdeas(result.ideas);
      if (result.ideas.length === 0) {
        toast({ title: "No ideas found", description: "Try different keywords." });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to generate ideas.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({ title: "Copied!", description: "Idea copied to clipboard." });
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 via-background to-secondary/5 h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          AI Idea Generator
        </CardTitle>
        <CardDescription>Enter a topic to get creative post suggestions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="e.g. productivity, summer travel..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="rounded-xl border-primary/10"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !topic.trim()}
            className="rounded-xl shadow-lg hover:shadow-primary/20 transition-all"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </Button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {ideas.map((idea, index) => (
            <div 
              key={index} 
              className="group relative p-4 rounded-2xl bg-white border border-primary/5 hover:border-primary/20 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-sm pr-10 text-foreground/80 leading-relaxed font-medium">{idea}</p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(idea, index)}
              >
                {copiedIndex === index ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </div>
          ))}
          {ideas.length === 0 && !isLoading && (
            <div className="py-12 text-center text-muted-foreground/60 italic flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8" />
              </div>
              <p>Type keywords above to unlock creativity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
