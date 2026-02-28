import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  FirebaseStorage,
} from 'firebase/storage'

export const storageService = {
  /**
   * Upload avatar image
   */
  async uploadAvatar(
    storage: Storage,
    userId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      throw new Error('File size must be less than 5MB')
    }

    const path = `avatars/${userId}/avatar.jpg`
    return this._uploadFile(storage, path, file, onProgress)
  },

  /**
   * Upload KPI photo
   */
  async uploadKpiPhoto(
    storage: Storage,
    snapshotId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      throw new Error('File size must be less than 10MB')
    }

    const path = `kpi/${snapshotId}/photo.jpg`
    return this._uploadFile(storage, path, file, onProgress)
  },

  /**
   * Upload GFC evidence
   */
  async uploadGfcEvidence(
    storage: Storage,
    indicatorId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    if (file.size > 20 * 1024 * 1024) {
      // 20MB
      throw new Error('File size must be less than 20MB')
    }

    const fileName = `${Date.now()}-${file.name}`
    const path = `gfc/${indicatorId}/${fileName}`
    return this._uploadFile(storage, path, file, onProgress)
  },

  /**
   * Upload task evidence
   */
  async uploadTaskEvidence(
    storage: Storage,
    taskId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      throw new Error('File size must be less than 10MB')
    }

    const path = `tasks/${taskId}/evidence.jpg`
    return this._uploadFile(storage, path, file, onProgress)
  },

  /**
   * Delete a file from storage
   */
  async deleteFile(storage: FirebaseStorage, path: string) {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
  },

  /**
   * Internal: Upload file with progress tracking
   */
  async _uploadFile(
    storage: FirebaseStorage,
    path: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const fileRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(fileRef, file)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress?.(progress)
        },
        error => {
          reject(error)
        },
        async () => {
          try {
            const url = await getDownloadURL(fileRef)
            resolve(url)
          } catch (error) {
            reject(error)
          }
        }
      )
    })
  },
}
