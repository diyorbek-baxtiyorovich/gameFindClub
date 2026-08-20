import { venueListFixtures } from '@/entities/venue'
import type { VenueListItem } from '@/entities/venue'

export interface HomeFixtureData {
  nearby: readonly VenueListItem[]
  recommended: readonly VenueListItem[]
  specialCollections: readonly VenueListItem[]
  recentlyViewed: readonly VenueListItem[]
}

export const homeFixtureData: HomeFixtureData = {
  nearby: venueListFixtures,
  recommended: [venueListFixtures[1], venueListFixtures[0], venueListFixtures[3]],
  specialCollections: [venueListFixtures[2], venueListFixtures[3]],
  recentlyViewed: [venueListFixtures[0], venueListFixtures[2]],
}
