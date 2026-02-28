import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  Firestore,
} from 'firebase/firestore'
import { KpiSnapshot } from '@/lib/types'
import { computeOverallStatus, average } from '@/lib/utils/sanitation'
import { ZONES } from '@/lib/constants'

export const kpiService = {
  /**
   * Submit a new KPI snapshot for a ward
   */
  async submitKpiSnapshot(db: Firestore, data: Omit<KpiSnapshot, 'id' | 'createdAt' | 'status'>) {
    const overallStatus = computeOverallStatus(
      data.segregationRate,
      data.d2dCoverageRate,
      data.toiletHygieneScore,
      data.wasteProcessingRate
    )

    const docRef = await addDoc(collection(db, 'kpi_snapshots'), {
      ...data,
      status: overallStatus,
      createdAt: Date.now(),
    })
    return docRef.id
  },

  /**
   * Get KPI snapshots for a specific ward (last N days)
   */
  async getKpiSnapshotsByWard(db: Firestore, wardId: string, limitDays = 30) {
    const cutoffDate = Date.now() - limitDays * 24 * 60 * 60 * 1000

    const q = query(
      collection(db, 'kpi_snapshots'),
      where('wardId', '==', wardId),
      where('createdAt', '>=', cutoffDate),
      orderBy('createdAt', 'desc')
    )

    const snapshots = await getDocs(q)
    return snapshots.docs.map(doc => ({ ...doc.data(), id: doc.id } as KpiSnapshot))
  },

  /**
   * Get the latest KPI snapshot for a specific ward
   */
  async getLatestKpiByWard(db: Firestore, wardId: string) {
    const q = query(
      collection(db, 'kpi_snapshots'),
      where('wardId', '==', wardId),
      orderBy('createdAt', 'desc'),
      limit(1)
    )

    const snapshots = await getDocs(q)
    if (snapshots.empty) return null
    return { ...snapshots.docs[0].data(), id: snapshots.docs[0].id } as KpiSnapshot
  },

  /**
   * Calculate city-wide KPI aggregate from all wards
   */
  async getCityWideKpiAggregate(db: Firestore) {
    const allWards = ['W001', 'W002'] // placeholder - should fetch all ward IDs

    const latestSnapshots: KpiSnapshot[] = []
    for (const wardId of allWards) {
      const latest = await this.getLatestKpiByWard(db, wardId)
      if (latest) latestSnapshots.push(latest)
    }

    if (latestSnapshots.length === 0) {
      return null
    }

    return {
      avgSegregation: average(latestSnapshots.map(s => s.segregationRate)),
      avgD2d: average(latestSnapshots.map(s => s.d2dCoverageRate)),
      avgHygiene: average(latestSnapshots.map(s => s.toiletHygieneScore)),
      avgProcessing: average(latestSnapshots.map(s => s.wasteProcessingRate)),
      overallStatus: computeOverallStatus(
        average(latestSnapshots.map(s => s.segregationRate)),
        average(latestSnapshots.map(s => s.d2dCoverageRate)),
        average(latestSnapshots.map(s => s.toiletHygieneScore)),
        average(latestSnapshots.map(s => s.wasteProcessingRate))
      ),
      lastUpdated: new Date(),
    }
  },

  /**
   * Calculate zone-level KPI aggregate
   */
  async getZoneKpiAggregate(db: Firestore, zoneId: string) {
    const zone = ZONES.find(z => z.id === zoneId)
    if (!zone) return null

    const latestSnapshots: KpiSnapshot[] = []
    for (const wardId of zone.wardIds) {
      const latest = await this.getLatestKpiByWard(db, wardId)
      if (latest) latestSnapshots.push(latest)
    }

    if (latestSnapshots.length === 0) {
      return null
    }

    return {
      zoneId,
      avgSegregation: average(latestSnapshots.map(s => s.segregationRate)),
      avgD2d: average(latestSnapshots.map(s => s.d2dCoverageRate)),
      avgHygiene: average(latestSnapshots.map(s => s.toiletHygieneScore)),
      avgProcessing: average(latestSnapshots.map(s => s.wasteProcessingRate)),
      overallStatus: computeOverallStatus(
        average(latestSnapshots.map(s => s.segregationRate)),
        average(latestSnapshots.map(s => s.d2dCoverageRate)),
        average(latestSnapshots.map(s => s.toiletHygieneScore)),
        average(latestSnapshots.map(s => s.wasteProcessingRate))
      ),
      lastUpdated: new Date(),
    }
  },

  /**
   * Subscribe to real-time KPI updates for a specific ward
   */
  subscribeToWardKpi(
    db: Firestore,
    wardId: string,
    callback: (snapshot: KpiSnapshot | null) => void
  ) {
    const q = query(
      collection(db, 'kpi_snapshots'),
      where('wardId', '==', wardId),
      orderBy('createdAt', 'desc'),
      limit(1)
    )

    return onSnapshot(q, snapshots => {
      if (snapshots.empty) {
        callback(null)
      } else {
        callback({ ...snapshots.docs[0].data(), id: snapshots.docs[0].id } as KpiSnapshot)
      }
    })
  },

  /**
   * Update a KPI snapshot (admin only)
   */
  async updateKpiSnapshot(db: Firestore, snapshotId: string, data: Partial<KpiSnapshot>) {
    const docRef = doc(db, 'kpi_snapshots', snapshotId)
    await updateDoc(docRef, data)
  },
}
