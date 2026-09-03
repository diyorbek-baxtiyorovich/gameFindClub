export type BookingStatus = 'upcoming' | 'active' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  code: string
  clubId: string
  clubSlug: string
  clubName: string
  device: string
  date: string
  startTime: string
  endTime: string
  durationHours: number
  stationCount: number
  hourlyPrice: number
  totalPrice: number
  status: BookingStatus
}

export interface BookingDraft {
  clubId: string
  clubSlug: string
  clubName: string
  device: string
  date: string
  startTime: string
  durationHours: number
  stationCount: number
  hourlyPrice: number
}
