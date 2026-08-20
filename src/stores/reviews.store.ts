import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reviewFixtures } from '@/entities/review/model/fixtures'
import type { Review, ReviewFormSubmission } from '@/entities/review'

export const useReviewsStore = defineStore('reviews', () => {
  const items = ref<readonly Review[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await Promise.resolve()
      items.value = reviewFixtures
    } catch {
      error.value = 'Reviews could not be loaded. Please try again.'
    } finally { loading.value = false }
  }

  function submit(payload: ReviewFormSubmission): void {
    const review: Review = { ...payload, id: `local-${Date.now()}`, author: { id: 'local-user', displayName: 'You' }, createdAt: new Date().toISOString() }
    items.value = [review, ...items.value]
  }

  return { items, loading, error, load, submit }
})
