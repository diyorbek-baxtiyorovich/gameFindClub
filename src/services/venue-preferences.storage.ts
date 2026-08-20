export interface IdListStorage {
  read(): readonly string[]
  write(ids: readonly string[]): void
}

export function createIdListStorage(key: string): IdListStorage {
  return {
    read() {
      if (typeof localStorage === 'undefined') return []
      try {
        const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
        return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
      } catch { return [] }
    },
    write(ids) {
      if (typeof localStorage === 'undefined') return
      try { localStorage.setItem(key, JSON.stringify(ids)) } catch { /* Persistence is optional. */ }
    },
  }
}

export const favoritesStorage = createIdListStorage('game-club-finder:favorite-venue-ids')
export const historyStorage = createIdListStorage('game-club-finder:recent-venue-ids')
