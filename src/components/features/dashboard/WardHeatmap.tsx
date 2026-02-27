'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export function WardHeatmap() {
  const [metric, setMetric] = useState('segregation');

  // Generate 100 wards for the grid (W001-W100)
  const wards = Array.from({ length: 100 }, (_, i) => ({
    id: `W${(i + 1).toString().padStart(3, '0')}`,
    value: Math.floor(Math.random() * (100 - 45) + 45), // Mock randomized value
  }));

  const getColorClass = (val: number) => {
    if (val >= 85) return 'bg-status-green hover:brightness-110';
    if (val >= 60) return 'bg-status-amber hover:brightness-110';
    return 'bg-status-red hover:brightness-110';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-[240px] h-10 border-primary/20">
            <SelectValue placeholder="Select Metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="segregation">Household Segregation</SelectItem>
            <SelectItem value="d2d">D2D Collection Coverage</SelectItem>
            <SelectItem value="hygiene">Toilet Hygiene Score</SelectItem>
            <SelectItem value="processing">Waste Processing Rate</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-status-green" />
            <span>Excellent (≥85%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-status-amber" />
            <span>Moderate (60-84%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-status-red" />
            <span>Critical (&lt;60%)</span>
          </div>
        </div>
      </div>

      <TooltipProvider delayDuration={0}>
        <div className="grid grid-cols-10 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
          {wards.map((ward) => (
            <Tooltip key={ward.id}>
              <TooltipTrigger asChild>
                <div 
                  className={`aspect-square rounded-md cursor-pointer transition-all shadow-sm ${getColorClass(ward.value)}`}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-white border-2 p-3 shadow-xl rounded-xl z-[100]">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-black text-primary">{ward.id}</span>
                    <Badge variant="outline" className="text-[9px] h-4">Zone {(Math.floor(parseInt(ward.id.slice(1))/25)) + 1}</Badge>
                  </div>
                  <p className="text-lg font-black leading-none">{ward.value}%</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Current {metric.replace('_', ' ')}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
      
      <div className="text-center">
        <p className="text-[10px] text-muted-foreground italic font-medium">
          Note: Click any ward tile to view detailed 30-day performance trends and active tasks.
        </p>
      </div>
    </div>
  );
}
