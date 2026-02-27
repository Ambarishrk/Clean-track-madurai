
'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function WardHeatmap() {
  const [metric, setMetric] = useState('segregation');

  // Generate 100 wards for the grid
  const wards = Array.from({ length: 100 }, (_, i) => ({
    id: `W${(i + 1).toString().padStart(3, '0')}`,
    value: Math.floor(Math.random() * (100 - 40) + 40), // Mock value
  }));

  const getColor = (val: number) => {
    if (val >= 85) return 'bg-status-green hover:bg-green-700';
    if (val >= 60) return 'bg-status-amber hover:bg-amber-600';
    return 'bg-status-red hover:bg-red-700';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[200px] h-8 text-xs">
              <SelectValue placeholder="Select KPI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="segregation">Source Segregation</SelectItem>
              <SelectItem value="d2d">D2D Coverage</SelectItem>
              <SelectItem value="hygiene">Toilet Hygiene</SelectItem>
              <SelectItem value="processing">Waste Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3 text-[10px] font-bold uppercase tracking-tighter">
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-status-green" /> Good</div>
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-status-amber" /> Needs Care</div>
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-status-red" /> Critical</div>
        </div>
      </div>

      <TooltipProvider delayDuration={0}>
        <div className="grid grid-cols-10 gap-1.5 aspect-square sm:aspect-auto">
          {wards.map((ward) => (
            <Tooltip key={ward.id}>
              <TooltipTrigger asChild>
                <div 
                  className={`aspect-square rounded-[2px] cursor-pointer transition-colors ${getColor(ward.value)}`}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-popover border shadow-lg p-2">
                <div className="text-xs">
                  <p className="font-bold text-primary">{ward.id}</p>
                  <p className="font-mono">{ward.value}% {metric}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
