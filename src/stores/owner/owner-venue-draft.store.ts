import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { OwnerVenue } from '@/entities/owner'
import type { Amenity, ContactInfo, Facility, OpeningHours, PricingOption, VenueMedia } from '@/entities/venue'
import type {
  VenueCategoryAttributeValue,
  VenueEditorDraft,
  VenueEditorDraftAddress,
  VenueEditorDraftCoordinates,
} from '@/features/owner/venue-editor'
import { createEmptyVenueEditorDraft } from '@/features/owner/venue-editor'
import {
  localOwnerVenueDraftRepository,
  type OwnerVenueDraftRepository,
} from '@/repositories/owner'

export type VenueDraftSaveState = 'idle' | 'saving' | 'saved' | 'error'

const AUTOSAVE_DELAY_MS = 650

function draftFromVenue(venue: OwnerVenue): VenueEditorDraft {
  const now = new Date().toISOString()
  return {
    key: `edit:${venue.id}`,
    mode: 'edit',
    ownerId: venue.ownerId,
    sourceVenueId: venue.id,
    name: venue.name ?? '',
    shortDescription: venue.shortDescription ?? '',
    description: venue.description ?? '',
    categoryId: venue.category?.id,
    categoryAttributes: venue.categoryAttributes ?? {},
    address: {
      formatted: venue.address?.formatted ?? '',
      city: venue.address?.city ?? '',
      district: venue.address?.district ?? '',
    },
    coordinates: {
      latitude: venue.location?.latitude,
      longitude: venue.location?.longitude,
    },
    coverMedia: venue.coverMedia,
    media: venue.media ?? [],
    contacts: venue.contacts,
    schedule: venue.schedule,
    activities: venue.activities ?? [],
    facilities: venue.facilities ?? [],
    amenities: venue.amenities ?? [],
    resources: venue.resources ?? [],
    pricing: venue.pricing ?? [],
    createdAt: now,
    updatedAt: now,
  }
}

