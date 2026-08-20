export const OWNER_STORAGE_KEYS = {
  venues: 'gcf_owner_venues',
  reviews: 'gcf_owner_reviews',
  analytics: 'gcf_owner_analytics',
  venueDrafts: 'gcf_owner_venue_drafts',
} as const

export interface OwnerLocalStorage<T> {
  read(): T
  write(value: T): void
}

const clone = <T>(value: T): T => structuredClone(value)

export function createOwnerLocalStorage<T>(
  key: string,
  seed: T,
  isValid: (value: unknown) => value is T,
  recover?: (value: unknown) => T | undefined,
): OwnerLocalStorage<T> {
  return {
    read() {
      if (typeof localStorage === 'undefined') return clone(seed)
      let stored: string | null
      try {
        stored = localStorage.getItem(key)
      } catch {
        return clone(seed)
      }
      if (stored == null) {
        const initial = clone(seed)
        try {
          this.write(initial)
        } catch {
          /* Memory fallback remains usable. */
        }
        return initial
      }
      try {
        const parsed: unknown = JSON.parse(stored)
        if (isValid(parsed)) return parsed
        const recovered = recover?.(parsed)
        if (recovered !== undefined) {
          try {
            this.write(recovered)
          } catch {
            /* Return the recovered in-memory value. */
          }
          return recovered
        }
      } catch {
        // A corrupt local mock is replaced with a valid development seed below.
      }
      const fallback = clone(seed)
      try {
        this.write(fallback)
      } catch {
        /* Return the valid seed in memory. */
      }
      return fallback
    },
    write(value) {
      if (typeof localStorage === 'undefined') return
      localStorage.setItem(key, JSON.stringify(value))
    },
  }
}

export const isRecordArray = (value: unknown): value is Record<string, unknown>[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'object' && item !== null)
