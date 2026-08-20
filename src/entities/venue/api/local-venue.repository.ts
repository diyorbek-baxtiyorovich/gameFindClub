import { venueDetailFixtures, venueListFixtures } from '../model/fixtures'
import type { VenueRepository } from './venue.repository'

const assertNotAborted = (signal?: AbortSignal): void => {
  if (signal?.aborted) throw new DOMException('The request was cancelled.', 'AbortError')
}

export const localVenueRepository: VenueRepository = {
  async list(params, signal) {
    assertNotAborted(signal)
    const search = params?.search?.trim().toLowerCase()
    return venueListFixtures.filter((venue) => {
      if (params?.categoryId && venue.category.id !== params.categoryId) return false
      if (params?.bounds && venue.location) {
        const { north, south, east, west } = params.bounds
        if (venue.location.latitude > north || venue.location.latitude < south || venue.location.longitude > east || venue.location.longitude < west) return false
      }
      if (params?.latitude != null && params.longitude != null && params.radius != null && venue.distanceMeters != null && venue.distanceMeters > params.radius * 1000) return false
      if (!search) return true
      return [venue.name, venue.category.name, venue.address?.formatted, ...(venue.highlights ?? [])]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    })
  },
  async getBySlug(slug, signal) {
    assertNotAborted(signal)
    return venueDetailFixtures.find((venue) => venue.slug === slug) ?? null
  },
}
