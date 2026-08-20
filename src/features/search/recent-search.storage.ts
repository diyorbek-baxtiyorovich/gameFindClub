export interface RecentSearchStorage {
  read(): readonly string[]
  write(queries: readonly string[]): void
}

const STORAGE_KEY = 'game-club-finder:recent-searches'

export const browserRecentSearchStorage: RecentSearchStorage = {
  read() {
    if (typeof localStorage === 'undefined') return []
    try {
      const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(0, 8) : []
    } catch {
      return []
    }
  },
  write(queries) {
    if (typeof localStorage === 'undefined') return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(queries.slice(0, 8))) } catch { /* Storage may be unavailable. */ }
  },
}
