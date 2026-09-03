import type { Booking, BookingDraft } from './booking'

export interface BookingRepository {
  list(): Promise<readonly Booking[]>
  create(draft: BookingDraft): Promise<Booking>
  cancel(id: string): Promise<void>
}

const STORAGE_KEY = 'game-club-finder.bookings.v1'
const fixture: Booking[] = [{ id: 'booking-demo', code: 'GCF-7K2M', clubId: 'club-nexus', clubSlug: 'nexus-gaming-arena', clubName: 'Nexus Gaming Arena', device: 'Premium PC', date: '2026-09-05', startTime: '20:00', endTime: '22:00', durationHours: 2, stationCount: 2, hourlyPrice: 40000, totalPrice: 160000, status: 'upcoming' }]

function read(): Booking[] {
  try { const value = localStorage.getItem(STORAGE_KEY); return value ? JSON.parse(value) as Booking[] : fixture }
  catch { return fixture }
}
function write(items: readonly Booking[]): void { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* browser privacy mode */ } }
function endTime(startTime: string, duration: number): string {
  const [hour, minute] = startTime.split(':').map(Number)
  return `${String((hour + duration) % 24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export const localBookingRepository: BookingRepository = {
  async list() { return read() },
  async create(draft) {
    const booking: Booking = { ...draft, id: crypto.randomUUID(), code: `GCF-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, endTime: endTime(draft.startTime, draft.durationHours), totalPrice: draft.hourlyPrice * draft.durationHours * draft.stationCount, status: 'upcoming' }
    write([booking, ...read()])
    return booking
  },
  async cancel(id) { write(read().map((item) => item.id === id ? { ...item, status: 'cancelled' } : item)) },
}
