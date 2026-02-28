import {
    Firestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    updateDoc,
    doc
} from 'firebase/firestore';
import { CitizenReport, CitizenReportStatus } from '../types';

/**
 * Citizen Service
 * 
 * Handles public reporting of sanitation issues and complaint tracking.
 */
export const citizenService = {
    /**
     * Submit a new citizen report
     */
    async submitReport(
        db: Firestore,
        report: Omit<CitizenReport, 'id' | 'reportedAt' | 'status'>
    ): Promise<string> {
        const docRef = await addDoc(collection(db, 'citizen_reports'), {
            ...report,
            status: 'pending' as CitizenReportStatus,
            reportedAt: Date.now(),
        });
        return docRef.id;
    },

    /**
     * Get all reports for a specific ward
     */
    async getReportsByWard(db: Firestore, wardId: string): Promise<CitizenReport[]> {
        const q = query(
            collection(db, 'citizen_reports'),
            where('wardId', '==', wardId),
            orderBy('reportedAt', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as CitizenReport));
    },

    /**
     * Get all active reports for the dashboard
     */
    async getActiveReports(db: Firestore): Promise<CitizenReport[]> {
        const q = query(
            collection(db, 'citizen_reports'),
            where('status', 'in', ['pending', 'verified', 'dispatched']),
            orderBy('reportedAt', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as CitizenReport));
    },

    /**
     * Update report status (e.g., when a supervisor resolves it)
     */
    async updateReportStatus(
        db: Firestore,
        reportId: string,
        status: CitizenReportStatus,
        notes?: string
    ): Promise<void> {
        const docRef = doc(db, 'citizen_reports', reportId);
        await updateDoc(docRef, {
            status,
            ...(notes && { resolutionNotes: notes }),
            updatedAt: Date.now(),
        });
    }
};
