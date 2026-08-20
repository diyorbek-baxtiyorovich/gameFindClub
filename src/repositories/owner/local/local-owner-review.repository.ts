import type { CreateOwnerReplyInput, OwnerReview } from '@/entities/owner'
import { ownerReviewFixtures } from '@/fixtures/owner'

import type { OwnerReviewRepository } from '../owner-review.repository'
import { createOwnerLocalStorage, OWNER_STORAGE_KEYS } from './owner-local.storage'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && Boolean(value.trim())

function normalizeReview(value: unknown): OwnerReview | undefined {
  if (
    !isRecord(value) ||
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.venueId) ||
    !isNonEmptyString(value.categoryCode) ||
    !isRecord(value.author) ||
    !isNonEmptyString(value.author.id) ||
    !isNonEmptyString(value.author.displayName) ||
    typeof value.rating !== 'number' ||
    !Number.isFinite(value.rating) ||
    value.rating < 1 ||
    value.rating > 5 ||
    !isNonEmptyString(value.createdAt)
  )
    return undefined

  const reply = value.ownerReply
  const ownerReply =
    isRecord(reply) && isNonEmptyString(reply.body) && isNonEmptyString(reply.repliedAt)
      ? {
          body: reply.body.trim(),
          repliedAt: reply.repliedAt,
          ownerName: typeof reply.ownerName === 'string' ? reply.ownerName : undefined,
        }
      : undefined

  return {
    id: value.id,
    venueId: value.venueId,
    venueName: typeof value.venueName === 'string' ? value.venueName : undefined,
    categoryCode: value.categoryCode,
    author: {
      id: value.author.id,
      displayName: value.author.displayName,
      avatarUrl: typeof value.author.avatarUrl === 'string' ? value.author.avatarUrl : undefined,
    },
    rating: value.rating,
    body: typeof value.body === 'string' ? value.body : undefined,
    createdAt: value.createdAt,
    ownerReply,
  }
}

function recoverReviews(value: unknown): OwnerReview[] | undefined {
  if (!Array.isArray(value)) return undefined
  if (!value.length) return []
  const unique = new Map<string, OwnerReview>()
  for (const candidate of value) {
    const review = normalizeReview(candidate)
    if (review && !unique.has(review.id)) unique.set(review.id, review)
  }
  return unique.size ? [...unique.values()] : undefined
}

const isOwnerReviewArray = (value: unknown): value is OwnerReview[] => {
  if (!Array.isArray(value)) return false
  const ids = new Set<string>()
  return value.every((candidate) => {
    const normalized = normalizeReview(candidate)
    if (!normalized || ids.has(normalized.id) || !isRecord(candidate)) return false
    if (candidate.ownerReply !== undefined && !normalized.ownerReply) return false
    if (candidate.body !== undefined && typeof candidate.body !== 'string') return false
    if (candidate.venueName !== undefined && typeof candidate.venueName !== 'string') return false
    ids.add(normalized.id)
    return true
  })
}

const storage = createOwnerLocalStorage<OwnerReview[]>(
  OWNER_STORAGE_KEYS.reviews,
  [...ownerReviewFixtures],
  isOwnerReviewArray,
  recoverReviews,
)

const assertNotAborted = (signal?: AbortSignal): void => {
  if (signal?.aborted) throw new DOMException('The request was cancelled.', 'AbortError')
}

export class LocalOwnerReviewRepository implements OwnerReviewRepository {
  async getAll(venueId?: string, signal?: AbortSignal): Promise<readonly OwnerReview[]> {
    assertNotAborted(signal)
    const reviews = storage.read()
    return venueId ? reviews.filter((review) => review.venueId === venueId) : reviews
  }

  async reply(
    reviewId: string,
    input: CreateOwnerReplyInput,
    signal?: AbortSignal,
  ): Promise<OwnerReview> {
    assertNotAborted(signal)
    const body = input.body.trim()
    if (!body) throw new Error('An Owner reply cannot be empty.')
    const reviews = storage.read()
    const current = reviews.find((review) => review.id === reviewId)
    if (!current) throw new Error(`Review "${reviewId}" was not found.`)
    if (current.ownerReply) throw new Error('This review already has an Owner reply.')
    const updated: OwnerReview = {
      ...current,
      ownerReply: { body, ownerName: input.ownerName, repliedAt: new Date().toISOString() },
    }
    storage.write(reviews.map((review) => (review.id === reviewId ? updated : review)))
    return updated
  }
}

export const localOwnerReviewRepository = new LocalOwnerReviewRepository()
