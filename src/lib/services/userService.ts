
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserProfile } from '@/lib/types';

export const userService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  },

  async createOrUpdateProfile(profile: Partial<UserProfile> & { uid: string }): Promise<void> {
    const docRef = doc(db, 'users', profile.uid);
    const existing = await this.getProfile(profile.uid);
    
    if (existing) {
      await updateDoc(docRef, { ...profile });
    } else {
      await setDoc(docRef, {
        ...profile,
        createdAt: Date.now(),
      });
    }
  }
};
