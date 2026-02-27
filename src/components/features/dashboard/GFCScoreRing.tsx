
'use client';

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function GFCScoreRing({ score }: { score: number }) {
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  const getColor = (s: number) => {
    if (s >= 85) return 'hsl(var(--status-green))';
    if (s >= 60) return 'hsl(var(--status-amber))';
    return 'hsl(var(--status-red))';
  };

  return (
    <div className="h-56 w-56 relative group">
      <div className="absolute inset-0 bg-primary/5 rounded-full scale-110 blur-2xl group-hover:scale-125 transition-transform" />
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={95}
            startAngle={90}
            endAngle={450}
            dataKey="value"
            stroke="none"
            paddingAngle={0}
          >
            <Cell fill={getColor(score)} className="drop-shadow-lg" />
            <Cell fill="hsl(var(--muted)/0.3)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-black text-slate-800 tracking-tighter italic">{score}</span>
        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground mt-1">GFC Index</span>
      </div>
    </div>
  );
}
