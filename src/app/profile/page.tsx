
'use client';

import { useUser, useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, Mail, Phone, Calendar, MapPin, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc<UserProfile>(profileRef);

  if (isUserLoading || isProfileLoading) {
    return <div className="container mx-auto p-6 space-y-4"><Skeleton className="h-64 w-full rounded-3xl" /></div>;
  }

  if (!profile) return <div className="container mx-auto p-6">Profile not found.</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <div className="bg-primary p-12 rounded-[3rem] text-primary-foreground shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck className="h-48 w-48" /></div>
        
        <Avatar className="h-40 w-40 border-8 border-white/20 shadow-2xl">
          <AvatarImage src={profile.photoURL || ''} alt={profile.name} />
          <AvatarFallback className="text-4xl font-black bg-white text-primary">
            {profile.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="text-center md:text-left z-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">{profile.name}</h1>
          <Badge variant="outline" className="bg-white/10 border-white/20 text-white font-bold tracking-widest uppercase mt-2">
            {profile.role.replace('_', ' ')}
          </Badge>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-primary-foreground/80">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {profile.zoneId || 'City HQ'}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined {format(profile.createdAt, 'MMM yyyy')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 border-none shadow-xl rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase tracking-widest text-primary">Officer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</p>
                <p className="font-bold flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {profile.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</p>
                <p className="font-bold flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {profile.phone || '+91 - Not Set'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Administrative Role</p>
                <p className="font-bold flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> {profile.role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Jurisdiction</p>
                <p className="font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {profile.wardId ? `Ward ${profile.wardId}` : profile.zoneId ? `Zone ${profile.zoneId}` : 'City Wide'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-[2rem] bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase tracking-widest">SBM 2.0 Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Reports Dispatched</p>
              <p className="text-3xl font-black italic tracking-tighter">142</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Verification Rate</p>
              <p className="text-3xl font-black italic tracking-tighter">98.4%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
