'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { Notification } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { toDate } from '@/lib/utils';

export default function NotificationsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'notifications'), 
      where('userId', '==', user.uid), 
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: notifications, isLoading } = useCollection<Notification>(notificationsQuery);

  const markAsRead = async (id: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) {
      toast({ 
        variant: "destructive", 
        title: "Update Failed", 
        description: "Could not mark notification as read." 
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">System Notifications</h1>
          <p className="text-muted-foreground font-medium">Real-time alerts and operational updates.</p>
        </div>
        <Button variant="outline" size="sm" className="font-bold rounded-xl border-primary/20">
          Mark All Read
        </Button>
      </header>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">Checking log...</div>
        ) : notifications?.length === 0 ? (
          <Card className="border-dashed bg-slate-50/50 p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="font-bold text-muted-foreground">No notifications yet.</h3>
          </Card>
        ) : notifications?.map((notif) => (
          <Card 
            key={notif.id} 
            className={`border-none shadow-md transition-all rounded-2xl overflow-hidden ${notif.read ? 'opacity-60 grayscale' : 'border-l-4 border-primary'}`}
          >
            <CardContent className="p-6 flex gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${notif.read ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                <Bell className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800">{notif.title}</h3>
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(toDate(notif.createdAt))} ago
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                {!notif.read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-4 h-7 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 p-0"
                    onClick={() => markAsRead(notif.id)}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark as Read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
