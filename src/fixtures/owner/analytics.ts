import type { OwnerAnalyticsSummary } from '@/entities/owner'

export const ownerAnalyticsFixtures: readonly OwnerAnalyticsSummary[] = [
  {
    ownerId: 'owner-local',
    dataSource: 'mock-local',
    venueCount: 4,
    publishedVenueCount: 1,
    totalViews: 1284,
    totalFavorites: 96,
    totalCalls: 73,
    totalDirections: 118,
    averageRating: 4.8,
    reviewCount: 24,
    viewsOverTime: [
      { date: '2026-08-14', value: 126 },
      { date: '2026-08-15', value: 158 },
      { date: '2026-08-16', value: 143 },
      { date: '2026-08-17', value: 196 },
      { date: '2026-08-18', value: 221 },
      { date: '2026-08-19', value: 207 },
      { date: '2026-08-20', value: 233 },
    ],
    actionBreakdown: [
      { key: 'favorites', value: 96 },
      { key: 'calls', value: 73 },
      { key: 'directions', value: 118 },
    ],
    periodStart: '2026-08-01',
    periodEnd: '2026-08-20',
  },
]
