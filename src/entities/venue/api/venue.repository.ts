import type { VenueDetail, VenueListItem } from '../model/venue'

export interface VenueQueryParams {
  search?: string
  categoryId?: string
  latitude?: number
  longitude?: number
  radius?: number
  filters?: Readonly<Record<string, string | number | boolean>>
  sort?: string
  bounds?: { north: number; south: number; east: number; west: number }
}

export interface VenueRepository {
  list(params?: VenueQueryParams, signal?: AbortSignal): Promise<readonly VenueListItem[]>
  getBySlug(slug: string, signal?: AbortSignal): Promise<VenueDetail | null>
}

export interface VenueResponseAdapter<TRawList = unknown, TRawDetail = unknown> {
  toVenueList(raw: TRawList): readonly VenueListItem[]
  toVenueDetail(raw: TRawDetail): VenueDetail
}
