import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Firestore,
} from 'firebase/firestore'
import { Task, TaskStatus } from '@/lib/types'

export const tasksService = {
  /**
   * Create a new task
   */
  async createTask(
    db: Firestore,
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    return docRef.id
  },

  /**
   * Get tasks by status, optionally filtered by ward or zone
   */
  async getTasksByStatus(
    db: Firestore,
    status: TaskStatus,
    wardId?: string,
    zoneId?: string
  ) {
    const q = query(
      collection(db, 'tasks'),
      where('status', '==', status),
      orderBy('priority'),
      orderBy('dueDate')
    )

    const tasks = await getDocs(q)
    let results = tasks.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task))

    if (wardId) results = results.filter(t => t.wardId === wardId)
    if (zoneId) results = results.filter(t => t.zoneId === zoneId)

    return results
  },

  /**
   * Get all tasks for a specific zone
   */
  async getAllTasksByZone(db: Firestore, zoneId: string) {
    const q = query(
      collection(db, 'tasks'),
      where('zoneId', '==', zoneId),
      orderBy('createdAt', 'desc')
    )

    const tasks = await getDocs(q)
    return tasks.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task))
  },

  /**
   * Get all tasks for a specific ward
   */
  async getAllTasksByWard(db: Firestore, wardId: string) {
    const q = query(
      collection(db, 'tasks'),
      where('wardId', '==', wardId),
      orderBy('createdAt', 'desc')
    )

    const tasks = await getDocs(q)
    return tasks.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task))
  },

  /**
   * Update task status
   */
  async updateTaskStatus(
    db: Firestore,
    taskId: string,
    status: TaskStatus,
    notes?: string
  ) {
    const docRef = doc(db, 'tasks', taskId)
    await updateDoc(docRef, {
      status,
      ...(notes && { completionNotes: notes }),
      updatedAt: Date.now(),
    })
  },

  /**
   * Upload task evidence and update task
   */
  async updateTaskEvidence(
    db: Firestore,
    taskId: string,
    photoEvidenceURL: string
  ) {
    const docRef = doc(db, 'tasks', taskId)
    await updateDoc(docRef, {
      photoEvidenceURL,
      updatedAt: Date.now(),
    })
  },

  /**
   * Delete a task
   */
  async deleteTask(db: Firestore, taskId: string) {
    await deleteDoc(doc(db, 'tasks', taskId))
  },
}
