
'use client';

import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Report } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Calendar, Filter, FileBarChart } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ReportsPage() {
  const db = useFirestore();

  const reportsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'reports'), orderBy('generatedAt', 'desc'));
  }, [db]);

  const { data: reports, isLoading } = useCollection<Report>(reportsQuery);

  return (
    <div className="container mx-auto p-6 space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-2">Municipal Reports</h1>
          <p className="text-white/50 font-bold tracking-widest text-xs uppercase">Official Governance Documentation | Madurai MMC</p>
        </div>
        <div className="flex gap-3 z-10">
          <Button variant="outline" className="bg-white/10 border-white/20 text-white font-bold rounded-xl gap-2 hover:bg-white/20">
            <Filter className="h-4 w-4" />
            Custom Builder
          </Button>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10"><FileBarChart className="h-32 w-32" /></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-48 animate-pulse bg-slate-100 rounded-[2rem]" />)
        ) : reports?.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground italic">
            No system reports generated yet.
          </div>
        ) : reports?.map((report) => (
          <Card key={report.id} className="border-none shadow-xl rounded-[2rem] hover:shadow-2xl transition-all group overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 pb-4">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest border-primary/20 text-primary">
                  {report.type} report
                </Badge>
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardTitle className="text-lg font-black mt-4 leading-tight group-hover:text-primary transition-colors">
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">
                <Calendar className="h-3 w-3" />
                Generated {format(report.generatedAt, 'MMM dd, yyyy')}
              </div>
              <Button className="w-full rounded-2xl h-12 font-black uppercase tracking-tighter italic gap-2 shadow-lg shadow-primary/20">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
