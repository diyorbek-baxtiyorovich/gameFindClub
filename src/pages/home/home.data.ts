import { venueListFixtures } from '@/entities/venue'
import type { VenueListItem } from '@/entities/venue'

export interface HomeFixtureData {
  nearby: readonly VenueListItem[]
  popular: readonly VenueListItem[]
  bestHardware: readonly VenueListItem[]
  openAllNight: readonly VenueListItem[]
  tournamentReady: readonly VenueListItem[]
  recentlyViewed: readonly VenueListItem[]
}

export const homeFixtureData: HomeFixtureData = {
  nearby: [...venueListFixtures].sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0)).slice(0, 4),
  popular: [...venueListFixtures].sort((a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0)).slice(0, 4),
  bestHardware: venueListFixtures.filter((club) => club.resources?.some((resource) => ['RTX 4070', 'RTX 4080'].some((gpu) => String(resource.attributes?.gpu).includes(gpu)))),
  openAllNight: venueListFixtures.filter((club) => club.isOpen24Hours),
  tournamentReady: venueListFixtures.filter((club) => club.badges?.includes('Tournament')),
  recentlyViewed: [venueListFixtures[0], venueListFixtures[2]],
}
