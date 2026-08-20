import type { VenueMedia } from '@/entities/venue'

export type LocalMediaSelectionErrorCode = 'unsupported-type' | 'file-too-large'
export interface LocalMediaSelectionError {
  fileName: string
  code: LocalMediaSelectionErrorCode
}
export interface LocalMediaSelectionResult {
  media: readonly VenueMedia[]
  errors: readonly LocalMediaSelectionError[]
}
export interface OwnerMediaSelectionService {
  select(files: FileList | readonly File[]): LocalMediaSelectionResult
  release(url: string): void
  releaseAll(): void
}

export const OWNER_MEDIA_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const OWNER_MEDIA_MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = new Set<string>(OWNER_MEDIA_ACCEPTED_TYPES)

class LocalOwnerMediaSelectionService implements OwnerMediaSelectionService {
  private readonly urls = new Set<string>()

  select(files: FileList | readonly File[]): LocalMediaSelectionResult {
    const media: VenueMedia[] = []
    const errors: LocalMediaSelectionError[] = []
    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.has(file.type)) {
        errors.push({ fileName: file.name, code: 'unsupported-type' })
        continue
      }
      if (file.size > OWNER_MEDIA_MAX_FILE_SIZE) {
        errors.push({ fileName: file.name, code: 'file-too-large' })
        continue
      }
      const url = URL.createObjectURL(file)
      this.urls.add(url)
      media.push({
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? `local-media-${crypto.randomUUID()}`
            : `local-media-${Date.now()}-${media.length}`,
        type: 'image',
        url,
        alt: file.name,
        sortOrder: media.length,
      })
    }
    return { media, errors }
  }

  release(url: string): void {
    if (!this.urls.delete(url)) return
    URL.revokeObjectURL(url)
  }

  releaseAll(): void {
    for (const url of this.urls) URL.revokeObjectURL(url)
    this.urls.clear()
  }
}

export const ownerMediaSelectionService: OwnerMediaSelectionService =
  new LocalOwnerMediaSelectionService()
