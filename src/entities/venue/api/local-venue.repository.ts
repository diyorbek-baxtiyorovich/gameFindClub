import { venueDetailFixtures, venueListFixtures } from '../model/fixtures'
import type { VenueRepository } from './venue.repository'

const assertNotAborted = (signal?: AbortSignal): void => {
  if (signal?.aborted) throw new DOMException('The request was cancelled.', 'AbortError')
}

export const localVenueRepository: VenueRepository = {
  async list(params, signal) {
    assertNotAborted(signal)
    const search = params?.search?.trim().toLowerCase()
    const filtered = venueListFixtures.filter((venue) => {
      if (params?.categoryId && venue.category.id !== params.categoryId) return false
      if (params?.bounds && venue.location) {
        const { north, south, east, west } = params.bounds
        if (
          venue.location.latitude > north ||
          venue.location.latitude < south ||
          venue.location.longitude > east ||
          venue.location.longitude < west
        )
          return false
      }
      if (
        params?.latitude != null &&
        params.longitude != null &&
        params.radius != null &&
        venue.distanceMeters != null &&
        venue.distanceMeters > params.radius * 1000
      )
        return false
      const filters = params?.filters
      if (filters?.openNow && !venue.operatingStatus?.isOpen) return false
      if (filters?.availability && !(venue.occupancy?.availableCount && venue.occupancy.availableCount > 0)) return false
      if (typeof filters?.minRating === 'number' && (venue.rating?.average ?? 0) < filters.minRating) return false
      if (typeof filters?.priceMin === 'number' && (venue.priceFrom?.price.amount ?? 0) < filters.priceMin) return false
      if (typeof filters?.priceMax === 'number' && (venue.priceFrom?.price.amount ?? Infinity) > filters.priceMax) return false
      if (typeof filters?.amenities === 'string') {
        const requested = filters.amenities.split(',')
        if (!requested.every((id) => venue.amenityIds?.includes(id))) return false
      }
      const resources = venue.resources ?? []
      const attributes = resources.flatMap((resource) => Object.values(resource.attributes ?? {}).map(String))
      for (const key of ['gpu', 'monitorRefreshRate', 'games', 'consoleType', 'headset']) {
        const requested = filters?.[key]
        if (typeof requested === 'string' && !requested.split(',').some((value) => attributes.some((attribute) => attribute.toLowerCase().includes(value.toLowerCase())) || venue.installedGames?.some((game) => game.toLowerCase().includes(value.toLowerCase())))) return false
      }
      if (typeof filters?.minRam === 'number') {
        const hasEnoughRam = resources.some((resource) => Number.parseInt(String(resource.attributes?.ram ?? 0), 10) >= Number(filters.minRam))
        if (!hasEnoughRam) return false
      }
      if (!search) return true
      return [
        venue.name,
        venue.category.name,
        venue.address?.formatted,
        ...(venue.highlights ?? []),
        ...(venue.installedGames ?? []),
        ...attributes,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    })
    return [...filtered].sort((a, b) => {
      if (params?.sort === 'nearest') return (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity)
      if (params?.sort === 'highest-rated') return (b.rating?.average ?? 0) - (a.rating?.average ?? 0)
      if (params?.sort === 'lowest-price') return (a.priceFrom?.price.amount ?? Infinity) - (b.priceFrom?.price.amount ?? Infinity)
      if (params?.sort === 'most-popular') return (b.rating?.count ?? 0) - (a.rating?.count ?? 0)
      if (params?.sort === 'open-now') return Number(Boolean(b.operatingStatus?.isOpen)) - Number(Boolean(a.operatingStatus?.isOpen))
      return (b.occupancy?.availableCount ?? 0) - (a.occupancy?.availableCount ?? 0)
    })
  },
  async getBySlug(slug, signal) {
    assertNotAborted(signal)
    return venueDetailFixtures.find((venue) => venue.slug === slug) ?? null
  },
}
