import { format, formatDistanceToNow } from 'date-fns'

// Date formatting utilities
export const formatDate = (date: Date | number) =>
  format(typeof date === 'number' ? new Date(date) : date, 'dd MMM yyyy')

export const formatDateTime = (date: Date | number) =>
  format(typeof date === 'number' ? new Date(date) : date, 'dd MMM yyyy, hh:mm a')

export const formatTime = (date: Date | number) =>
  format(typeof date === 'number' ? new Date(date) : date, 'hh:mm a')

export const formatRelative = (date: Date | number) =>
  formatDistanceToNow(typeof date === 'number' ? new Date(date) : date, { addSuffix: true })

// Number formatting utilities
export const formatPercent = (n: number) => `${Math.round(n)}%`

export const formatDecimal = (n: number, decimals = 2) => n.toFixed(decimals)

// Ward/Zone formatting
export const formatWardLabel = (wardId: string) => `Ward ${wardId.replace('W', '')}`
export const formatZoneLabel = (zoneId: string) => `Zone ${zoneId.replace('Z', '')}`

// Role formatting
export const formatRole = (role: string) =>
  role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

// Status text formatting
export const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'green': 'On Track',
    'amber': 'At Risk',
    'red': 'Critical',
    'open': 'Open',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'pass': 'Pass',
    'fail': 'Fail',
  }
  return labels[status] || status
}

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
