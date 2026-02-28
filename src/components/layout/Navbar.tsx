'use client';

import Link from 'next/link';
import { useUser, useAuth, useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Home, ShieldCheck, CheckSquare, Bell, BarChart3, Users, Map, AlertTriangle, FileText } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';
import { useUnreadCount } from '@/hooks/useNotifications';

export default function Navbar() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const unreadCount = useUnreadCount(user?.uid || '');

  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc<UserProfile>(profileRef);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isCommissioner = profile?.role === 'MUNICIPAL_COMMISSIONER';

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-primary uppercase">Clean-Track</span>
            <p className="text-[8px] font-bold text-muted-foreground tracking-[0.2em] uppercase leading-none">Madurai Governance</p>
          </div>
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          {user ? (
            <>
              <div className="hidden lg:flex items-center gap-1 mr-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="gap-2 font-bold text-xs">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/tasks">
                  <Button variant="ghost" size="sm" className="gap-2 font-bold text-xs">
                    <CheckSquare className="h-4 w-4" />
                    Tasks
                  </Button>
                </Link>
                <Link href="/alerts">
                  <Button variant="ghost" size="sm" className="gap-2 font-bold text-xs">
                    <AlertTriangle className="h-4 w-4" />
                    Alerts
                  </Button>
                </Link>
                <Link href="/map">
                  <Button variant="ghost" size="sm" className="gap-2 font-bold text-xs">
                    <Map className="h-4 w-4" />
                    Digital Twin
                  </Button>
                </Link>
                {isCommissioner && (
                  <>
                    <Link href="/reports">
                      <Button variant="ghost" size="sm" className="gap-2 font-bold text-xs">
                        <FileText className="h-4 w-4" />
                        Intelligence Reports
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="p-2 border-b mb-1">
                    <p className="text-sm font-bold truncate">{user.displayName || profile?.name || 'Officer'}</p>
                    <p className="text-[10px] text-muted-foreground truncate italic">{profile?.role?.replace('_', ' ')}</p>
                  </div>
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer gap-2 font-medium">
                      <User className="h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                  </Link>
                  {isCommissioner && (
                    <>
                      <DropdownMenuSeparator />
                      <Link href="/wards">
                        <DropdownMenuItem className="cursor-pointer gap-2 font-medium">
                          <Map className="h-4 w-4" />
                          Manage Wards
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/users">
                        <DropdownMenuItem className="cursor-pointer gap-2 font-medium">
                          <Users className="h-4 w-4" />
                          Manage Staff
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/escalations">
                        <DropdownMenuItem className="cursor-pointer gap-2 font-medium">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Escalations
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer gap-2 text-destructive font-medium" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/citizen-report">
                <Button variant="outline" className="font-black h-9 rounded-xl border-primary/20 text-primary uppercase italic text-[10px] tracking-tighter hover:bg-primary/5">
                  Public Portal
                </Button>
              </Link>
              <Link href="/login">
                <Button className="font-black h-9 rounded-xl px-6 shadow-lg shadow-primary/20 uppercase italic text-[10px] tracking-tighter">
                  Staff Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
