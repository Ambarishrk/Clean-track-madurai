'use client';

import { KPICard } from './KPICard';
import { WardHeatmap } from './WardHeatmap';
import { GFCScoreRing } from './GFCScoreRing';
import { AlertsFeed } from './AlertsFeed';
import { RecentNotifications } from '@/components/features/notifications/RecentNotifications';
import { PredictiveWarnings } from './PredictiveWarnings';
import { useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { KpiSnapshot } from '@/lib/types';
import { Bell, AlertCircle, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';

export function CommissionerDashboard() {
  const db = useFirestore();
  const { user } = useUser();

  const kpiQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'kpi_snapshots'), orderBy('createdAt', 'desc'), limit(100));
  }, [db, user]);

  const { data: snapshots } = useCollection<KpiSnapshot>(kpiQuery);

  // Calculate citywide averages (fallback to mock if no data)
  const stats = {
    segregation: 78,
    d2d: 92,
    hygiene: 64,
    processing: 81,
  };

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-primary uppercase italic tracking-tighter">City Operations Command</h1>
          <p className="text-muted-foreground font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">Madurai Municipal Corporation | City-Wide Monitoring</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <RefreshCcw className="h-3 w-3 text-primary animate-spin-slow" />
          <div className="text-right">
            <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block leading-none">Last Sync</span>
            <p className="font-mono text-xs font-bold text-primary">{format(new Date(), 'HH:mm:ss')}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Source Segregation" value={stats.segregation} trend="+2.4%" unit="%" />
        <KPICard title="D2D Coverage" value={stats.d2d} trend="+0.8%" unit="%" />
        <KPICard title="Toilet Hygiene" value={stats.hygiene} trend="-1.2%" unit="Score" />
        <KPICard title="Waste Processing" value={stats.processing} trend="+4.1%" unit="%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-xl">
            <h2 className="text-xl font-black mb-6 uppercase italic tracking-tight text-slate-800 flex items-center gap-3">
              Ward Performance Heatmap
              <span className="h-1 w-1 bg-slate-300 rounded-full" />
              <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase italic">Live Metrics</span>
            </h2>
            <WardHeatmap />
          </section>
          
          <section className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-xl">
            <h2 className="text-xl font-black mb-6 uppercase italic tracking-tight text-slate-800">Predictive Surge Warnings</h2>
            <PredictiveWarnings />
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white p-8 rounded-[2rem] border shadow-xl flex flex-col items-center text-center">
            <h2 className="text-lg font-black mb-6 uppercase italic tracking-tight text-slate-800">GFC Readiness Index</h2>
            <GFCScoreRing score={74} />
            <div className="mt-6 space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Based on 49 MoHUA indicators.</p>
              <p className="font-black text-primary uppercase italic text-sm">Targeting 3-Star Certification</p>
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2rem] border shadow-xl">
            <h2 className="text-xs font-black mb-4 uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Officer Feed
            </h2>
            <RecentNotifications />
          </section>

          <section className="bg-white p-6 rounded-[2rem] border shadow-xl">
            <h2 className="text-xs font-black mb-4 uppercase tracking-[0.2em] text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Critical Alerts
            </h2>
            <AlertsFeed />
          </section>
        </div>
      </div>
    </div>
  );
}