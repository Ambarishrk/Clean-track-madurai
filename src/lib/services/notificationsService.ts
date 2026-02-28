import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  writeBatch,
  Firestore,
  onSnapshot,
} from 'firebase/firestore'
import { Notification } from '@/lib/types'

export const notificationsService = {
  /**
   * Get notifications for a user
   */
  async getNotificationsByUser(db: Firestore, userId: string) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    )

    const notifications = await getDocs(q)
    return notifications.docs.map(doc => ({ ...doc.data(), id: doc.id } as Notification))
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(db: Firestore, notificationId: string) {
    const docRef = doc(db, 'notifications', notificationId)
    await updateDoc(docRef, { read: true })
  },

  /**
   * Mark all unread notifications as read for a user
   */
  async markAllAsRead(db: Firestore, userId: string) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    )

    const notifications = await getDocs(q)
    const batch = writeBatch(db)

    notifications.docs.forEach(doc => {
      batch.update(doc.ref, { read: true })
    })

    await batch.commit()
  },

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(db: Firestore, userId: string): Promise<number> {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    )

    const notifications = await getDocs(q)
    return notifications.size
  },

  /**
   * Subscribe to unread count in real-time
   */
  subscribeToUnreadCount(
    db: Firestore,
    userId: string,
    callback: (count: number) => void
  ) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    )

    return onSnapshot(q, snapshots => {
      callback(snapshots.size)
    })
  },
}
