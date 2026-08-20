import type { OwnerReview } from '@/entities/owner'

export type OwnerReviewReplyFilter = 'all' | 'unanswered' | 'replied'
export type OwnerReviewRatingFilter = 'all' | 'low' | 'high'

/** Maps cleanly to future repository query parameters without coupling the UI to an API. */
export interface OwnerReviewFilters {
  reply: OwnerReviewReplyFilter
  rating: OwnerReviewRatingFilter
}

export const DEFAULT_OWNER_REVIEW_FILTERS: Readonly<OwnerReviewFilters> = {
  reply: 'all',
  rating: 'all',
}

export function filterOwnerReviews(
  reviews: readonly OwnerReview[],
  filters: OwnerReviewFilters,
): readonly OwnerReview[] {
  return reviews.filter((review) => {
    if (filters.reply === 'unanswered' && review.ownerReply) return false
    if (filters.reply === 'replied' && !review.ownerReply) return false
    if (filters.rating === 'low' && (review.rating < 1 || review.rating > 3)) return false
    if (filters.rating === 'high' && (review.rating < 4 || review.rating > 5)) return false
    return true
  })
}
