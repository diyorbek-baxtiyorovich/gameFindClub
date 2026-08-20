import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { OwnerAnalyticsSummary } from '@/entities/owner'
import {
  localOwnerAnalyticsRepository,
  type OwnerAnalyticsRepository,
} from '@/repositories/owner'

export const useOwnerAnalyticsStore = defineStore('owner-analytics', () => {
  const summary = ref<OwnerAnalyticsSummary | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(
    ownerId: string,
    repository: OwnerAnalyticsRepository = localOwnerAnalyticsRepository,
  ): Promise<void> {
    loading.value = true
    error.value = null
    try {
      summary.value = await repository.getSummary(ownerId)
    } catch (caught) {
      error.value = caught instanceof Error ? caught.message : 'Unable to load Owner analytics.'
    } finally {
      loading.value = false
    }
  }

  return { summary, loading, error, load }
})
