'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useFirestore } from '@/firebase'
import { kpiService } from '@/lib/services/kpiService'
import { KpiSnapshot } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

/**
 * Fetch KPI history for a specific ward
 */
export const useWardKpiHistory = (wardId: string, days = 30) => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['kpis', wardId, days],
    queryFn: () => (db ? kpiService.getKpiSnapshotsByWard(db, wardId, days) : Promise.resolve([])),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch city-wide KPI aggregate
 */
export const useCityKpiAggregate = () => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['kpis', 'city-aggregate'],
    queryFn: () => (db ? kpiService.getCityWideKpiAggregate(db) : Promise.resolve(null)),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch zone-level KPI aggregate
 */
export const useZoneKpiAggregate = (zoneId: string) => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['kpis', 'zone', zoneId],
    queryFn: () => (db ? kpiService.getZoneKpiAggregate(db, zoneId) : Promise.resolve(null)),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Submit a new KPI snapshot
 */
export const useSubmitKpi = () => {
  const db = useFirestore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: Omit<KpiSnapshot, 'id' | 'createdAt' | 'status'>) =>
      db ? kpiService.submitKpiSnapshot(db, data) : Promise.reject('DB not available'),
    onSuccess: data => {
      toast({
        title: 'Success',
        description: 'KPI snapshot submitted successfully',
      })
      queryClient.invalidateQueries({ queryKey: ['kpis'] })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit KPI',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Subscribe to real-time KPI updates for a ward
 */
export const useRealtimeWardKpi = (wardId: string) => {
  const db = useFirestore()
  const [snapshot, setSnapshot] = useState<KpiSnapshot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db || !wardId) {
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = kpiService.subscribeToWardKpi(db, wardId, data => {
      setSnapshot(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [db, wardId])

  return { snapshot, loading }
}
