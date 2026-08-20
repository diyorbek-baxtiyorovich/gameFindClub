import type { OpeningHours, OccupancyStatus, Venue, Weekday } from '../model/venue'

export type OperationalTone = 'success' | 'warning' | 'danger' | 'neutral'
export interface OperationalStatusDisplay { label: string; tone: OperationalTone; isOpen?: boolean }

const weekdays: readonly Weekday[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const minutes = (time: string): number | null => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time)
  if (!match) return null
  const hours = Number(match[1]); const mins = Number(match[2])
  return hours <= 23 && mins <= 59 ? hours * 60 + mins : null
}

export function deriveOperationalStatus(venue: Venue, schedule?: OpeningHours, now = new Date()): OperationalStatusDisplay {
  if (schedule?.byReservationOnly) return { label: 'Faqat oldindan band qilish orqali', tone: 'neutral' }
  if (schedule?.weekly.length && schedule.weekly.every((day) => day.isOpen24Hours)) return { label: '24/7 ochiq', tone: 'success', isOpen: true }

  if (schedule) {
    const dayIndex = now.getDay()
    const minuteNow = now.getHours() * 60 + now.getMinutes()
    const today = schedule.weekly.find((day) => day.day === weekdays[dayIndex])
    const previous = schedule.weekly.find((day) => day.day === weekdays[(dayIndex + 6) % 7])
    const candidates = [
      ...(today?.periods ?? []).map((period) => ({ ...period, previousDay: false })),
      ...(previous?.periods ?? []).map((period) => ({ ...period, previousDay: true })),
    ]

    for (const period of candidates) {
      const opens = minutes(period.opensAt); const closes = minutes(period.closesAt)
      if (opens == null || closes == null) continue
      const overnight = closes <= opens
      const isOpen = period.previousDay ? overnight && minuteNow < closes : minuteNow >= opens && (overnight || minuteNow < closes)
      if (!isOpen) continue
      const minutesUntilClose = period.previousDay ? closes - minuteNow : overnight ? 1440 - minuteNow + closes : closes - minuteNow
      if (minutesUntilClose <= 60) return { label: `Tez orada yopiladi · ${period.closesAt}`, tone: 'warning', isOpen: true }
      return { label: `Ochiq · ${period.closesAt} gacha`, tone: 'success', isOpen: true }
    }

    const nextToday = today?.periods?.find((period) => (minutes(period.opensAt) ?? -1) > minuteNow)
    if (nextToday) return { label: `Yopiq · ${nextToday.opensAt} da ochiladi`, tone: 'danger', isOpen: false }
  }

  if (venue.operatingStatus) {
    return {
      label: venue.operatingStatus.isOpen ? (venue.operatingStatus.closesAt ? `Ochiq · ${venue.operatingStatus.closesAt} gacha` : 'Ochiq') : venue.operatingStatus.opensAt ? `Yopiq · ${venue.operatingStatus.opensAt} da ochiladi` : 'Yopiq',
      tone: venue.operatingStatus.isOpen ? 'success' : 'danger',
      isOpen: venue.operatingStatus.isOpen,
    }
  }
  return { label: 'Ish vaqti mavjud emas', tone: 'neutral' }
}

export function formatAvailabilityStatus(occupancy?: OccupancyStatus): OperationalStatusDisplay | null {
  if (!occupancy) return null
  if (occupancy.label) return { label: occupancy.label === 'Closed now' ? 'Hozir yopiq' : occupancy.label, tone: occupancy.level === 'full' ? 'danger' : occupancy.level === 'high' ? 'warning' : 'neutral' }
  if (occupancy.level === 'full') return { label: 'Joy qolmagan', tone: 'danger' }
  if (occupancy.level === 'high') return { label: 'Kam joy qoldi', tone: 'warning' }
  if (occupancy.availableCount != null) return { label: `${occupancy.availableCount} ta bo‘sh joy`, tone: 'success' }
  if (occupancy.level === 'low' || occupancy.level === 'empty') return { label: 'Hozir bo‘sh joy bor', tone: 'success' }
  return null
}
