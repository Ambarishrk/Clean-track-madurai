
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  doc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { Post } from '@/lib/types';

export const postService = {
  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'commentsCount'>, imageFile?: File): Promise<string> {
    let imageUrl = '';
    
    if (imageFile) {
      const storageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      imageUrl,
      createdAt: Date.now(),
      likesCount: 0,
      commentsCount: 0,
    });

    return docRef.id;
  },

  async getAllPosts(): Promise<Post[]> {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  },

  async getPostsByUser(uid: string): Promise<Post[]> {
    const q = query(
      collection(db, 'posts'), 
      where('authorId', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  }
};
