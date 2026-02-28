// All 100 ward IDs (W001 - W100)
export const WARD_IDS = Array.from({ length: 100 }, (_, i) =>
  `W${String(i + 1).padStart(3, '0')}`
)

// 4 zones with ward distribution
export const ZONES = [
  { id: 'Z1', name: 'North Zone', wardIds: WARD_IDS.slice(0, 25) },
  { id: 'Z2', name: 'South Zone', wardIds: WARD_IDS.slice(25, 50) },
  { id: 'Z3', name: 'East Zone', wardIds: WARD_IDS.slice(50, 75) },
  { id: 'Z4', name: 'West Zone', wardIds: WARD_IDS.slice(75, 100) },
]

// KPI status thresholds
export const KPI_THRESHOLDS = {
  green: 85,   // ≥ 85% = on track
  amber: 60,   // 60–84% = needs attention
  // below 60 = red / critical
}

// Madurai festival calendar (for predictive alerts)
export const MADURAI_FESTIVALS = [
  { name: 'Chithirai Thiruvizha', month: 4, day: 14 },
  { name: 'Meenakshi Chariot', month: 4, day: 21 },
  { name: 'Pongal', month: 1, day: 14 },
  { name: 'Diwali', month: 10, day: 24 },
  { name: 'Eid', month: 3, day: 31 },
]

// Monsoon months (high-risk for waterlogging)
export const MONSOON_MONTHS = [6, 7, 8, 9, 10] // June – October

// GFC target thresholds
export const GFC_TARGETS = {
  segregationRate: 90,
  d2dCoverageRate: 100,
  toiletHygieneScore: 90,
  wasteProcessingRate: 100,
}

// Alert types
export const ALERT_TYPES = [
  'kpi_breach',
  'vehicle_breakdown',
  'missed_route',
  'hygiene_breach',
  'surge_forecast',
  'grievance_sla',
  'data_feed_failure',
] as const

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'cleantrack_auth_token',
  USER_PREFERENCES: 'cleantrack_user_prefs',
  LAST_VIEWED_WARD: 'cleantrack_last_ward',
}
