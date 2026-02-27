
export const getKpiStatus = (value: number): 'green' | 'amber' | 'red' => {
  if (value >= 85) return 'green';
  if (value >= 60) return 'amber';
  return 'red';
};

export const getStatusColor = (status: 'green' | 'amber' | 'red' | string) => {
  switch (status) {
    case 'green': return 'bg-status-green';
    case 'amber': return 'bg-status-amber';
    case 'red': return 'bg-status-red';
    default: return 'bg-muted';
  }
};

export const getStatusText = (status: 'green' | 'amber' | 'red' | string) => {
  switch (status) {
    case 'green': return 'text-status-green';
    case 'amber': return 'text-status-amber';
    case 'red': return 'text-status-red';
    default: return 'text-muted-foreground';
  }
};
