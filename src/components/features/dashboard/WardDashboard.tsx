
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { getKpiStatus } from '@/lib/utils/sanitation';
import { Loader2, Camera, Send, FileCheck, ShieldAlert } from 'lucide-react';

export function WardDashboard({ wardId }: { wardId: string }) {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    segregationRate: 0,
    d2dCoverageRate: 0,
    toiletHygieneScore: 0,
    wasteProcessingRate: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;

    setIsSubmitting(true);
    // Rough calculation for status
    const avg = Object.values(formData).reduce((a, b) => a + b, 0) / 4;
    const status = getKpiStatus(avg);

    const snapshot = {
      wardId,
      zoneId: 'Z' + (Math.floor(parseInt(wardId.slice(1))/25) + 1), // Auto-derive zone
      date: new Date().toISOString().split('T')[0],
      ...formData,
      status,
      recordedBy: user.uid,
      createdAt: Date.now(),
      dataSource: 'Field Inspection (Officer App)',
    };

    addDocumentNonBlocking(collection(db, 'kpi_snapshots'), snapshot);
    
    // Simulate API delay for UX
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Audit Log Recorded", description: `Field data for ward ${wardId} has been pushed to the Command Center.` });
    }, 800);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-8">
      <header className="flex items-center gap-4 bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
        <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <FileCheck className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase italic">Ward Command</h2>
          <p className="text-white/50 font-bold tracking-widest text-[10px] uppercase">Daily SBM 2.0 Field Submission | Ward {wardId}</p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldAlert className="h-24 w-24" /></div>
      </header>

      <Card className="border-none shadow-2xl rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="bg-slate-50 pb-10 pt-10 px-10">
          <CardTitle className="text-xl font-black text-slate-800 flex items-center justify-between">
            Field Audit Entry
            <div className="text-[10px] font-black bg-primary text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
              Live Feed
            </div>
          </CardTitle>
          <p className="text-slate-500 font-medium text-sm">Please verify all onsite evidence before submitting to Commissioner.</p>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label htmlFor="seg" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Household Segregation (%)</Label>
                <Input 
                  id="seg" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.segregationRate} 
                  onChange={(e) => setFormData({...formData, segregationRate: parseInt(e.target.value)})}
                  className="rounded-2xl h-14 bg-slate-50 border-none text-lg font-bold focus:ring-primary/20 shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="d2d" className="text-[10px] font-black uppercase tracking-widest text-slate-400">D2D Collection Coverage (%)</Label>
                <Input 
                  id="d2d" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.d2dCoverageRate} 
                  onChange={(e) => setFormData({...formData, d2dCoverageRate: parseInt(e.target.value)})}
                  className="rounded-2xl h-14 bg-slate-50 border-none text-lg font-bold focus:ring-primary/20 shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="hyg" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Toilet Hygiene Score (0-100)</Label>
                <Input 
                  id="hyg" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.toiletHygieneScore} 
                  onChange={(e) => setFormData({...formData, toiletHygieneScore: parseInt(e.target.value)})}
                  className="rounded-2xl h-14 bg-slate-50 border-none text-lg font-bold focus:ring-primary/20 shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="proc" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Waste Processing Rate (%)</Label>
                <Input 
                  id="proc" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.wasteProcessingRate} 
                  onChange={(e) => setFormData({...formData, wasteProcessingRate: parseInt(e.target.value)})}
                  className="rounded-2xl h-14 bg-slate-50 border-none text-lg font-bold focus:ring-primary/20 shadow-inner"
                />
              </div>
            </div>

            <div className="p-10 border-4 border-dashed rounded-[2rem] bg-slate-50 border-slate-200 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-slate-100 transition-all group">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-black text-slate-800 uppercase text-sm tracking-tighter">Attach Field Evidence</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">JPG/PNG | Max 10MB | SBM 2.0 Compliant</p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] bg-primary italic uppercase tracking-tighter"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-3 h-6 w-6" />}
              Dispatch Daily Audit
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4 items-start">
        <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0" />
        <div>
          <p className="text-sm font-black text-amber-900 uppercase tracking-tighter">Attestation Required</p>
          <p className="text-xs text-amber-700 font-medium leading-relaxed">By submitting this data, you certify that the metrics reported are based on physical field inspection as per Madurai Municipal Corporation guidelines.</p>
        </div>
      </div>
    </div>
  );
}
