
export type UserRole = 'MUNICIPAL_COMMISSIONER' | 'ZONAL_OFFICER' | 'WARD_SUPERVISOR';

export interface UserProfile {
  id: string; // Firestore doc ID
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  zoneId?: string;
  wardId?: string;
  photoURL?: string | null;
  phone?: string;
  createdAt: number;
  lastLoginAt: number;
}

export interface Ward {
  id: string; // W001-W100
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

export interface KpiSnapshot {
  id?: string;
  wardId: string;
  zoneId: string;
  date: string; // YYYY-MM-DD
  segregationRate: number; // 0-100
  d2dCoverageRate: number; // 0-100
  toiletHygieneScore: number; // 0-100
  wasteProcessingRate: number; // 0-100
  status: 'green' | 'amber' | 'red';
  recordedBy: string;
  createdAt: number;
}

export interface Alert {
  id: string;
  type: 'kpi_breach' | 'vehicle_breakdown' | 'missed_route' | 'hygiene_breach' | 'surge_forecast' | 'grievance_sla';
  wardId?: string;
  zoneId?: string;
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  isResolved: boolean;
  assignedTo?: string;
  createdAt: number;
  resolvedAt?: number;
}

export interface Task {
  id: string;
  wardId: string;
  zoneId: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  status: 'open' | 'in_progress' | 'completed';
  dueDate: number;
  priority: 'high' | 'medium' | 'low';
  photoEvidenceURL?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface GfcIndicator {
  id: string;
  indicatorName: string;
  category: string;
  weight: number;
  currentValue: number;
  targetValue: number;
  status: 'pass' | 'fail' | 'in_progress';
  evidenceURLs: string[];
  lastAssessed: number;
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

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  title: string;
  generatedAt: number;
  fileUrl: string;
  authorId: string;
}
