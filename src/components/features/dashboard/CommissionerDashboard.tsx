import { KPICard } from './KPICard';
import { WardHeatmap } from './WardHeatmap';
import { GFCScoreRing } from './GFCScoreRing';
import { AlertsFeed } from './AlertsFeed';
import { RecentNotifications } from '@/components/features/notifications/RecentNotifications';
import { PredictiveWarnings } from './PredictiveWarnings';
import { WardLeaderboard } from './WardLeaderboard';
import { useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { IntelligenceSummary } from '@/lib/types';
import { Bell, AlertCircle, RefreshCcw, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { format } from 'date-fns';

export function CommissionerDashboard() {
  const db = useFirestore();
  const { user } = useUser();

  const summaryRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'summaries', 'city');
  }, [db, user]);

  const { data: summary, isLoading } = useDoc<IntelligenceSummary>(summaryRef);

  // Fallback stats if no summary exists yet
  const stats = summary?.kpiAverages || {
    segregation: 78,
    d2d: 92,
    hygiene: 64,
    processing: 81,
  };

  const healthScore = summary?.healthScore || 74;

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6 border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">AI Command Center</h1>
          </div>
          <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em]">Smart City Sanitation Intelligence Platform | Madurai</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-xl">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary block leading-none">System Health</span>
            <p className="font-mono text-xs font-bold text-green-600 uppercase flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Operational
            </p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-3">
            <RefreshCcw className={`h-3 w-3 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
            <div className="text-right">
              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block leading-none">Last Sync</span>
              <p className="font-mono text-xs font-bold text-slate-800">{format(new Date(summary?.lastAggregated || Date.now()), 'HH:mm:ss')}</p>
            </div>
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
          <section className="bg-white p-6 md:p-8 rounded-[3rem] border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <TrendingUp className="h-64 w-64" />
            </div>
            <h2 className="text-2xl font-black mb-8 uppercase italic tracking-tight text-slate-900 flex items-center gap-4">
              Ward Analytics Engine
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase italic">Predictive Live Heatmap</span>
            </h2>
            <WardHeatmap />
          </section>

          <section className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3 text-primary">
                AI Intelligence Panel
                <Zap className="h-5 w-5 animate-pulse" />
              </h2>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Anomaly Detection Powered by Gemini</span>
            </div>
            <PredictiveWarnings />
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white p-10 rounded-[3rem] border-2 border-primary/5 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-40 pointer-events-none" />
            <h2 className="text-xl font-black mb-8 uppercase italic tracking-tight text-slate-900 z-10">City Health Index</h2>
            <div className="relative z-10">
              <GFCScoreRing score={healthScore} />
            </div>
            <div className="mt-8 space-y-2 z-10">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Aggregated from {summary?.openTasks || 0} Sensors</p>
              <div className="bg-primary text-white px-6 py-2 rounded-full font-black uppercase italic text-sm tracking-tighter shadow-lg shadow-primary/20">
                SBM 2.0 Compliance: High
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[3rem] border shadow-xl">
            <h2 className="text-xs font-black mb-8 uppercase tracking-[0.3em] text-slate-900 flex items-center gap-2 italic">
              Municipal Leaderboard
            </h2>
            <WardLeaderboard />
          </section>

          <section className="bg-white p-8 rounded-[3rem] border shadow-xl">
            <h2 className="text-xs font-black mb-6 uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Intelligence Feed
            </h2>
            <RecentNotifications />
          </section>

          <section className="bg-white p-8 rounded-[3rem] border shadow-xl border-red-50">
            <h2 className="text-xs font-black mb-6 uppercase tracking-[0.3em] text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Critical Breaches
            </h2>
            <AlertsFeed />
          </section>
        </div>
      </div>
    </div>
  );
}
