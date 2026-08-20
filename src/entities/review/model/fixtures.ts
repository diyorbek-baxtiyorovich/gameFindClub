import type { Review } from './review'

export const reviewFixtures: readonly Review[] = [
  { id: 'review-1', venueId: 'venue-gaming-nexus', categoryCode: 'gaming', author: { id: 'user-1', displayName: 'Aziz', avatarUrl: 'https://i.pravatar.cc/120?img=12' }, rating: 5, body: 'Comfortable place and stable connection.', createdAt: '2026-08-15T10:00:00Z', criteria: [{ criterionKey: 'cleanliness', score: 5 }, { criterionKey: 'internetSpeed', score: 5 }], ownerReply: { body: 'Thank you for visiting us!', repliedAt: '2026-08-16T09:00:00Z', ownerName: 'Venue team' } },
  { id: 'review-2', venueId: 'venue-tennis-center', categoryCode: 'tennis', author: { id: 'user-2', displayName: 'Madina', avatarUrl: 'https://i.pravatar.cc/120?img=47' }, rating: 4, body: 'Good courts and helpful staff.', createdAt: '2026-08-12T14:30:00Z', criteria: [{ criterionKey: 'courtQuality', score: 4 }, { criterionKey: 'lighting', score: 4 }] },
  { id: 'review-3', venueId: 'venue-football-five', categoryCode: 'football', author: { id: 'user-3', displayName: 'Sardor', avatarUrl: 'https://i.pravatar.cc/120?img=11' }, rating: 4, body: 'The field was ready on time.', createdAt: '2026-08-08T18:00:00Z', criteria: [{ criterionKey: 'fieldQuality', score: 4 }] },
]
