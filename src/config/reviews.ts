import type { CategoryReviewCriterion } from './categories.types'
import { getCategoryByCode } from './categories'

export const UNIVERSAL_REVIEW_CRITERIA = [
  { key: 'cleanliness', label: { key: 'review.cleanliness', defaultValue: 'Cleanliness' } },
  { key: 'staffService', label: { key: 'review.staff_service', defaultValue: 'Staff service' } },
  { key: 'value', label: { key: 'review.value', defaultValue: 'Price / quality' } },
  { key: 'atmosphere', label: { key: 'review.atmosphere', defaultValue: 'Atmosphere' } },
] as const satisfies readonly CategoryReviewCriterion[]

export function getReviewCriteria(categoryCode: string): readonly CategoryReviewCriterion[] {
  return [...UNIVERSAL_REVIEW_CRITERIA, ...(getCategoryByCode(categoryCode).reviewCriteria ?? [])]
}
