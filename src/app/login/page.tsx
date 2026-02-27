
'use client';

import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  updateProfile 
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { userService } from '@/lib/services/userService';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome back!", description: "Signed in successfully." });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        await userService.createOrUpdateProfile({
          uid: userCredential.user.uid,
          email,
          displayName,
          photoURL: null,
        });
        toast({ title: "Welcome to SyncSphere!", description: "Account created successfully." });
      }
      router.push('/');
    } catch (error: any) {
      toast({ 
        title: "Authentication Failed", 
        description: error.message || "An error occurred.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await userService.createOrUpdateProfile({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
      toast({ title: "Success", description: "Signed in with Google." });
      router.push('/');
    } catch (error: any) {
      toast({ title: "Google Sign-In Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gradient-to-tr from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden rounded-[2.5rem]">
        <div className="bg-primary p-12 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
          </div>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md mb-6 shadow-inner">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">SyncSphere</h1>
          <p className="text-primary-foreground/70 text-sm">Join the next generation of social connectivity</p>
        </div>
        <CardHeader className="pt-8 pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Enter your credentials to continue' : 'Join our vibrant community today'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Display Name"
                  className="pl-10 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email Address"
                className="pl-10 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full rounded-xl py-6 text-lg font-bold shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02]" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLogin ? 'Sign In' : 'Sign Up'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-muted-foreground font-semibold">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full rounded-xl py-6 bg-white hover:bg-muted/10 border-muted transition-colors flex items-center justify-center gap-3 font-semibold"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google Account
          </Button>
        </CardContent>
        <CardFooter className="bg-muted/10 py-6 border-t flex justify-center">
          <Button 
            variant="link" 
            className="text-primary font-bold hover:no-underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
