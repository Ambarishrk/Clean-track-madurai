import {
    Firestore,
    collection,
    addDoc,
    doc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { Task, TaskPriority, TaskStatus } from '../types';

/**
 * IoT Service
 * 
 * Simulates Smart Bin / Sensor data and triggers automated municipal responses.
 * Key Hackathon Feature: "Automated Governance"
 */
export const iotService = {
    /**
     * Simulate a bin reaching critical fill level
     * Automatically creates a high-priority task for the supervisor.
     */
    async handleBinOverflow(
        db: Firestore,
        binId: string,
        wardId: string,
        zoneId: string
    ): Promise<string> {
        const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
            wardId,
            zoneId,
            title: `IOT: Smart Bin Overflow [${binId}]`,
            description: `AUTOMATED: Sensor at location ${binId} reported 92% fill level. Emergency clearance required.`,
            assignedTo: 'SYSTEM_ROUTED',
            createdBy: 'AI_COMMAND_CENTER',
            status: 'open' as TaskStatus,
            priority: 'high' as TaskPriority,
            dueDate: Date.now() + (4 * 60 * 60 * 1000), // 4 hours from now
        };

        const docRef = await addDoc(collection(db, 'tasks'), {
            ...taskData,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return docRef.id;
    },

    /**
     * Simulates AI-optimized garbage truck routing logic
     */
    async getOptimizedRoute(wardId: string): Promise<any> {
        // Hackathon Visualization: Return a mock set of GPS coordinates
        return [
            { lat: 9.9252, lng: 78.1198, label: 'Collection Point A' },
            { lat: 9.9280, lng: 78.1215, label: 'Collection Point B' },
            { lat: 9.9310, lng: 78.1090, label: 'Unloading Zone' },
        ];
    }
};
