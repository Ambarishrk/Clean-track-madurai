'use client';

import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { IntelligenceSummary } from '@/lib/types';
import { Trophy, Medal, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export function WardLeaderboard() {
    const db = useFirestore();

    const leaderboardQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'summaries'), where('entityType', '==', 'ward'), orderBy('healthScore', 'desc'), limit(5));
    }, [db]);

    const { data: wards, isLoading } = useCollection<IntelligenceSummary>(leaderboardQuery);

    // Mock data for hackathon demonstration if no summaries exist
    const mockWards: Partial<IntelligenceSummary>[] = [
        { id: 'W012', healthScore: 94, predictedRisk: 'low' },
        { id: 'W045', healthScore: 89, predictedRisk: 'low' },
        { id: 'W022', healthScore: 88, predictedRisk: 'low' },
        { id: 'W005', healthScore: 42, predictedRisk: 'high' },
        { id: 'W089', healthScore: 38, predictedRisk: 'high' },
    ];

    const displayWards = wards && wards.length > 0 ? wards : mockWards;

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 flex items-center gap-2">
                    <Trophy className="h-3 w-3" />
                    Top Performing Wards
                </h3>
                <div className="grid gap-3">
                    {displayWards.slice(0, 3).map((ward, i) => (
                        <div key={ward.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black italic text-xs">
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 uppercase italic leading-none">Ward {ward.id}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Excellence Score</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-green-500 leading-none italic">{ward.healthScore}%</p>
                                <div className="flex items-center justify-end gap-1 mt-1 text-green-600">
                                    <TrendingUp className="h-3 w-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" />
                    Critical Attention Required
                </h3>
                <div className="grid gap-3">
                    {displayWards.slice(-2).map((ward) => (
                        <div key={ward.id} className="bg-red-50/50 p-4 rounded-2xl border border-red-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center">
                                    <AlertCircle className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-black text-red-900 uppercase italic leading-none">Ward {ward.id}</p>
                                    <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-1">Risk: {ward.predictedRisk}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-red-600 leading-none italic">{ward.healthScore}%</p>
                                <div className="flex items-center justify-end gap-1 mt-1 text-red-600">
                                    <TrendingDown className="h-3 w-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
