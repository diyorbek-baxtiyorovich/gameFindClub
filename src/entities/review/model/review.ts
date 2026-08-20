export interface RatingBreakdownItem {
  score: number
  count: number
  percentage?: number
}

export type RatingBreakdown = readonly RatingBreakdownItem[]

export interface RatingSummary {
  average: number
  count: number
  scale?: number
  breakdown?: RatingBreakdown
}

export interface ReviewAuthor { id: string; displayName: string; avatarUrl?: string }
export interface ReviewCriterionScore { criterionKey: string; score: number }
export interface OwnerReply { body: string; repliedAt: string; ownerName?: string }
export interface Review {
  id: string
  venueId: string
  categoryCode: string
  author: ReviewAuthor
  rating: number
  body?: string
  createdAt: string
  criteria?: readonly ReviewCriterionScore[]
  ownerReply?: OwnerReply
}
export interface ReviewFormSubmission {
  venueId: string
  categoryCode: string
  rating: number
  body?: string
  criteria: readonly ReviewCriterionScore[]
}
