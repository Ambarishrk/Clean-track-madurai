import {
    Firestore,
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
    limit,
    orderBy
} from 'firebase/firestore';
import { IntelligenceSummary, KpiSnapshot, KPIStatus } from '../types';

/**
 * Summary Service
 * 
 * Handles aggregation of raw KPI data into Intelligence Summaries.
 * This reduces the need for the dashboard to query 100+ documents on load.
 */
export const summaryService = {
    /**
     * Get the current intelligence summary for a specific entity (city, zone, or ward)
     */
    async getSummary(db: Firestore, id: string): Promise<IntelligenceSummary | null> {
        const docRef = doc(db, 'summaries', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            return { id: snap.id, ...snap.data() } as IntelligenceSummary;
        }
        return null;
    },

    /**
     * Manually trigger an aggregation (In production, this would be a Cloud Function)
     * This computes the "City Health Score" and KPI averages.
     */
    async updateCitySummary(db: Firestore): Promise<void> {
        const snapshotsRef = collection(db, 'kpi_snapshots');
        // Fetch latest snapshot for each ward (simulated via recent snapshots)
        const q = query(snapshotsRef, orderBy('createdAt', 'desc'), limit(100));
        const querySnapshot = await getDocs(q);

        const snapshots = querySnapshot.docs.map(d => d.data() as KpiSnapshot);

        if (snapshots.length === 0) return;

        const totals = snapshots.reduce((acc, curr) => ({
            segregation: acc.segregation + curr.segregationRate,
            d2d: acc.d2d + curr.d2dCoverageRate,
            hygiene: acc.hygiene + curr.toiletHygieneScore,
            processing: acc.processing + curr.wasteProcessingRate,
        }), { segregation: 0, d2d: 0, hygiene: 0, processing: 0 });

        const count = snapshots.length;
        const averages = {
            segregation: Math.round(totals.segregation / count),
            d2d: Math.round(totals.d2d / count),
            hygiene: Math.round(totals.hygiene / count),
            processing: Math.round(totals.processing / count),
        };

        // Calculate Health Score: A weighted average of all KPIs
        const healthScore = Math.round(
            (averages.segregation * 0.3) +
            (averages.d2d * 0.3) +
            (averages.hygiene * 0.2) +
            (averages.processing * 0.2)
        );

        const summary: IntelligenceSummary = {
            id: 'city',
            entityType: 'city',
            healthScore,
            activeAlerts: 0, // Should be fetched from alerts collection
            openTasks: 0,   // Should be fetched from tasks collection
            citizenSatisfaction: 4.2, // Simulated
            predictedRisk: healthScore > 80 ? 'low' : healthScore > 60 ? 'medium' : 'high',
            kpiAverages: averages,
            lastAggregated: Date.now(),
        };

        await setDoc(doc(db, 'summaries', 'city'), summary);
    },

    /**
     * Helper to determine overall status from score
     */
    getKPIStatus(score: number): KPIStatus {
        if (score >= 80) return 'green';
        if (score >= 50) return 'amber';
        return 'red';
    }
};
