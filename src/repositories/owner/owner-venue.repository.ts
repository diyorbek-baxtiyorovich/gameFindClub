import type { CreateVenueInput, OwnerVenue, UpdateVenueInput } from '@/entities/owner'

export interface OwnerVenueRepository {
  getAll(signal?: AbortSignal): Promise<readonly OwnerVenue[]>
  getById(id: string, signal?: AbortSignal): Promise<OwnerVenue | null>
  create(input: CreateVenueInput, signal?: AbortSignal): Promise<OwnerVenue>
  update(id: string, input: UpdateVenueInput, signal?: AbortSignal): Promise<OwnerVenue>
  remove(id: string, signal?: AbortSignal): Promise<void>
  archive(id: string, signal?: AbortSignal): Promise<OwnerVenue>
  submitForReview(id: string, signal?: AbortSignal): Promise<OwnerVenue>
}
