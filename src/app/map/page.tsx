'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Map as MapIcon,
    Layers,
    Zap,
    Trash2,
    AlertTriangle,
    Navigation,
    Activity,
    Maximize2
} from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { CitizenReport, Alert } from '@/lib/types';

export default function DigitalTwinView() {
    const db = useFirestore();
    const [activeLayer, setActiveLayer] = useState<'status' | 'complaints' | 'routes'>('status');

    // Real-time data for the map overlay
    const { data: reports } = useCollection<CitizenReport>(
        db ? query(collection(db, 'citizen_reports'), limit(10)) : null
    );

    const { data: alerts } = useCollection<Alert>(
        db ? query(collection(db, 'alerts'), limit(5)) : null
    );

    return (
        <div className="container mx-auto p-6 h-[calc(100vh-120px)] flex flex-col space-y-6">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                        Digital Twin <span className="text-primary">Madurai</span>
                        <Badge className="bg-primary/10 text-primary border-none animate-pulse">Live Simulation</Badge>
                    </h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Spatial Intelligence & Infrastructure Monitoring</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={activeLayer === 'status' ? 'default' : 'outline'}
                        onClick={() => setActiveLayer('status')}
                        className="rounded-xl font-black uppercase italic text-[10px] tracking-tight h-10 px-6"
                    >
                        <Activity className="mr-2 h-4 w-4" /> Operations
                    </Button>
                    <Button
                        variant={activeLayer === 'complaints' ? 'default' : 'outline'}
                        onClick={() => setActiveLayer('complaints')}
                        className="rounded-xl font-black uppercase italic text-[10px] tracking-tight h-10 px-6"
                    >
                        <AlertTriangle className="mr-2 h-4 w-4" /> Citizen Reports
                    </Button>
                    <Button
                        variant={activeLayer === 'routes' ? 'default' : 'outline'}
                        onClick={() => setActiveLayer('routes')}
                        className="rounded-xl font-black uppercase italic text-[10px] tracking-tight h-10 px-6"
                    >
                        <Navigation className="mr-2 h-4 w-4" /> Route AI
                    </Button>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                <Card className="col-span-12 lg:col-span-9 rounded-[3rem] overflow-hidden relative border-none shadow-2xl bg-slate-900 border-4 border-slate-800">
                    {/* MOCK MAP VISUALIZATION */}
                    <div className="absolute inset-0 opacity-40">
                        <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/78.1198,9.9252,12,0/1200x800?access_token=mock')] bg-cover bg-center" />
                    </div>

                    <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                        <div className="flex justify-between items-start">
                            <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 w-64 pointer-events-auto">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Spatial Telemetry</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-white/60 font-medium">Active Sensors</span>
                                        <span className="font-mono text-white font-bold">1,240</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-white/60 font-medium">Waste Flow Rate</span>
                                        <span className="font-mono text-green-400 font-bold">14.2 t/h</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-white/60 font-medium">Network Uptime</span>
                                        <span className="font-mono text-primary font-bold">99.9%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 pointer-events-auto">
                                <Button size="icon" className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20">
                                    <Maximize2 className="h-5 w-5" />
                                </Button>
                                <Button size="icon" className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20">
                                    <Layers className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Simulated Map Markers */}
                        <div className="relative h-full w-full">
                            {activeLayer === 'status' && (
                                <>
                                    <div className="absolute top-1/4 left-1/3 bg-green-500 h-4 w-4 rounded-full animate-ping opacity-75" />
                                    <div className="absolute top-1/4 left-1/3 bg-green-500 h-4 w-4 rounded-full border-4 border-white shadow-xl" />
                                    <div className="absolute top-1/2 left-2/3 bg-primary h-4 w-4 rounded-full animate-ping opacity-75" />
                                    <div className="absolute top-1/2 left-2/3 bg-primary h-4 w-4 rounded-full border-4 border-white shadow-xl" />
                                </>
                            )}

                            {activeLayer === 'complaints' && reports?.map((r, i) => (
                                <div
                                    key={r.id}
                                    className="absolute bg-red-500 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-2xl animate-bounce pointer-events-auto"
                                    style={{ top: `${20 + (i * 15)}%`, left: `${15 + (i * 20) % 70}%` }}
                                >
                                    <Trash2 className="h-3 w-3 text-white" />
                                </div>
                            ))}

                            {activeLayer === 'routes' && (
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <path
                                        d="M 100 200 Q 250 150 400 300 T 700 250"
                                        fill="none"
                                        stroke="url(#route-gradient)"
                                        strokeWidth="6"
                                        strokeDasharray="12,12"
                                        className="animate-[dash_20s_linear_infinite]"
                                    />
                                    <defs>
                                        <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                                            <stop offset="100%" stopColor="#22c55e" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            )}
                        </div>

                        <div className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center justify-between pointer-events-auto">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Processing Plant</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Smart Fleet</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Citizen Issue</span>
                                </div>
                            </div>
                            <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-3/4 animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 min-h-0 overflow-y-auto">
                    <Card className="p-8 rounded-[3rem] border-none shadow-2xl bg-white space-y-6">
                        <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-400 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Realtime Anomalies
                        </h3>
                        <div className="space-y-4">
                            {alerts?.map((alert) => (
                                <div key={alert.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="text-[8px] uppercase font-black tracking-widest rounded-lg border-red-200 text-red-600 bg-red-50">
                                            {alert.severity}
                                        </Badge>
                                        <span className="text-[8px] font-mono text-slate-400">04m ago</span>
                                    </div>
                                    <p className="font-black text-xs text-slate-800 uppercase italic tracking-tighter">{alert.title}</p>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{alert.description.substring(0, 60)}...</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-8 rounded-[3rem] border-none shadow-2xl bg-primary text-white space-y-6 flex-1">
                        <div className="bg-white/10 p-4 rounded-2xl flex items-center justify-center">
                            <Zap className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tight leading-none text-center">AI Optimization Insights</h3>
                        <p className="text-xs text-white/70 text-center font-medium leading-relaxed">
                            Current garbage flow indicates a 12% decrease in collection efficiency for North Zone. Recommending route rebalancing.
                        </p>
                        <Button className="w-full bg-white text-primary font-black uppercase italic tracking-tighter rounded-2xl hover:bg-white/90">
                            Apply Optimization
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
