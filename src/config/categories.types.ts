import type { FilterSchema } from '@/types'

export type CategoryCode = 'gaming' | 'tennis' | 'football' | 'gym'
export type CategoryAccent = 'gaming' | 'tennis' | 'football' | 'gym' | 'neutral'

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
}
