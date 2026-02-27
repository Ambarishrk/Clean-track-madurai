
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getKpiStatus, getStatusColor, getStatusText } from '@/lib/utils/sanitation';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  unit: string;
  trend: string;
}

export function KPICard({ title, value, unit, trend }: KPICardProps) {
  const status = getKpiStatus(value);
  const isPositive = trend.startsWith('+');

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: `hsl(var(--status-${status}))` }}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={`h-2 w-2 rounded-full ${getStatusColor(status)} animate-pulse`} />
        </div>
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          <span className="text-sm font-semibold text-muted-foreground">{unit}</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className={`flex items-center gap-0.5 text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">vs last week</span>
        </div>
      </CardContent>
    </Card>
  );
}
