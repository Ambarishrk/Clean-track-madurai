'use client';

import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { GfcIndicator, GfcStatus } from '@/lib/types';
import { GFCScoreRing } from '@/components/features/dashboard/GFCScoreRing';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, AlertTriangle, FileText, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function GFCTrackerPage() {
  const db = useFirestore();

  const indicatorsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'gfc_indicators'), orderBy('category'));
  }, [db]);

  const { data: indicators } = useCollection<GfcIndicator>(indicatorsQuery);

  const compositeScore = indicators && indicators.length > 0
    ? Math.round(indicators.reduce((acc, curr) => acc + (curr.currentValue / curr.targetValue * curr.weight), 0))
    : 74;

  const getStatusIcon = (status: GfcStatus) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="h-4 w-4 text-status-green" />;
      case 'fail': return <XCircle className="h-4 w-4 text-status-red" />;
      default: return <AlertTriangle className="h-4 w-4 text-status-amber" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-primary p-8 rounded-[2rem] text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-2">GFC Certification Tracker</h1>
          <p className="text-primary-foreground/70 font-bold tracking-widest text-xs uppercase">Madurai Municipal Corporation | SBM 2.0 Compliance</p>
        </div>
        <div className="flex gap-3 z-10">
          <Button variant="outline" className="bg-white/10 border-white/20 text-white font-bold rounded-xl gap-2 hover:bg-white/20">
            <Download className="h-4 w-4" />
            Export Self-Assessment
          </Button>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp className="h-32 w-32" /></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-xl rounded-[2rem] bg-white p-8 flex flex-col items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-8">City Readiness Index</h3>
            <GFCScoreRing score={compositeScore} />
            <div className="mt-10 space-y-6 w-full">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>Certification Goal</span>
                  <span className="text-primary">3-Star Status</span>
                </div>
                <Progress value={compositeScore} className="h-3 rounded-full bg-slate-100" />
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-center text-muted-foreground font-bold leading-relaxed">
                  Required threshold for 3-Star: 75/100.
                  <br />Currently <span className="text-status-red font-black">deficit identified</span>.
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="border-none shadow-xl rounded-[2rem] bg-slate-900 text-white p-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-white/50">MoHUA Categories</h4>
            <div className="space-y-4">
              {['Segregation', 'Processing', 'Dumpsite Remediation', 'Special Waste'].map((cat) => (
                <div key={cat} className="flex justify-between items-center group cursor-pointer">
                  <span className="text-sm font-bold group-hover:text-primary transition-colors">{cat}</span>
                  <Badge variant="outline" className="text-[9px] bg-white/5 border-white/10 text-white">Active</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-50 border-b">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px] px-8 py-6">Indicator Profile</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Category</TableHead>
                  <TableHead className="font-black uppercase text-[10px] text-right">Progress</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Audit Status</TableHead>
                  <TableHead className="font-black uppercase text-[10px] text-right px-8">Evidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(indicators || MOCK_INDICATORS).map((ind) => (
                  <TableRow key={ind.id} className="hover:bg-slate-50/50 transition-colors border-b last:border-0">
                    <TableCell className="font-bold px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-800">{ind.indicatorName}</span>
                        <span className="text-[9px] text-muted-foreground font-bold tracking-tighter uppercase">Weight: {ind.weight}pts</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-primary/20 text-primary">
                        {ind.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-xs text-slate-600">
                      {ind.currentValue} / {ind.targetValue}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon((ind.status || 'in_progress') as GfcStatus)}
                        <span className="text-[10px] font-black uppercase tracking-widest">{ind.status || 'pending'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100">
                        <FileText className="h-4 w-4 text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}

const MOCK_INDICATORS: Partial<GfcIndicator>[] = [
  { id: '1', indicatorName: 'Door-to-door Collection', category: 'Segregation', currentValue: 92, targetValue: 100, status: 'pass', weight: 15 },
  { id: '2', indicatorName: 'Source Segregation Efficiency', category: 'Segregation', currentValue: 78, targetValue: 90, status: 'in_progress', weight: 20 },
  { id: '3', indicatorName: 'Waste-to-Energy Processing', category: 'Processing', currentValue: 81, targetValue: 100, status: 'in_progress', weight: 25 },
  { id: '4', indicatorName: 'Dumpsite Remediation & Capping', category: 'Disposal', currentValue: 45, targetValue: 100, status: 'fail', weight: 15 },
  { id: '5', indicatorName: 'Plastic Waste Compliance', category: 'Special Waste', currentValue: 88, targetValue: 80, status: 'pass', weight: 10 },
  { id: '6', indicatorName: 'ODF++ Sustainability', category: 'Sanitation', currentValue: 100, targetValue: 100, status: 'pass', weight: 15 },
];