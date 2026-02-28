'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useFirestore } from '@/firebase'
import { notificationsService } from '@/lib/services/notificationsService'
import { useToast } from '@/hooks/use-toast'

/**
 * Fetch notifications for the current user
 */
export const useNotifications = (userId: string) => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => (db && userId ? notificationsService.getNotificationsByUser(db, userId) : Promise.resolve([])),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Get real-time unread count
 */
export const useUnreadCount = (userId: string) => {
  const db = useFirestore()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!db || !userId) return

    const unsubscribe = notificationsService.subscribeToUnreadCount(db, userId, setCount)
    return () => unsubscribe()
  }, [db, userId])

  return count
}

/**
 * Mark a notification as read
 */
export const useMarkAsRead = () => {
  const db = useFirestore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (notificationId: string) =>
      db
        ? notificationsService.markAsRead(db, notificationId)
        : Promise.reject('DB not available'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to mark as read',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const db = useFirestore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (userId: string) =>
      db ? notificationsService.markAllAsRead(db, userId) : Promise.reject('DB not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to mark all as read',
        variant: 'destructive',
      })
    },
  })
}
