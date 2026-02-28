import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  updateDoc,
  Firestore,
} from 'firebase/firestore'
import { Ward, Zone } from '@/lib/types'

export const wardsService = {
  /**
   * Get all wards
   */
  async getAllWards(db: Firestore) {
    const wards = await getDocs(collection(db, 'wards'))
    return wards.docs
      .map(doc => ({ ...doc.data(), id: doc.id } as Ward))
      .sort((a, b) => a.id.localeCompare(b.id))
  },

  /**
   * Get a specific ward by ID
   */
  async getWardById(db: Firestore, wardId: string) {
    const docRef = doc(db, 'wards', wardId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return { ...docSnap.data(), id: docSnap.id } as Ward
  },

  /**
   * Get all wards in a specific zone
   */
  async getWardsByZone(db: Firestore, zoneId: string) {
    const q = query(collection(db, 'wards'), where('zoneId', '==', zoneId))

    const wards = await getDocs(q)
    return wards.docs.map(doc => ({ ...doc.data(), id: doc.id } as Ward))
  },

  /**
   * Get all zones
   */
  async getAllZones(db: Firestore) {
    const zones = await getDocs(collection(db, 'zones'))
    return zones.docs.map(doc => ({ ...doc.data(), id: doc.id } as Zone))
  },

  /**
   * Get a specific zone by ID
   */
  async getZoneById(db: Firestore, zoneId: string) {
    const docRef = doc(db, 'zones', zoneId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return { ...docSnap.data(), id: docSnap.id } as Zone
  },

  /**
   * Update assigned officer for a ward
   */
  async updateWardOfficer(db: Firestore, wardId: string, officerId: string) {
    const docRef = doc(db, 'wards', wardId)
    await updateDoc(docRef, { assignedOfficerId: officerId })
  },
}
