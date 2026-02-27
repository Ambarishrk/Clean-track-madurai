
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
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!profile) return null;

  switch (profile.role) {
    case 'MUNICIPAL_COMMISSIONER':
      return <CommissionerDashboard />;
    case 'ZONAL_OFFICER':
      return <ZonalDashboard zoneId={profile.zoneId!} />;
    case 'WARD_SUPERVISOR':
      return <WardDashboard wardId={profile.wardId!} />;
    default:
      return <div>Unauthorized access. Please contact administrator.</div>;
  }
}
