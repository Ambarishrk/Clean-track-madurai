#!/usr/bin/env node

/**
 * Seed Script for Clean-Track
 * Run once to populate Firestore with test data
 *
 * Usage:
 *   npx ts-node scripts/seed.ts
 *
 * Requirements:
 *   - Firebase Admin SDK configured (GOOGLE_APPLICATION_CREDENTIALS env var)
 *   - Firebase project with Firestore enabled
 */

import admin from 'firebase-admin'
import * as fs from 'fs'
import * as path from 'path'

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
if (!serviceAccountPath) {
  console.error('❌ GOOGLE_APPLICATION_CREDENTIALS environment variable not set')
  process.exit(1)
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// Constants
const WARD_IDS = Array.from({ length: 100 }, (_, i) =>
  `W${String(i + 1).padStart(3, '0')}`
)

const ZONES = [
  { id: 'Z1', name: 'North Zone', wardIds: WARD_IDS.slice(0, 25) },
  { id: 'Z2', name: 'South Zone', wardIds: WARD_IDS.slice(25, 50) },
  { id: 'Z3', name: 'East Zone', wardIds: WARD_IDS.slice(50, 75) },
  { id: 'Z4', name: 'West Zone', wardIds: WARD_IDS.slice(75, 100) },
]

// Helper functions
function getRandomIntInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function seedZones() {
  console.log('🌍 Seeding zones...')
  const batch = db.batch()

  for (const zone of ZONES) {
    const ref = db.collection('zones').doc(zone.id)
    batch.set(ref, {
      id: zone.id,
      zoneName: zone.name,
      wardIds: zone.wardIds,
      createdAt: Date.now(),
    })
  }

  await batch.commit()
  console.log('✅ Zones created')
}

async function seedWards() {
  console.log('🏘️  Seeding wards...')
  const batch = db.batch()
  let batchCount = 0

  for (const wardId of WARD_IDS) {
    const zoneId = ZONES.find(z => z.wardIds.includes(wardId))?.id || 'Z1'
    const ref = db.collection('wards').doc(wardId)

    batch.set(ref, {
      id: wardId,
      wardName: `Ward ${wardId.replace('W', '')}`,
      zoneId,
      population: getRandomIntInRange(5000, 50000),
      householdCount: getRandomIntInRange(1000, 10000),
      createdAt: Date.now(),
    })

    batchCount++
    if (batchCount % 100 === 0) {
      await batch.commit()
      console.log(`  - Created ${batchCount} wards`)
    }
  }

  await batch.commit()
  console.log('✅ All wards created')
}

async function seedKpiSnapshots() {
  console.log('📊 Seeding KPI snapshots...')
  const batch = db.batch()
  let batchCount = 0

  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    for (let widx = 0; widx < Math.min(10, WARD_IDS.length); widx++) {
      const wardId = WARD_IDS[widx]
      const zoneId = ZONES.find(z => z.wardIds.includes(wardId))?.id || 'Z1'

      const segregationRate = getRandomIntInRange(55, 95)
      const d2dCoverageRate = getRandomIntInRange(70, 100)
      const toiletHygieneScore = getRandomIntInRange(50, 95)
      const wasteProcessingRate = getRandomIntInRange(60, 100)

      // Determine status based on worst KPI
      let status: 'green' | 'amber' | 'red' = 'green'
      const scores = [segregationRate, d2dCoverageRate, toiletHygieneScore, wasteProcessingRate]
      if (scores.some(s => s < 60)) status = 'red'
      else if (scores.some(s => s < 85)) status = 'amber'

      const ref = db.collection('kpi_snapshots').doc()
      batch.set(ref, {
        wardId,
        zoneId,
        date: dateStr,
        segregationRate,
        d2dCoverageRate,
        toiletHygieneScore,
        wasteProcessingRate,
        status,
        notes: `Daily KPI snapshot for ${dateStr}`,
        recordedBy: 'system',
        createdAt: date.getTime(),
      })

      batchCount++
      if (batchCount % 100 === 0) {
        await batch.commit()
        console.log(`  - Created ${batchCount} KPI snapshots`)
      }
    }
  }

  await batch.commit()
  console.log('✅ KPI snapshots created')
}

