import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Firestore,
} from 'firebase/firestore'
import { GfcIndicator } from '@/lib/types'

export interface GfcCompositeScore {
  total: number // 0-100
  byCategory: Record<string, number>
  lastCalculated: Date
}

export const gfcService = {
  /**
   * Get all GFC indicators
   */
  async getAllIndicators(db: Firestore) {
    const indicators = await getDocs(collection(db, 'gfc_indicators'))
    return indicators.docs
      .map(doc => ({ ...doc.data(), id: doc.id } as GfcIndicator))
      .sort((a, b) => a.category.localeCompare(b.category))
  },

  /**
   * Update a GFC indicator
   */
  async updateIndicator(
    db: Firestore,
    indicatorId: string,
    data: Partial<GfcIndicator>
  ) {
    // Auto-update status based on current vs target value
    let updateData = { ...data }
    if (data.currentValue !== undefined && data.targetValue !== undefined) {
      updateData.status = data.currentValue >= data.targetValue ? 'pass' : 'fail'
    }

    const docRef = doc(db, 'gfc_indicators', indicatorId)
    await updateDoc(docRef, {
      ...updateData,
      lastAssessed: Date.now(),
    })
  },

  /**
   * Add evidence URL to an indicator
   */
  async uploadEvidence(
    db: Firestore,
    indicatorId: string,
    evidenceURL: string
  ) {
    const docRef = doc(db, 'gfc_indicators', indicatorId)
    const indicator = (await getDocs(collection(db, 'gfc_indicators'))).docs.find(
      d => d.id === indicatorId
    )

    if (indicator) {
      const existingUrls = indicator.data().evidenceURLs || []
      await updateDoc(docRef, {
        evidenceURLs: [...existingUrls, evidenceURL],
      })
    }
  },

  /**
   * Compute GFC composite score from indicators
   */
  computeGfcScore(indicators: GfcIndicator[]): GfcCompositeScore {
    // Calculate weighted scores
    let totalWeightedScore = 0
    let totalWeight = 0
    const categoryScores: Record<string, { score: number; weight: number }> = {}

    for (const indicator of indicators) {
      const displayValue = (indicator.currentValue / indicator.targetValue) * 100
      const score = Math.min(100, Math.max(0, displayValue)) * indicator.weight

      totalWeightedScore += score
      totalWeight += indicator.weight

      if (!categoryScores[indicator.category]) {
        categoryScores[indicator.category] = { score: 0, weight: 0 }
      }
      categoryScores[indicator.category].score += score
      categoryScores[indicator.category].weight += indicator.weight
    }

    // Normalize total score
    const total = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) / 100 : 0

    // Normalize category scores
    const byCategory: Record<string, number> = {}
    for (const [category, { score, weight }] of Object.entries(categoryScores)) {
      byCategory[category] = weight > 0 ? Math.round((score / weight) * 100) / 100 : 0
    }

    return {
      total,
      byCategory,
      lastCalculated: new Date(),
    }
  },

  /**
   * Get current GFC score
   */
  async getGfcScore(db: Firestore): Promise<GfcCompositeScore | null> {
    const indicators = await this.getAllIndicators(db)
    if (indicators.length === 0) return null
    return this.computeGfcScore(indicators)
  },
}
