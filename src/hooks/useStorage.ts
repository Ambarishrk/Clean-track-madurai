'use client'

import { useMutation } from '@tanstack/react-query'
import { useStorage } from '@/firebase'
import { storageService } from '@/lib/services/storageService'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

/**
 * Upload avatar image
 */
export const useUploadAvatar = () => {
  const storage = useStorage()
  const { toast } = useToast()
  const [progress, setProgress] = useState(0)

  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      storage
        ? storageService.uploadAvatar(storage, userId, file, setProgress)
        : Promise.reject('Storage not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Avatar uploaded',
      })
      setProgress(0)
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload avatar',
        variant: 'destructive',
      })
      setProgress(0)
    },
  })
}

/**
 * Upload KPI photo
 */
export const useUploadKpiPhoto = () => {
  const storage = useStorage()
  const { toast } = useToast()
  const [progress, setProgress] = useState(0)

  return useMutation({
    mutationFn: ({ snapshotId, file }: { snapshotId: string; file: File }) =>
      storage
        ? storageService.uploadKpiPhoto(storage, snapshotId, file, setProgress)
        : Promise.reject('Storage not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Photo uploaded',
      })
      setProgress(0)
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload photo',
        variant: 'destructive',
      })
      setProgress(0)
    },
  })
}

/**
 * Upload GFC evidence
 */
export const useUploadGfcFile = () => {
  const storage = useStorage()
  const { toast } = useToast()
  const [progress, setProgress] = useState(0)

  return useMutation({
    mutationFn: ({ indicatorId, file }: { indicatorId: string; file: File }) =>
      storage
        ? storageService.uploadGfcEvidence(storage, indicatorId, file, setProgress)
        : Promise.reject('Storage not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'File uploaded',
      })
      setProgress(0)
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      })
      setProgress(0)
    },
  })
}

/**
 * Upload task evidence
 */
export const useUploadTaskFile = () => {
  const storage = useStorage()
  const { toast } = useToast()
  const [progress, setProgress] = useState(0)

  return useMutation({
    mutationFn: ({ taskId, file }: { taskId: string; file: File }) =>
      storage
        ? storageService.uploadTaskEvidence(storage, taskId, file, setProgress)
        : Promise.reject('Storage not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Evidence uploaded',
      })
      setProgress(0)
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload evidence',
        variant: 'destructive',
      })
      setProgress(0)
    },
  })
}
