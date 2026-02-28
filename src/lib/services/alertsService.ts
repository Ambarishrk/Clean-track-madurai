import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  Firestore,
  onSnapshot,
} from 'firebase/firestore'
import { Alert } from '@/lib/types'

export const alertsService = {
  /**
   * Create a new alert
   */
  async createAlert(
    db: Firestore,
    data: Omit<Alert, 'id' | 'createdAt'>
  ) {
    const docRef = await addDoc(collection(db, 'alerts'), {
      ...data,
      createdAt: Date.now(),
    })
    return docRef.id
  },

  /**
   * Get all alerts with optional filters
   */
  async getAllAlerts(
    db: Firestore,
    filters?: {
      severity?: string
      type?: string
      wardId?: string
      isResolved?: boolean
    }
  ) {
    let q = query(
      collection(db, 'alerts'),
      orderBy('createdAt', 'desc')
    )

    // Apply filters manually if needed (Firestore doesn't allow multiple inequality filters)
    const alerts = await getDocs(q)
    let results = alerts.docs.map(doc => ({ ...doc.data(), id: doc.id } as Alert))

    if (filters) {
      if (filters.severity) results = results.filter(a => a.severity === filters.severity)
      if (filters.type) results = results.filter(a => a.type === filters.type)
      if (filters.wardId) results = results.filter(a => a.wardId === filters.wardId)
      if (filters.isResolved !== undefined) results = results.filter(a => a.isResolved === filters.isResolved)
    }

    return results
  },

  /**
   * Get alerts for a specific zone
   */
  async getAlertsByZone(db: Firestore, zoneId: string) {
    const q = query(
      collection(db, 'alerts'),
      where('zoneId', '==', zoneId),
      where('isResolved', '==', false),
      orderBy('createdAt', 'desc')
    )

    const alerts = await getDocs(q)
    return alerts.docs.map(doc => ({ ...doc.data(), id: doc.id } as Alert))
  },

  /**
   * Get alerts for a specific ward
   */
  async getAlertsByWard(db: Firestore, wardId: string) {
    const q = query(
      collection(db, 'alerts'),
      where('wardId', '==', wardId),
      where('isResolved', '==', false),
      orderBy('createdAt', 'desc')
    )

    const alerts = await getDocs(q)
    return alerts.docs.map(doc => ({ ...doc.data(), id: doc.id } as Alert))
  },

  /**
   * Resolve an alert
   */
  async resolveAlert(db: Firestore, alertId: string, resolvedBy: string) {
    const docRef = doc(db, 'alerts', alertId)
    await updateDoc(docRef, {
      isResolved: true,
      resolvedAt: Date.now(),
      resolvedBy,
    })
  },

  /**
   * Assign an alert to a user
   */
  async assignAlert(db: Firestore, alertId: string, assignedTo: string) {
    const docRef = doc(db, 'alerts', alertId)
    await updateDoc(docRef, { assignedTo })
  },

  /**
   * Subscribe to active alerts in real-time
   */
  subscribeToActiveAlerts(
    db: Firestore,
    callback: (alerts: Alert[]) => void,
    zoneId?: string
  ) {
    let q
    if (zoneId) {
      q = query(
        collection(db, 'alerts'),
        where('zoneId', '==', zoneId),
        where('isResolved', '==', false),
        orderBy('createdAt', 'desc')
      )
    } else {
      q = query(
        collection(db, 'alerts'),
        where('isResolved', '==', false),
        orderBy('createdAt', 'desc')
      )
    }

    return onSnapshot(q, snapshots => {
      const alerts = snapshots.docs.map(doc => ({ ...doc.data(), id: doc.id } as Alert))
      callback(alerts)
    })
  },
}
