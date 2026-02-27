
'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Home, PlusSquare, Sparkles } from 'lucide-react';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">SyncSphere</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/" className="hidden md:block">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Feed
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-md transition-all">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
