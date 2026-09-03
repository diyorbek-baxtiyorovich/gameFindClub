import type { FilterSchema } from '@/types'

export type CategoryCode = 'pc-gaming' | 'playstation' | 'vr' | 'private-room' | 'bootcamp' | 'open-24-7'
export type CategoryAccent = 'gaming' | 'cyan' | 'neutral'

export interface LocalizedLabel {
  key: string
  defaultValue: string
}

export interface CategoryDetailSection {
  id: string
  label: LocalizedLabel
  source: 'activities' | 'amenities' | 'facilities' | 'resources' | 'pricing'
}

export interface CategoryReviewCriterion {
  key: string
  label: LocalizedLabel
}

export interface CategoryHighlightRule {
  source: 'resource-attribute' | 'amenity' | 'facility' | 'activity' | 'opening-hours'
  key: string
  label?: LocalizedLabel
}

export interface CategoryConfig {
  id: string
  code: CategoryCode | 'unknown'
  label: LocalizedLabel
  icon: string
  accent: CategoryAccent
  filters?: readonly FilterSchema[]
  detailSections?: readonly CategoryDetailSection[]
  reviewCriteria?: readonly CategoryReviewCriterion[]
  highlights?: readonly CategoryHighlightRule[]
  editorFields?: readonly FilterSchema[]
}
