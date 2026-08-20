import type { CreateOwnerReplyInput, OwnerReview } from '@/entities/owner'

export interface OwnerReviewRepository {
  getAll(venueId?: string, signal?: AbortSignal): Promise<readonly OwnerReview[]>
  reply(reviewId: string, input: CreateOwnerReplyInput, signal?: AbortSignal): Promise<OwnerReview>
}
