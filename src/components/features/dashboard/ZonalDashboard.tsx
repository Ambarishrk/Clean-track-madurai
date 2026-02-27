
'use client';

import { CommissionerDashboard } from './CommissionerDashboard';

export function ZonalDashboard({ zoneId }: { zoneId: string }) {
  // Essentially a filtered version of Commissioner Dashboard
  return (
    <div className="relative">
      <div className="absolute top-4 right-8 z-10">
        <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold shadow-lg">
          Zone Command: {zoneId}
        </div>
      </div>
      <CommissionerDashboard />
    </div>
  );
}
