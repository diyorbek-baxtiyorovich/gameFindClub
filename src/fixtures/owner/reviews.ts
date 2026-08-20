import type { OwnerReview } from '@/entities/owner'

export const ownerReviewFixtures: readonly OwnerReview[] = [
  {
    id: 'owner-review-1',
    venueId: 'owner-venue-nexus',
    venueName: 'Nexus Gaming Club',
    categoryCode: 'gaming',
    author: { id: 'user-1', displayName: 'Aziz' },
    rating: 5,
    body: 'Comfortable place and stable connection.',
    createdAt: '2026-08-15T10:00:00.000Z',
    criteria: [{ criterionKey: 'internetSpeed', score: 5 }],
  },
  {
    id: 'owner-review-2',
    venueId: 'owner-venue-nexus',
    venueName: 'Nexus Gaming Club',
    categoryCode: 'gaming',
    author: { id: 'user-2', displayName: 'Madina' },
    rating: 4,
    body: 'Helpful staff and clean equipment.',
    createdAt: '2026-08-18T17:30:00.000Z',
    ownerReply: {
      body: 'Thank you. We hope to see you again!',
      ownerName: 'Nexus team',
      repliedAt: '2026-08-19T08:15:00.000Z',
    },
  },
]
