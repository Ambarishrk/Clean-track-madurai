'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useFirestore } from '@/firebase'
import { alertsService } from '@/lib/services/alertsService'
import { Alert } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

/**
 * Fetch all alerts with optional filters
 */
export const useAlerts = (filters?: {
  severity?: string
  type?: string
  wardId?: string
  isResolved?: boolean
}) => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: () => (db ? alertsService.getAllAlerts(db, filters) : Promise.resolve([])),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Fetch alerts for a specific zone
 */
export const useZoneAlerts = (zoneId: string) => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['alerts', 'zone', zoneId],
    queryFn: () => (db ? alertsService.getAlertsByZone(db, zoneId) : Promise.resolve([])),
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * Fetch alerts for a specific ward
 */
export const useWardAlerts = (wardId: string) => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['alerts', 'ward', wardId],
    queryFn: () => (db ? alertsService.getAlertsByWard(db, wardId) : Promise.resolve([])),
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * Resolve an alert
 */
export const useResolveAlert = () => {
  const db = useFirestore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ alertId, resolvedBy }: { alertId: string; resolvedBy: string }) =>
      db ? alertsService.resolveAlert(db, alertId, resolvedBy) : Promise.reject('DB not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Alert resolved',
      })
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to resolve alert',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Assign an alert to a user
 */
export const useAssignAlert = () => {
  const db = useFirestore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ alertId, assignedTo }: { alertId: string; assignedTo: string }) =>
      db ? alertsService.assignAlert(db, alertId, assignedTo) : Promise.reject('DB not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Alert assigned',
      })
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to assign alert',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Subscribe to real-time active alerts
 */
export const useRealtimeAlerts = (zoneId?: string) => {
  const db = useFirestore()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db) {
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = alertsService.subscribeToActiveAlerts(db, setAlerts, zoneId)

    return () => unsubscribe()
  }, [db, zoneId])

  return { alerts, loading }
}
