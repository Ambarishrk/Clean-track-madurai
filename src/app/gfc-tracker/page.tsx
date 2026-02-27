
'use client';

import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { GfcIndicator } from '@/lib/types';
import { GFCScoreRing } from '@/components/features/dashboard/GFCScoreRing';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, AlertTriangle, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GFCTrackerPage() {
  const db = useFirestore();

  const indicatorsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'gfc_indicators'), orderBy('category'));
  }, [db]);

  const { data: indicators } = useCollection<GfcIndicator>(indicatorsQuery);

  // Mock score calculation if no data
  const compositeScore = indicators 
    ? Math.round(indicators.reduce((acc, curr) => acc + (curr.currentValue / curr.targetValue * curr.weight), 0))
    : 74;

  const getStatusIcon = (status: GfcIndicator['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="h-4 w-4 text-status-green" />;
      case 'fail': return <XCircle className="h-4 w-4 text-status-red" />;
      default: return <AlertTriangle className="h-4 w-4 text-status-amber" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">GFC Certification Tracker</h1>
          <p className="text-muted-foreground">Monitoring 49 MoHUA Indicators for Garbage Free City Status.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Self-Assessment
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-1 bg-card border rounded-xl p-6 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-6">Composite GFC Readiness</h3>
          <GFCScoreRing score={compositeScore} />
          <div className="mt-8 space-y-4 w-full">
            <div className="flex justify-between text-xs font-bold uppercase">
              <span>Certification Goal</span>
              <span className="text-primary">3-Star</span>
            </div>
            <Progress value={compositeScore} className="h-2" />
            <p className="text-[10px] text-center text-muted-foreground italic">
              Required Score for 3-Star: 75/100
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Indicator Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(indicators || MOCK_INDICATORS).map((ind) => (
                <TableRow key={ind.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{ind.indicatorName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase">{ind.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {ind.currentValue} / {ind.targetValue}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ind.status)}
                      <span className="text-[10px] font-bold uppercase">{ind.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

const MOCK_INDICATORS: Partial<GfcIndicator>[] = [
  { id: '1', indicatorName: 'Door-to-door Collection', category: 'Segregation', currentValue: 92, targetValue: 100, status: 'pass', weight: 15 },
  { id: '2', indicatorName: 'Source Segregation', category: 'Segregation', currentValue: 78, targetValue: 90, status: 'in_progress', weight: 20 },
  { id: '3', indicatorName: 'Waste Processing Capacity', category: 'Processing', currentValue: 81, targetValue: 100, status: 'in_progress', weight: 25 },
  { id: '4', indicatorName: 'Dumpsite Remediation', category: 'Disposal', currentValue: 45, targetValue: 100, status: 'fail', weight: 15 },
  { id: '5', indicatorName: 'Plastic Waste Mgmt', category: 'Special Waste', currentValue: 88, targetValue: 80, status: 'pass', weight: 10 },
];
