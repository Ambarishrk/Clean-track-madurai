
'use client';

import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Authenticated", description: "Access granted to Command Center." });
      router.push('/');
    } catch (error: any) {
      toast({ title: "Access Denied", description: "Invalid credentials.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Success", description: "Logged in via corporate account." });
      router.push('/');
    } catch (error: any) {
      toast({ title: "Google Auth Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent scale-150" />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden rounded-2xl">
        <div className="bg-primary p-12 text-center text-primary-foreground relative">
          <div className="absolute top-0 right-0 p-4 opacity-20"><ShieldCheck className="h-24 w-24" /></div>
          <h1 className="text-4xl font-black tracking-tighter mb-1 uppercase">Clean-Track</h1>
          <p className="text-primary-foreground/70 text-xs font-bold tracking-widest uppercase">Madurai Municipal Governance</p>
        </div>
        <CardHeader className="pt-8 text-center">
          <CardTitle className="text-xl font-bold">Officer Sign-In</CardTitle>
          <CardDescription>Enterprise Access for Municipal Staff</CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email Address"
                className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Access Dashboard
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-muted-foreground font-bold">Internal SSO</span></div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl bg-white border-slate-200 flex items-center justify-center gap-3 font-bold hover:bg-slate-50"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Staff Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
