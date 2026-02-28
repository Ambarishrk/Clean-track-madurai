'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFirestore } from '@/firebase'
import { tasksService } from '@/lib/services/tasksService'
import { Task, TaskStatus } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

/**
 * Fetch tasks for a ward or zone
 */
export const useTasks = (wardId?: string, zoneId?: string) => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['tasks', wardId, zoneId],
    queryFn: async () => {
      if (!db) return []
      if (wardId) return tasksService.getAllTasksByWard(db, wardId)
      if (zoneId) return tasksService.getAllTasksByZone(db, zoneId)
      return []
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}

/**
 * Fetch tasks by status
 */
export const useTasksByStatus = (status: TaskStatus, wardId?: string, zoneId?: string) => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['tasks', 'status', status, wardId, zoneId],
    queryFn: () =>
      db ? tasksService.getTasksByStatus(db, status, wardId, zoneId) : Promise.resolve([]),
    staleTime: 3 * 60 * 1000,
  })
}

/**
 * Create a new task
 */
export const useCreateTask = () => {
  const db = useFirestore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) =>
      db ? tasksService.createTask(db, data) : Promise.reject('DB not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Task created successfully',
      })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create task',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Update task status
 */
export const useUpdateTaskStatus = () => {
  const db = useFirestore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      taskId,
      status,
      notes,
    }: {
      taskId: string
      status: TaskStatus
      notes?: string
    }) =>
      db
        ? tasksService.updateTaskStatus(db, taskId, status, notes)
        : Promise.reject('DB not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Task updated',
      })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update task',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Upload task evidence
 */
export const useUploadTaskEvidence = () => {
  const db = useFirestore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      taskId,
      photoEvidenceURL,
    }: {
      taskId: string
      photoEvidenceURL: string
    }) =>
      db
        ? tasksService.updateTaskEvidence(db, taskId, photoEvidenceURL)
        : Promise.reject('DB not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Evidence uploaded',
      })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload evidence',
        variant: 'destructive',
      })
    },
  })
}
