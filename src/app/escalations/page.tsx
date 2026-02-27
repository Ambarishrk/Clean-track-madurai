
'use client';

import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Escalation } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, User, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function EscalationsPage() {
  const db = useFirestore();

  const escalationsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'escalations'), orderBy('raisedAt', 'desc'));
  }, [db]);

  const { data: escalations, isLoading } = useCollection<Escalation>(escalationsQuery);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">Service Escalations</h1>
        <p className="text-muted-foreground font-medium">Critical issues raised to higher municipal authorities.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Active Escalation Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-black uppercase text-[10px]">Level</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Issue</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Location</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Assignee</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Raised</TableHead>
                  <TableHead className="font-black uppercase text-[10px] text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">Syncing with Command Center...</TableCell></TableRow>
                ) : escalations?.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">No active escalations.</TableCell></TableRow>
                ) : escalations?.map((esc) => (
                  <TableRow key={esc.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-black text-[9px] bg-amber-50 text-amber-700 border-amber-200 uppercase">
                        Level {esc.currentLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-sm text-slate-800">
                      {esc.issue}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[9px] font-bold">Ward {esc.wardId}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-600">
                      {esc.currentAssignee}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-medium">
                      {formatDistanceToNow(esc.raisedAt)} ago
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={`uppercase text-[9px] font-black italic tracking-widest ${esc.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {esc.status}
                      </Badge>
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
