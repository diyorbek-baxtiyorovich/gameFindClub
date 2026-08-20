import type { OwnerAnalyticsSummary } from '@/entities/owner'

export interface OwnerAnalyticsRepository {
  getSummary(ownerId: string, signal?: AbortSignal): Promise<OwnerAnalyticsSummary>
}
