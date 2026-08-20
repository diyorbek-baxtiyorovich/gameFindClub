import type { OwnerAnalyticsSummary } from '@/entities/owner'
import { ownerAnalyticsFixtures } from '@/fixtures/owner'

import type { OwnerAnalyticsRepository } from '../owner-analytics.repository'
import { createOwnerLocalStorage, OWNER_STORAGE_KEYS } from './owner-local.storage'

/** Static development fixture access only; this repository performs no event tracking. */
const metricKeys = [
  'venueCount',
  'publishedVenueCount',
  'totalViews',
  'totalFavorites',
  'reviewCount',
] as const
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

function normalizeAnalytics(value: unknown): OwnerAnalyticsSummary | undefined {
  if (
    !isRecord(value) ||
    typeof value.ownerId !== 'string' ||
    metricKeys.some((key) => typeof value[key] !== 'number' || !Number.isFinite(value[key]))
  )
    return undefined
  const viewsOverTime = Array.isArray(value.viewsOverTime)
    ? value.viewsOverTime.filter((point): point is { date: string; value: number } => isRecord(point)
      && typeof point.date === 'string' && typeof point.value === 'number' && Number.isFinite(point.value))
    : []
  const actionBreakdown = Array.isArray(value.actionBreakdown)
    ? value.actionBreakdown.filter((item): item is { key: 'favorites' | 'calls' | 'directions'; value: number } => isRecord(item)
      && (item.key === 'favorites' || item.key === 'calls' || item.key === 'directions')
      && typeof item.value === 'number' && Number.isFinite(item.value))
    : []
  const totalFavorites = value.totalFavorites as number
  const totalCalls = typeof value.totalCalls === 'number' ? value.totalCalls : 0
  const totalDirections = typeof value.totalDirections === 'number' ? value.totalDirections : 0
  return {
    ownerId: value.ownerId,
    dataSource: 'mock-local',
    venueCount: value.venueCount as number,
    publishedVenueCount: value.publishedVenueCount as number,
    totalViews: value.totalViews as number,
    totalFavorites,
    totalCalls,
    totalDirections,
    reviewCount: value.reviewCount as number,
    viewsOverTime,
    actionBreakdown: actionBreakdown.length ? actionBreakdown : [
      { key: 'favorites', value: totalFavorites },
      { key: 'calls', value: totalCalls },
      { key: 'directions', value: totalDirections },
    ],
    averageRating: typeof value.averageRating === 'number' ? value.averageRating : undefined,
    periodStart: typeof value.periodStart === 'string' ? value.periodStart : undefined,
    periodEnd: typeof value.periodEnd === 'string' ? value.periodEnd : undefined,
  }
}

function recoverAnalytics(value: unknown): OwnerAnalyticsSummary[] | undefined {
  if (!Array.isArray(value)) return undefined
  const summaries = value
    .map(normalizeAnalytics)
    .filter((item): item is OwnerAnalyticsSummary => Boolean(item))
  return summaries.length || !value.length ? summaries : undefined
}

const isAnalyticsArray = (value: unknown): value is OwnerAnalyticsSummary[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      isRecord(item) &&
      normalizeAnalytics(item) !== undefined &&
      item.dataSource === 'mock-local' &&
      typeof item.totalCalls === 'number' &&
      typeof item.totalDirections === 'number' &&
      Array.isArray(item.viewsOverTime) &&
      Array.isArray(item.actionBreakdown),
  )

const storage = createOwnerLocalStorage<OwnerAnalyticsSummary[]>(
  OWNER_STORAGE_KEYS.analytics,
  [...ownerAnalyticsFixtures],
  isAnalyticsArray,
  recoverAnalytics,
)

export class LocalOwnerAnalyticsRepository implements OwnerAnalyticsRepository {
  async getSummary(ownerId: string, signal?: AbortSignal): Promise<OwnerAnalyticsSummary> {
    if (signal?.aborted) throw new DOMException('The request was cancelled.', 'AbortError')
    return (
      storage.read().find((summary) => summary.ownerId === ownerId) ?? {
        ownerId,
        dataSource: 'mock-local',
        venueCount: 0,
        publishedVenueCount: 0,
        totalViews: 0,
        totalFavorites: 0,
        totalCalls: 0,
        totalDirections: 0,
      reviewCount: 0,
      viewsOverTime: [],
      actionBreakdown: [
        { key: 'favorites', value: 0 },
        { key: 'calls', value: 0 },
        { key: 'directions', value: 0 },
      ],
      }
    )
  }
}

export const localOwnerAnalyticsRepository = new LocalOwnerAnalyticsRepository()
