'use client';

import { KPICard } from './KPICard';
import { WardHeatmap } from './WardHeatmap';
import { GFCScoreRing } from './GFCScoreRing';
import { AlertsFeed } from './AlertsFeed';
import { RecentNotifications } from '@/components/features/notifications/RecentNotifications';
import { PredictiveWarnings } from './PredictiveWarnings';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { KpiSnapshot } from '@/lib/types';
import { Bell, AlertCircle } from 'lucide-react';

export function CommissionerDashboard() {
  const db = useFirestore();

  const kpiQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'kpi_snapshots'), orderBy('createdAt', 'desc'), limit(100));
  }, [db]);

  const { data: snapshots } = useCollection<KpiSnapshot>(kpiQuery);

  // Calculate citywide averages (mock logic for demo)
  const stats = {
    segregation: 78,
    d2d: 92,
    hygiene: 64,
    processing: 81,
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-primary uppercase italic tracking-tighter">City Operations Command</h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Madurai Municipal Corporation | City-Wide Overview</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Live Sync</span>
          <p className="font-mono text-sm font-bold text-primary">Active</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Source Segregation" value={stats.segregation} trend="+2.4%" unit="%" />
        <KPICard title="D2D Coverage" value={stats.d2d} trend="+0.8%" unit="%" />
        <KPICard title="Toilet Hygiene" value={stats.hygiene} trend="-1.2%" unit="Score" />
        <KPICard title="Waste Processing" value={stats.processing} trend="+4.1%" unit="%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white p-8 rounded-[2rem] border shadow-xl">
            <h2 className="text-xl font-black mb-6 uppercase italic tracking-tight text-slate-800">Ward Performance Heatmap</h2>
            <WardHeatmap />
          </section>
          
          <section className="bg-white p-8 rounded-[2rem] border shadow-xl">
            <h2 className="text-xl font-black mb-6 uppercase italic tracking-tight text-slate-800">Predictive Surge Warnings</h2>
            <PredictiveWarnings />
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white p-8 rounded-[2rem] border shadow-xl flex flex-col items-center text-center">
            <h2 className="text-xl font-black mb-6 uppercase italic tracking-tight text-slate-800">GFC Readiness Score</h2>
            <GFCScoreRing score={74} />
            <p className="mt-6 text-xs text-muted-foreground font-medium leading-relaxed">
              Based on 49 MoHUA indicators. 
              <br /><span className="font-bold text-primary">Targeting 3-Star Certification.</span>
            </p>
          </section>

          <section className="bg-white p-6 rounded-[2rem] border shadow-xl">
            <h2 className="text-sm font-black mb-4 uppercase tracking-widest text-primary flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Recent Updates
            </h2>
            <RecentNotifications />
          </section>

          <section className="bg-white p-6 rounded-[2rem] border shadow-xl">
            <h2 className="text-sm font-black mb-4 uppercase tracking-widest text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              System Alerts
            </h2>
            <AlertsFeed />
          </section>
        </div>
      </div>
    </div>
  );
}
