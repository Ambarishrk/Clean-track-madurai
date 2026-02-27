
'use client';

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function GFCScoreRing({ score }: { score: number }) {
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  const getColor = (s: number) => {
    if (s >= 80) return 'hsl(var(--status-green))';
    if (s >= 60) return 'hsl(var(--status-amber))';
    return 'hsl(var(--status-red))';
  };

  return (
    <div className="h-48 w-48 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={450}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={getColor(score)} />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold">{score}</span>
        <span className="text-[10px] uppercase font-bold text-muted-foreground">Index</span>
      </div>
    </div>
  );
}
