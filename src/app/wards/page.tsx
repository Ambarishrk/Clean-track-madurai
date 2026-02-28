'use client';

import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Ward } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Map, Users, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WardsPage() {
  const db = useFirestore();

  const wardsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'wards'), orderBy('wardId'));
  }, [db]);

  const { data: wards, isLoading } = useCollection<Ward>(wardsQuery);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">Ward Management</h1>
          <p className="text-muted-foreground font-medium">Administrative control of all 100 municipal wards.</p>
        </div>
        <Button className="font-black uppercase tracking-tighter italic rounded-xl px-8">
          Audit Configuration
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Administrative Grid
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-black uppercase text-[10px]">Ward ID</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Ward Name</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Zone</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Population</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Households</TableHead>
                  <TableHead className="text-right font-black uppercase text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">Fetching ward data...</TableCell></TableRow>
                ) : (wards || MOCK_WARDS).map((ward) => (
                  <TableRow key={ward.id}>
                    <TableCell className="font-black text-primary italic">{ward.wardId || 'W000'}</TableCell>
                    <TableCell className="font-bold text-sm">{ward.wardName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 text-primary">Zone {ward.zoneId}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-600 flex items-center gap-1">
                      <Users className="h-3 w-3" /> {ward.population?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-600">
                      {ward.householdCount?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                      </Button>
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

const MOCK_WARDS: Partial<Ward>[] = Array.from({ length: 10 }, (_, i) => ({
  id: `w${i+1}`,
  wardId: `W${(i+1).toString().padStart(3, '0')}`,
  wardName: `Ward Area ${i+1}`,
  zoneId: `Z${Math.floor(i/25) + 1}`,
  population: Math.floor(Math.random() * 20000) + 10000,
  householdCount: Math.floor(Math.random() * 5000) + 2000,
}));
