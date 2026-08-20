import type { GeoPoint } from '@/entities/venue/model/venue'

export type GeolocationErrorCode = 'permission-denied' | 'timeout' | 'unavailable' | 'unsupported' | 'unknown'
export interface LocationCoordinates extends GeoPoint { accuracyMeters?: number; altitudeMeters?: number }
export type LocationResult =
  | { ok: true; coordinates: LocationCoordinates; source: 'telegram' | 'browser' }
  | { ok: false; error: { code: GeolocationErrorCode; message: string }; source: 'telegram' | 'browser' | 'none' }

export interface ManualLocation {
  city?: string
  district?: string
  mapPoint?: GeoPoint
}