export const useOwnerVenueDraftStore = defineStore('owner-venue-draft', () => {
  const draft = ref<VenueEditorDraft | null>(null)
  const loading = ref(false)
  const saveState = ref<VenueDraftSaveState>('idle')
  const error = ref<string | null>(null)
  let repository: OwnerVenueDraftRepository = localOwnerVenueDraftRepository
  let saveTimer: ReturnType<typeof setTimeout> | undefined
  let revision = 0
  let savedRevision = 0
  let activeSave: Promise<void> | null = null

  async function initializeCreate(
    ownerId: string,
    nextRepository: OwnerVenueDraftRepository = localOwnerVenueDraftRepository,
  ): Promise<void> {
    repository = nextRepository
    await initialize(`create:${ownerId}`, () => createEmptyVenueEditorDraft(ownerId))
  }

  async function initializeEdit(
    venue: OwnerVenue,
    nextRepository: OwnerVenueDraftRepository = localOwnerVenueDraftRepository,
  ): Promise<void> {
    repository = nextRepository
    await initialize(`edit:${venue.id}`, () => draftFromVenue(venue))
  }

  async function initialize(key: string, fallback: () => VenueEditorDraft): Promise<void> {
    clearTimeout(saveTimer)
    loading.value = true
    error.value = null
    saveState.value = 'idle'
    revision = 0
    savedRevision = 0
    try {
      const persisted = await repository.getByKey(key)
      draft.value = persisted ?? fallback()
      saveState.value = persisted ? 'saved' : 'idle'
    } catch (caught) {
      error.value = caught instanceof Error ? caught.message : 'Unable to load the venue draft.'
      draft.value = fallback()
      saveState.value = 'error'
    } finally {
      loading.value = false
    }
  }

  function mutate(update: (current: VenueEditorDraft) => VenueEditorDraft): void {
    if (!draft.value) return
    draft.value = { ...update(structuredClone(draft.value)), updatedAt: new Date().toISOString() }
    revision += 1
    error.value = null
    saveState.value = 'idle'
    scheduleSave()
  }

  function setBasicInformation(values: Partial<Pick<VenueEditorDraft, 'name' | 'shortDescription' | 'description'>>): void {
    mutate((current) => ({ ...current, ...values }))
  }

  function setCategory(categoryId: string, clearAttributes = false): void {
    mutate((current) => ({
      ...current,
      categoryId,
      categoryAttributes: clearAttributes ? {} : current.categoryAttributes,
    }))
  }

  function setCategoryAttribute(key: string, value: VenueCategoryAttributeValue | undefined): void {
    mutate((current) => {
      const attributes = { ...current.categoryAttributes }
      if (value === undefined) delete attributes[key]
      else attributes[key] = value
      return { ...current, categoryAttributes: attributes }
    })
  }

  function clearCategoryAttributes(): void {
    mutate((current) => ({ ...current, categoryAttributes: {} }))
  }

  function setAddress(values: Partial<VenueEditorDraftAddress>): void {
    mutate((current) => ({ ...current, address: { ...current.address, ...values } }))
  }

  function setCoordinates(values: Partial<VenueEditorDraftCoordinates>): void {
    mutate((current) => ({ ...current, coordinates: { ...current.coordinates, ...values } }))
  }

  function setAmenities(items: readonly Amenity[]): void {
    mutate((current) => ({ ...current, amenities: items }))
  }

  function setFacilities(items: readonly Facility[]): void {
    mutate((current) => ({ ...current, facilities: items }))
  }

  function setMedia(items: readonly VenueMedia[], coverMedia?: VenueMedia): void {
    mutate((current) => ({ ...current, media: items, coverMedia }))
  }

  function setPricing(items: readonly PricingOption[]): void {
    mutate((current) => ({ ...current, pricing: items }))
  }

  function setSchedule(schedule: OpeningHours): void {
    mutate((current) => ({ ...current, schedule }))
  }

  function setContacts(contacts: ContactInfo): void {
    mutate((current) => ({ ...current, contacts }))
  }

  async function discard(): Promise<void> {
    clearTimeout(saveTimer)
    saveTimer = undefined
    if (activeSave) await activeSave
    if (draft.value) await repository.remove(draft.value.key)
    reset()
  }

  function scheduleSave(): void {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => { void saveNow() }, AUTOSAVE_DELAY_MS)
  }

  async function saveNow(): Promise<void> {
    clearTimeout(saveTimer)
    saveTimer = undefined
    if (activeSave) await activeSave
    if (!draft.value || revision === savedRevision) return
    const snapshot = structuredClone(draft.value)
    const savingRevision = revision
    saveState.value = 'saving'
    activeSave = (async () => {
      try {
        await repository.save(snapshot)
        if (savingRevision >= savedRevision) savedRevision = savingRevision
        if (revision === savingRevision) saveState.value = 'saved'
      } catch (caught) {
        if (revision === savingRevision) {
          error.value = caught instanceof Error ? caught.message : 'Unable to save the venue draft.'
          saveState.value = 'error'
        }
      } finally {
        activeSave = null
        if (revision > savedRevision && !saveTimer) scheduleSave()
      }
    })()
    await activeSave
  }

  async function flush(): Promise<void> {
    if (activeSave) await activeSave
    if (revision > savedRevision) await saveNow()
  }

  function reset(): void {
    clearTimeout(saveTimer)
    saveTimer = undefined
    draft.value = null
    saveState.value = 'idle'
    error.value = null
    revision = 0
    savedRevision = 0
  }

  return {
    draft,
    loading,
    saveState,
    error,
    initializeCreate,
    initializeEdit,
    setBasicInformation,
    setCategory,
    setCategoryAttribute,
    clearCategoryAttributes,
    setAddress,
    setCoordinates,
    setAmenities,
    setFacilities,
    setMedia,
    setPricing,
    setSchedule,
    setContacts,
    saveNow,
    flush,
    discard,
    reset,
  }
})
