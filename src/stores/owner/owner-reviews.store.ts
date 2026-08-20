import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { CreateOwnerReplyInput, OwnerReview } from '@/entities/owner'
import { localOwnerReviewRepository, type OwnerReviewRepository } from '@/repositories/owner'

const toErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unable to complete the Owner review request.'

export const useOwnerReviewsStore = defineStore('owner-reviews', () => {
  const items = ref<readonly OwnerReview[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const replyingReviewId = ref<string | null>(null)
  const replyError = ref<string | null>(null)

  async function execute<T>(request: () => Promise<T>): Promise<T | undefined> {
    loading.value = true
    error.value = null
    try {
      return await request()
    } catch (caught) {
      error.value = toErrorMessage(caught)
      return undefined
    } finally {
      loading.value = false
    }
  }

  async function load(
    venueId?: string,
    repository: OwnerReviewRepository = localOwnerReviewRepository,
  ): Promise<void> {
    const result = await execute(() => repository.getAll(venueId))
    if (result) items.value = result
  }

  async function reply(
    reviewId: string,
    input: CreateOwnerReplyInput,
    repository: OwnerReviewRepository = localOwnerReviewRepository,
  ): Promise<OwnerReview | undefined> {
    replyingReviewId.value = reviewId
    replyError.value = null
    try {
      const updated = await repository.reply(reviewId, input)
      items.value = items.value.map((review) => (review.id === reviewId ? updated : review))
      return updated
    } catch (caught) {
      replyError.value = toErrorMessage(caught)
      return undefined
    } finally {
      replyingReviewId.value = null
    }
  }

  function clearError(): void {
    error.value = null
  }

  function clearReplyError(): void {
    replyError.value = null
  }

  return {
    items,
    loading,
    error,
    replyingReviewId,
    replyError,
    load,
    reply,
    clearError,
    clearReplyError,
  }
})
