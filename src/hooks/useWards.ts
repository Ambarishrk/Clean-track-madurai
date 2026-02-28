'use client'

import { useQuery } from '@tanstack/react-query'
import { useFirestore } from '@/firebase'
import { wardsService } from '@/lib/services/wardsService'

/**
 * Fetch all wards
 */
export const useAllWards = () => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['wards'],
    queryFn: () => (db ? wardsService.getAllWards(db) : Promise.resolve([])),
    staleTime: 10 * 60 * 1000, // 10 minutes (static data)
  })
}

/**
 * Fetch a specific ward
 */
export const useWardById = (wardId: string) => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['wards', wardId],
    queryFn: () => (db && wardId ? wardsService.getWardById(db, wardId) : Promise.resolve(null)),
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Fetch wards for a specific zone
 */
export const useWardsByZone = (zoneId: string) => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['wards', 'zone', zoneId],
    queryFn: () => (db && zoneId ? wardsService.getWardsByZone(db, zoneId) : Promise.resolve([])),
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Fetch all zones
 */
export const useAllZones = () => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['zones'],
    queryFn: () => (db ? wardsService.getAllZones(db) : Promise.resolve([])),
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Fetch a specific zone
 */
export const useZoneById = (zoneId: string) => {
  const db = useFirestore()

  return useQuery({
    queryKey: ['zones', zoneId],
    queryFn: () => (db && zoneId ? wardsService.getZoneById(db, zoneId) : Promise.resolve(null)),
    staleTime: 10 * 60 * 1000,
  })
}
