
'use client';

import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Alert } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function AlertsFeed() {
  const db = useFirestore();

  const alertsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'alerts'), orderBy('createdAt', 'desc'), limit(10));
  }, [db]);

  const { data: alerts, isLoading } = useCollection<Alert>(alertsQuery);

  if (isLoading) return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded" />)}</div>;

  if (!alerts || alerts.length === 0) {
    return <div className="py-8 text-center text-muted-foreground text-sm italic">No active alerts reported.</div>;
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="p-3 border rounded-lg bg-slate-50 hover:bg-white transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-xs font-bold truncate pr-4">{alert.title}</h4>
            <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'} className="text-[8px] px-1 h-4">
              {alert.severity}
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground line-clamp-1">{alert.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[8px] font-bold text-muted-foreground uppercase">
              <AlertCircle className="h-2 w-2" />
              {alert.type.replace('_', ' ')}
            </div>
            <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
              <Clock className="h-2 w-2" />
              {formatDistanceToNow(alert.createdAt)} ago
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
