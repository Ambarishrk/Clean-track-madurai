import { initializeFirebase } from '@/firebase';
import { getStorage } from 'firebase/storage';

// Standardized initialization using the Studio-provided Firebase setup.
// This ensures that all parts of the app use the same singleton instances.
const services = initializeFirebase();

export const auth = services.auth;
export const db = services.firestore;
export const storage = getStorage(services.firebaseApp);
