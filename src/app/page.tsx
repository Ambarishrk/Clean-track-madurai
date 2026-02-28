'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CommissionerDashboard } from '@/components/features/dashboard/CommissionerDashboard';
import { ZonalDashboard } from '@/components/features/dashboard/ZonalDashboard';
import { WardDashboard } from '@/components/features/dashboard/WardDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useDoc } from '@/firebase';
import { useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { UserProfile } from '@/lib/types';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-[500px] w-full rounded-[2rem]" />
      </div>
    );
  }

  if (!user) return null;

  if (!profile) {
    return (
      <div className="container mx-auto p-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-primary">Setting up your profile...</h1>
        <p className="text-muted-foreground">If this takes too long, please ensure your account has been onboarded by the Commissioner.</p>
        <Skeleton className="h-64 w-full max-w-2xl mx-auto rounded-3xl" />
      </div>
    );
  }

  switch (profile.role) {
    case 'MUNICIPAL_COMMISSIONER':
      return <CommissionerDashboard />;
    case 'ZONAL_OFFICER':
      return <ZonalDashboard zoneId={profile.zoneId || 'Z1'} />;
    case 'WARD_SUPERVISOR':
      return <WardDashboard wardId={profile.wardId || 'W001'} />;
    default:
      return (
        <div className="container mx-auto p-12 text-center">
          <h1 className="text-2xl font-black text-destructive uppercase italic">Unauthorized Access</h1>
          <p className="text-muted-foreground mt-2">Your role does not have a dashboard assigned. Please contact the administrator.</p>
        </div>
      );
  }
}