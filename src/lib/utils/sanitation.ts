import { KPI_THRESHOLDS } from '@/lib/constants'

// Get RAG status from a numeric KPI value
export const getKpiStatus = (value: number): 'green' | 'amber' | 'red' => {
  if (value >= KPI_THRESHOLDS.green) return 'green'
  if (value >= KPI_THRESHOLDS.amber) return 'amber'
  return 'red'
}

// Get Tailwind color classes from KPI status
const STATUS_COLORS: Record<string, string> = {
  green: 'text-green-600 bg-green-50 border-green-200',
  amber: 'text-amber-600 bg-amber-50 border-amber-200',
  red: 'text-red-600 bg-red-50 border-red-200',
}

export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status] || 'text-gray-600 bg-gray-50 border-gray-200';
}

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'green':
      return 'text-green-600'
    case 'amber':
      return 'text-amber-600'
    case 'red':
      return 'text-red-600'
    default:
      return 'text-muted-foreground'
  }
}

// Get hex color from KPI status (for charts)
const STATUS_HEX: Record<string, string> = {
  green: '#16A34A',
  amber: '#D97706',
  red: '#DC2626',
}

export const getStatusHex = (status: string): string => {
  return STATUS_HEX[status] || '#6B7280';
}

// Compute overall status from 4 KPI values (worst one wins)
export const computeOverallStatus = (
  segregation: number,
  d2d: number,
  hygiene: number,
  processing: number
): 'green' | 'amber' | 'red' => {
  const statuses = [segregation, d2d, hygiene, processing].map(getKpiStatus)
  if (statuses.includes('red')) return 'red'
  if (statuses.includes('amber')) return 'amber'
  return 'green'
}

// Average an array of numbers
export const average = (nums: number[]): number => {
  if (!nums.length) return 0
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}
