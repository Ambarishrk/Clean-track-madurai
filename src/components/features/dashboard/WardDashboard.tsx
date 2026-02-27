
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { getKpiStatus } from '@/lib/utils/sanitation';
import { Loader2, Camera, Send } from 'lucide-react';

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
    const avg = Object.values(formData).reduce((a, b) => a + b, 0) / 4;
    const status = getKpiStatus(avg);

    const snapshot = {
      wardId,
      date: new Date().toISOString().split('T')[0],
      ...formData,
      status,
      recordedBy: user.uid,
      createdAt: Date.now(),
      dataSource: 'Manual Entry (Field Supervisor)',
    };

    addDocumentNonBlocking(collection(db, 'kpi_snapshots'), snapshot);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Submission Success", description: `Field data for ${wardId} recorded.` });
    }, 500);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 pb-8">
          <CardTitle className="text-2xl font-bold flex items-center justify-between">
            Daily Field Log: {wardId}
            <div className="text-xs font-mono bg-white px-2 py-1 rounded border shadow-sm">
              SBM 2.0 Protocol
            </div>
          </CardTitle>
          <p className="text-muted-foreground text-sm">Submit real-time sanitation evidence for today.</p>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="seg">Source Segregation (%)</Label>
                <Input 
                  id="seg" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.segregationRate} 
                  onChange={(e) => setFormData({...formData, segregationRate: parseInt(e.target.value)})}
                  className="rounded-lg h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="d2d">D2D Coverage (%)</Label>
                <Input 
                  id="d2d" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.d2dCoverageRate} 
                  onChange={(e) => setFormData({...formData, d2dCoverageRate: parseInt(e.target.value)})}
                  className="rounded-lg h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hyg">Toilet Hygiene (0-100)</Label>
                <Input 
                  id="hyg" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.toiletHygieneScore} 
                  onChange={(e) => setFormData({...formData, toiletHygieneScore: parseInt(e.target.value)})}
                  className="rounded-lg h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proc">Waste Processing (%)</Label>
                <Input 
                  id="proc" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={formData.wasteProcessingRate} 
                  onChange={(e) => setFormData({...formData, wasteProcessingRate: parseInt(e.target.value)})}
                  className="rounded-lg h-12"
                />
              </div>
            </div>

            <div className="p-8 border-2 border-dashed rounded-xl bg-muted/30 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <Camera className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-bold text-sm">Attach Evidence</p>
                <p className="text-xs text-muted-foreground">Upload photo evidence for toilet hygiene or segregation.</p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-5 w-5" />}
              Submit Daily Log
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
