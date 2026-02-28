'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFirestore } from '@/firebase'
import { gfcService } from '@/lib/services/gfcService'
import { GfcIndicator } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

/**
 * Fetch all GFC indicators
 */
export const useGfcIndicators = () => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['gfc', 'indicators'],
    queryFn: () => (db ? gfcService.getAllIndicators(db) : Promise.resolve([])),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch current GFC composite score
 */
export const useGfcScore = () => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['gfc', 'score'],
    queryFn: () => (db ? gfcService.getGfcScore(db) : Promise.resolve(null)),
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Update a GFC indicator
 */
export const useUpdateGfcIndicator = () => {
  const db = useFirestore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      indicatorId,
      data,
    }: {
      indicatorId: string
      data: Partial<GfcIndicator>
    }) =>
      db
        ? gfcService.updateIndicator(db, indicatorId, data)
        : Promise.reject('DB not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Indicator updated',
      })
      queryClient.invalidateQueries({ queryKey: ['gfc'] })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update indicator',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Upload evidence for a GFC indicator
 */
export const useUploadGfcEvidence = () => {
  const db = useFirestore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      indicatorId,
      evidenceURL,
    }: {
      indicatorId: string
      evidenceURL: string
    }) =>
      db
        ? gfcService.uploadEvidence(db, indicatorId, evidenceURL)
        : Promise.reject('DB not available'),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Evidence uploaded',
      })
      queryClient.invalidateQueries({ queryKey: ['gfc'] })
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
