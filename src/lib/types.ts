
export type UserRole = 'MUNICIPAL_COMMISSIONER' | 'ZONAL_OFFICER' | 'WARD_SUPERVISOR';

export interface UserProfile {
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
  assignedOfficerId: string;
  population: number;
  householdCount: number;
  boundaryCoordinates?: string;
  createdAt: number;
}

export interface Zone {
  id: string; // Z1-Z4
  zoneName: string;
  assignedOfficerId: string;
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
  dataSource: string;
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

export interface PredictiveAlert {
  id: string;
  wardId: string;
  alertType: 'festival_surge' | 'monsoon_risk' | 'tourist_peak';
  predictedTonnageIncrease: number;
  confidencePercent: number;
  eventName: string;
  windowStart: number;
  windowEnd: number;
  recommendedAction: string;
  isAcknowledged: boolean;
  createdAt: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: number;
}
