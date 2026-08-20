import type { Locale } from '@/i18n'

export function formatAnalyticsCount(value: number | null | undefined, locale: Locale): string {
  if (value == null || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.max(0, value))
}

export function formatAnalyticsRating(value: number | null | undefined, locale: Locale): string {
  if (value == null || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value)
}

export function formatAnalyticsDate(value: string, locale: Locale): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date)
}