async function seedAlerts() {
  console.log('🚨 Seeding alerts...')
  const batch = db.batch()

  const alertTypes: Array<'kpi_breach' | 'vehicle_breakdown' | 'missed_route' | 'hygiene_breach' | 'surge_forecast' | 'grievance_sla'> = [
    'kpi_breach',
    'vehicle_breakdown',
    'missed_route',
    'hygiene_breach',
    'surge_forecast',
    'grievance_sla',
  ]

  const severities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low']

  for (let i = 0; i < 15; i++) {
    const wardId = WARD_IDS[getRandomIntInRange(0, 9)]
    const zoneId = ZONES.find(z => z.wardIds.includes(wardId))?.id || 'Z1'
    const type = alertTypes[getRandomIntInRange(0, alertTypes.length - 1)]
    const severity = severities[getRandomIntInRange(0, severities.length - 1)]

    const ref = db.collection('alerts').doc()
    batch.set(ref, {
      type,
      wardId,
      zoneId,
      severity,
      title: `${type.replace(/_/g, ' ').toUpperCase()} - ${wardId}`,
      description: `Alert description for ${type}`,
      isResolved: Math.random() < 0.3, // 30% resolved
      assignedTo: null,
      createdAt: Date.now() - getRandomIntInRange(0, 7 * 24 * 60 * 60 * 1000),
    })
  }

  await batch.commit()
  console.log('✅ Alerts created')
}

async function seedTasks() {
  console.log('📋  Seeding tasks...')
  const batch = db.batch()

  const statuses: Array<'open' | 'in_progress' | 'completed'> = ['open', 'in_progress', 'completed']
  const priorities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low']

  for (let i = 0; i < 20; i++) {
    const wardId = WARD_IDS[getRandomIntInRange(0, 9)]
    const zoneId = ZONES.find(z => z.wardIds.includes(wardId))?.id || 'Z1'
    const status = statuses[getRandomIntInRange(0, statuses.length - 1)]
    const priority = priorities[getRandomIntInRange(0, priorities.length - 1)]

    const ref = db.collection('tasks').doc()
    batch.set(ref, {
      wardId,
      zoneId,
      title: `Task ${i + 1}`,
      description: `Description for task ${i + 1}`,
      assignedTo: 'worker1',
      createdBy: 'supervisor',
      status,
      priority,
      dueDate: Date.now() + getRandomIntInRange(1, 30) * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - getRandomIntInRange(0, 7 * 24 * 60 * 60 * 1000),
      updatedAt: Date.now(),
    })
  }

  await batch.commit()
  console.log('✅ Tasks created')
}

async function seedGfcIndicators() {
  console.log('🏆 Seeding GFC indicators...')
  const batch = db.batch()

  const indicators = [
    { name: 'Source Segregation', category: 'Segregation', weight: 2 },
    { name: 'Door-to-Door Collection', category: 'Collection', weight: 2 },
    { name: 'Toilet Hygiene', category: 'Sanitation', weight: 2 },
    { name: 'Waste Processing', category: 'Processing', weight: 2 },
    { name: 'Community Participation', category: 'Community', weight: 1 },
    { name: 'Staff Training', category: 'Staffing', weight: 1 },
  ]

  for (const indicator of indicators) {
    const ref = db.collection('gfc_indicators').doc()
    const currentValue = getRandomIntInRange(50, 95)
    const targetValue = 100

    batch.set(ref, {
      indicatorName: indicator.name,
      category: indicator.category,
      weight: indicator.weight,
      currentValue,
      targetValue,
      unit: 'percentage',
      status: currentValue >= targetValue ? 'pass' : 'fail',
      evidenceURLs: [],
      lastAssessed: Date.now(),
    })
  }

  await batch.commit()
  console.log('✅ GFC indicators created')
}

async function seedTestUsers() {
  console.log('👥 Seeding test users...')
  const batch = db.batch()

  const testUsers = [
    {
      uid: 'commissioner1',
      name: 'Commissioner Officer',
      email: 'commissioner@cleantrack.in',
      role: 'MUNICIPAL_COMMISSIONER',
      zoneId: null,
      wardId: null,
    },
    {
      uid: 'zonal1',
      name: 'Zonal Officer North',
      email: 'north@cleantrack.in',
      role: 'ZONAL_OFFICER',
      zoneId: 'Z1',
      wardId: null,
    },
    {
      uid: 'ward1',
      name: 'Ward Supervisor',
      email: 'ward1@cleantrack.in',
      role: 'WARD_SUPERVISOR',
      zoneId: 'Z1',
      wardId: 'W001',
    },
  ]

  for (const user of testUsers) {
    const ref = db.collection('users').doc(user.uid)
    batch.set(ref, {
      ...user,
      photoURL: null,
      phone: '+91-9000000000',
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    })
  }

  await batch.commit()
  console.log('✅ Test users created')
  console.log('\n📝 Test Credentials:')
  console.log('  Commissioner: commissioner@cleantrack.in (password set via Firebase Console)')
  console.log('  Zonal Officer: north@cleantrack.in')
  console.log('  Ward Supervisor: ward1@cleantrack.in')
}

async function main() {
  console.log('\n🚀 Starting Clean-Track Firestore seed...\n')

  try {
    await seedZones()
    await seedWards()
    await seedKpiSnapshots()
    await seedAlerts()
    await seedTasks()
    await seedGfcIndicators()
    await seedTestUsers()

    console.log('\n✅ Seeding completed successfully!\n')
  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await admin.app().delete()
  }
}

main()
