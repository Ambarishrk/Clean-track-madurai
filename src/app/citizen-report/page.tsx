'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { citizenService } from '@/lib/services/citizenService';
import { useFirestore } from '@/firebase';
import { Camera, Send, MapPin, CheckCircle, Shield, Zap } from 'lucide-react';
import { CitizenReportType } from '@/lib/types';

export default function CitizenReportPage() {
    const db = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedId, setSubmittedId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        type: 'garbage_overflow' as CitizenReportType,
        description: '',
        wardId: 'W001',
        address: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db) return;

        setIsSubmitting(true);
        try {
            const id = await citizenService.submitReport(db, {
                ...formData,
                zoneId: 'Z1', // Simulated zone lookup
                reportedBy: 'CitizenUser', // In real app, could be anon or uid
            });
            setSubmittedId(id);
            toast({ title: "Report Submitted", description: "Your complaint has been successfully dispatched to the Ward Supervisor." });
        } catch (error) {
            toast({ variant: "destructive", title: "Submission Failed", description: "Please try again later." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submittedId) {
        return (
            <div className="container mx-auto p-12 max-w-2xl flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-xl shadow-green-100">
                    <CheckCircle className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Report Received</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Reference ID: {submittedId}</p>
                </div>
                <p className="text-slate-600 font-medium text-lg leading-relaxed">Your report has been received by the **AI Command Center**. A field officer will be dispatched to your location within the SLA period.</p>
                <Button
                    onClick={() => setSubmittedId(null)}
                    className="rounded-2xl h-14 px-10 font-black uppercase italic tracking-tighter text-lg shadow-2xl shadow-primary/20"
                >
                    Raise Another Issue
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto p-6 max-w-4xl space-y-12 py-12">
                <header className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                        <Zap className="h-4 w-4" />
                        Citizen Participation Node
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter">Report a Cleanliness Issue</h1>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto">Help us keep Madurai clean. Submit a report directly to the Municipal Commissioner's command center.</p>
                </header>

                <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-white">
                    <div className="bg-primary p-12 text-white flex flex-col md:flex-row gap-8 items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10"><Shield className="h-40 w-40" /></div>
                        <div className="space-y-2 z-10">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight">Smart Reporting</h2>
                            <p className="text-white/70 font-bold tracking-widest text-xs uppercase">Your input drives city-wide health scores</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Response Guarantee</p>
                            <p className="font-bold text-lg">24-Hour Resolution SLA</p>
                        </div>
                    </div>
                    <CardContent className="p-12">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Issue Category</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(v) => setFormData({ ...formData, type: v as CitizenReportType })}
                                    >
                                        <SelectTrigger className="h-16 rounded-2xl bg-slate-50 border-none text-lg font-bold shadow-inner px-6">
                                            <SelectValue placeholder="Select issue type" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                                            <SelectItem value="garbage_overflow">Garbage Overflow</SelectItem>
                                            <SelectItem value="clogged_drain">Clogged Drain</SelectItem>
                                            <SelectItem value="unauthorized_dump">Unauthorized Dumping</SelectItem>
                                            <SelectItem value="other">Other Concern</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ward Number</Label>
                                    <Input
                                        placeholder="e.g. W001"
                                        value={formData.wardId}
                                        onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
                                        className="h-16 rounded-2xl bg-slate-50 border-none text-lg font-bold shadow-inner px-6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specific Location / Landmark</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                                    <Input
                                        placeholder="Opposite Central Market, MG Road"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="h-16 rounded-2xl bg-slate-50 border-none text-lg font-bold shadow-inner pl-14 pr-6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Issue Details</Label>
                                <textarea
                                    placeholder="Tell us what's happening..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full h-40 rounded-[2rem] bg-slate-50 border-none text-lg font-bold shadow-inner p-8 focus:ring-2 ring-primary/20 outline-none"
                                    required
                                />
                            </div>

                            <div className="p-12 border-4 border-dashed rounded-[3rem] bg-slate-50 border-slate-200 flex flex-col items-center justify-center text-center gap-6 cursor-pointer hover:bg-slate-100 transition-all group">
                                <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                    <Camera className="h-10 w-10 text-primary" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 uppercase text-lg tracking-tighter">Snap the Issue</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Photo Evidence ensures priority dispatch</p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-20 text-2xl font-black rounded-3xl shadow-[0_24px_48px_-12px_rgba(var(--primary-rgb),0.3)] transition-all hover:scale-[1.01] active:scale-95 bg-primary italic uppercase tracking-tighter"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Dispatching to Command..." : "Broadcast to Municipal Intelligence"}
                                <Send className="ml-4 h-6 w-6" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
