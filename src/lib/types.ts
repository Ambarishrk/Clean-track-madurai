export type UserRole = 'MUNICIPAL_COMMISSIONER' | 'ZONAL_OFFICER' | 'WARD_SUPERVISOR';

export interface UserProfile {
  id: string; // Firestore doc ID
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  zoneId?: string | null;
  wardId?: string | null;
  photoURL?: string | null;
  phone?: string;
  createdAt: number;
  lastLoginAt: number;
}

export interface Ward {
  id: string; // W001-W100
  wardId: string;
  wardName: string;
  zoneId: string;
  assignedOfficerId?: string;
  population: number;
  householdCount: number;
  createdAt: number;
}

export interface Zone {
  id: string; // Z1-Z4
  zoneName: string;
  assignedOfficerId?: string;
  wardIds: string[];
}

export type KPIStatus = 'green' | 'amber' | 'red'

export interface KpiSnapshot {
  id?: string;
  wardId: string;
  zoneId: string;
  date: string; // YYYY-MM-DD
  segregationRate: number; // 0-100
  d2dCoverageRate: number; // 0-100
  toiletHygieneScore: number; // 0-100
  wasteProcessingRate: number; // 0-100
  status: KPIStatus;
  notes?: string;
  photoEvidenceURL?: string | null;
  recordedBy: string;
  createdAt: number;
}

export interface KpiAggregate {
  wardId?: string;
  zoneId?: string;
  avgSegregation: number;
  avgD2d: number;
  avgHygiene: number;
  avgProcessing: number;
  overallStatus: KPIStatus;
  lastUpdated: Date;
}

export type AlertType =
  | 'kpi_breach'
  | 'vehicle_breakdown'
  | 'missed_route'
  | 'hygiene_breach'
  | 'surge_forecast'
  | 'grievance_sla'
  | 'data_feed_failure'

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'

export interface Alert {
  id: string;
  type: AlertType;
  wardId?: string;
  zoneId?: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  isResolved: boolean;
  assignedTo?: string | null;
  resolvedAt?: number;
  resolvedBy?: string | null;
  createdAt: number;
}

export type TaskStatus = 'open' | 'in_progress' | 'completed'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string;
  wardId: string;
  zoneId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName?: string;
  createdBy: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: number;
  photoEvidenceURL?: string | null;
  completionNotes?: string | null;
  createdAt: number;
  updatedAt: number;
}

export type GfcStatus = 'pass' | 'fail' | 'in_progress'

export interface GfcIndicator {
  id: string;
  indicatorName: string;
  category: string;
  weight: number;
  currentValue: number;
  targetValue: number;
  unit?: string;
  status: GfcStatus;
  evidenceURLs: string[];
  lastAssessed: number;
}

export interface GfcCompositeScore {
  total: number;
  byCategory: Record<string, number>;
  lastCalculated: Date;
}

export type NotificationType =
  | 'new_alert'
  | 'task_assigned'
  | 'task_completed'
  | 'escalation'
  | 'kpi_breach'
  | 'sla_breach'
  | 'report_ready'

export interface Notification {
  id: string;
  userId: string;
  type?: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

export interface Escalation {
  id: string;
  wardId: string;
  zoneId: string;
  issue: string;
  raisedBy: string;
  raisedAt: number;
  currentLevel: 1 | 2 | 3;
  currentAssignee: string;
  slaDeadline: number;
  status: 'active' | 'resolved' | 'expired';
  notes: string;
}

export interface Report {
  id: string;
  title: string;
  type: string;
  generatedAt: number;
}

export interface PredictiveAlert {
  id: string;
  eventName: string;
  predictedTonnageIncrease: number;
  alertType: string;
  recommendedAction: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  createdAt: number;
  content: string;
  imageUrl?: string | null;
  likesCount?: number;
  commentsCount?: number;
}

export type CitizenReportStatus = 'pending' | 'verified' | 'dispatched' | 'resolved';
export type CitizenReportType = 'garbage_overflow' | 'clogged_drain' | 'unauthorized_dump' | 'other';

export interface CitizenReport {
  id: string;
  type: CitizenReportType;
  description: string;
  photoURL?: string | null;
  location?: { lat: number; lng: number };
  address?: string;
  wardId: string;
  zoneId: string;
  status: CitizenReportStatus;
  reportedAt: number;
  reportedBy: string; // uid or 'anonymous'
  resolutionNotes?: string;
}

export interface IntelligenceSummary {
  id: string; // 'city' | zoneId | wardId
  entityType: 'city' | 'zone' | 'ward';
  healthScore: number; // 0-100 dynamic cleanliness score
  activeAlerts: number;
  openTasks: number;
  citizenSatisfaction: number; // 0-5
  predictedRisk: 'low' | 'medium' | 'high';
  kpiAverages: {
    segregation: number;
    d2d: number;
    hygiene: number;
    processing: number;
  };
  lastAggregated: number;
}

export interface PredictiveInsight {
  id: string;
  wardId: string;
  predictionType: 'surge' | 'overflow' | 'staffing_gap';
  confidence: number;
  description: string;
  recommendedAction: string;
  validUntil: number;
  createdAt: number;
}