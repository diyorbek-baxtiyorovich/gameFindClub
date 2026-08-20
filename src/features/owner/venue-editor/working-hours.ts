import type { DailyOpeningHours, OpeningHours, OpeningPeriod, Weekday } from '@/entities/venue'

export const WEEKDAYS: readonly Weekday[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
]

export const DEFAULT_OPENING_PERIOD: OpeningPeriod = { opensAt: '09:00', closesAt: '18:00' }

export function createDefaultOpeningHours(): OpeningHours {
  return { weekly: WEEKDAYS.map((day) => ({ day, isClosed: true, periods: [] })) }
}

export function normalizeOpeningHours(schedule?: OpeningHours): OpeningHours {
  return {
    ...schedule,
    weekly: WEEKDAYS.map((day) => schedule?.weekly.find((item) => item.day === day)
      ?? { day, isClosed: true, periods: [] }),
  }
}

export function isValidTime(value: string): boolean {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)
}

export function isDailyOpeningHoursValid(day: DailyOpeningHours): boolean {
  if (day.isClosed || day.isOpen24Hours) return true
  const period = day.periods?.[0]
  return Boolean(period && isValidTime(period.opensAt) && isValidTime(period.closesAt)
    && period.opensAt !== period.closesAt)
}

export function isOpeningHoursValid(schedule?: OpeningHours): boolean {
  if (!schedule) return true
  const normalized = normalizeOpeningHours(schedule)
  return normalized.weekly.every(isDailyOpeningHoursValid)
}
