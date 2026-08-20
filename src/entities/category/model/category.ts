import type { FilterSchema } from '@/types'

export interface CategorySummary {
  id: string
  slug: string
  name: string
  icon?: string
  venueCount?: number
}

export interface VenueCategory extends CategorySummary {
  description?: string
  imageUrl?: string
  filters?: readonly FilterSchema[]
  resourceAttributeLabels?: Readonly<Record<string, string>>
  primaryActionLabel?: string
  sortOrder?: number
  isActive?: boolean
}
