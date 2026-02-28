'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Notification } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toDate } from '@/lib/utils';
import Link from 'next/link';

export function RecentNotifications() {
  const { user } = useUser();
  const db = useFirestore();

  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [db, user]);

  const { data: notifications, isLoading } = useCollection<Notification>(notificationsQuery);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground text-xs italic bg-slate-50 rounded-2xl border border-dashed">
        No recent notifications.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notif) => (
        <div 
          key={notif.id} 
          className={`p-3 rounded-xl border transition-all ${notif.read ? 'bg-white opacity-60' : 'bg-primary/5 border-primary/10 shadow-sm'}`}
        >
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{notif.title}</h4>
            {!notif.read && <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1" />}
          </div>
          <p className="text-[10px] text-slate-600 line-clamp-2 mt-0.5">{notif.message}</p>
          <div className="mt-2 flex items-center justify-between text-[8px] font-bold text-muted-foreground uppercase">
            <span className="flex items-center gap-1">
              <Clock className="h-2 w-2" />
              {formatDistanceToNow(toDate(notif.createdAt))} ago
            </span>
          </div>
        </div>
      ))}
      <Link 
        href="/notifications" 
        className="block text-center text-[10px] font-black uppercase tracking-widest text-primary hover:underline pt-2"
      >
        View All Notifications
      </Link>
    </div>
  );
}
