
'use client';

import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy, where, updateDoc, doc } from 'firebase/firestore';
import { Alert } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, User, MapPin, Filter, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function AlertsPage() {
  const db = useFirestore();
  const { toast } = useToast();

  const alertsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'alerts'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: alerts, isLoading } = useCollection<Alert>(alertsQuery);

  const resolveAlert = async (id: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'alerts', id), {
        isResolved: true,
        resolvedAt: Date.now()
      });
      toast({ title: "Alert Resolved", description: "The issue has been marked as addressed." });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Could not resolve alert." });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic">Operational Alerts</h1>
          <p className="text-muted-foreground font-medium">Real-time monitoring of city-wide sanitation breaches.</p>
        </div>
        <Button variant="outline" className="gap-2 font-bold rounded-xl border-primary/20">
          <Filter className="h-4 w-4" />
          Filter Feed
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Active System Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-bold uppercase text-[10px]">Severity</TableHead>
                  <TableHead className="font-bold uppercase text-[10px]">Type</TableHead>
                  <TableHead className="font-bold uppercase text-[10px]">Details</TableHead>
                  <TableHead className="font-bold uppercase text-[10px]">Location</TableHead>
                  <TableHead className="font-bold uppercase text-[10px]">Reported</TableHead>
                  <TableHead className="text-right font-bold uppercase text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 font-medium">Syncing with Command Center...</TableCell></TableRow>
                ) : alerts?.map((alert) => (
                  <TableRow key={alert.id} className={`${alert.isResolved ? 'opacity-50 grayscale' : ''}`}>
                    <TableCell>
                      <Badge variant="outline" className={`font-black tracking-widest uppercase text-[9px] rounded-full px-3 py-0.5 ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-xs uppercase text-slate-600">
                      {alert.type.replace('_', ' ')}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm leading-none">{alert.title}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{alert.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                        <MapPin className="h-3 w-3" />
                        {alert.wardId || alert.zoneId}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-muted-foreground">
                      {formatDistanceToNow(alert.createdAt)} ago
                    </TableCell>
                    <TableCell className="text-right">
                      {!alert.isResolved ? (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 text-primary font-black uppercase text-[10px] hover:bg-primary/5 gap-2"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Mark Resolved
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-[9px] uppercase font-bold text-green-600 border-green-200">Resolved</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
