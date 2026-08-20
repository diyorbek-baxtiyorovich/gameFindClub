import { getCategoryById } from '@/config'
import type { ContactInfo, PricingOption } from '@/entities/venue'
import type { MessageKey } from '@/i18n'
import type { VenueEditorStepId } from './editor.types'
import { areCategoryFieldsValid } from './category-field-validation'
import {
  isValidInstagram,
  isValidPhone,
  isValidTelegram,
  isValidWebUrl,
} from './contact-validation'
import { isOpeningHoursValid, normalizeOpeningHours } from './working-hours'
import type { VenueEditorDraft } from './venue-editor-draft'

export const VENUE_VALIDATION_LIMITS = {
  nameMin: 3,
  nameMax: 120,
  shortDescriptionMax: 160,
  descriptionMax: 2000,
  pricingDescriptionMax: 300,
} as const

export type VenueBasicField = 'name' | 'shortDescription' | 'description'
export type VenueContactField = 'phone' | 'secondaryPhone' | 'telegram' | 'instagram' | 'website'
export type VenueLocationField = 'address' | 'latitude' | 'longitude'

export function validateBasicInformation(
  draft: VenueEditorDraft,
): Partial<Record<VenueBasicField, MessageKey>> {
  const errors: Partial<Record<VenueBasicField, MessageKey>> = {}
  const nameLength = draft.name.trim().length
  if (!nameLength) errors.name = 'owner.editor.validation.name_required'
  else if (nameLength < VENUE_VALIDATION_LIMITS.nameMin)
    errors.name = 'owner.editor.validation.name_min'
  else if (nameLength > VENUE_VALIDATION_LIMITS.nameMax)
    errors.name = 'owner.editor.validation.name_max'
  if (draft.shortDescription.length > VENUE_VALIDATION_LIMITS.shortDescriptionMax)
    errors.shortDescription = 'owner.editor.validation.short_max'
  if (draft.description.length > VENUE_VALIDATION_LIMITS.descriptionMax)
    errors.description = 'owner.editor.validation.description_max'
  return errors
}

export function validateContacts(
  contacts?: ContactInfo,
): Partial<Record<VenueContactField, MessageKey>> {
  const errors: Partial<Record<VenueContactField, MessageKey>> = {}
  if (contacts?.phone && !isValidPhone(contacts.phone))
    errors.phone = 'owner.editor.validation.phone'
  if (contacts?.secondaryPhone && !isValidPhone(contacts.secondaryPhone))
    errors.secondaryPhone = 'owner.editor.validation.phone'
  if (contacts?.telegramUsername && !isValidTelegram(contacts.telegramUsername))
    errors.telegram = 'owner.editor.validation.telegram'
  const instagram = contacts?.socialLinks?.instagram
  if (instagram && !isValidInstagram(instagram))
    errors.instagram = 'owner.editor.validation.instagram'
  if (contacts?.websiteUrl && !isValidWebUrl(contacts.websiteUrl))
    errors.website = 'owner.editor.validation.url'
  return errors
}

export function validateLocation(
  draft: VenueEditorDraft,
): Partial<Record<VenueLocationField, MessageKey>> {
  const errors: Partial<Record<VenueLocationField, MessageKey>> = {}
  if (!draft.address.formatted.trim()) errors.address = 'owner.editor.validation.address_required'
  const { latitude, longitude } = draft.coordinates
  if (latitude == null || !Number.isFinite(latitude) || latitude < -90 || latitude > 90)
    errors.latitude = 'owner.editor.validation.latitude'
  if (longitude == null || !Number.isFinite(longitude) || longitude < -180 || longitude > 180)
    errors.longitude = 'owner.editor.validation.longitude'
  return errors
}

export function validatePricingOption(
  option: PricingOption,
): Partial<Record<'name' | 'amount' | 'description', MessageKey>> {
  const errors: Partial<Record<'name' | 'amount' | 'description', MessageKey>> = {}
  if (!option.name.trim()) errors.name = 'owner.editor.validation.price_name_required'
  if (
    !Number.isFinite(option.price.amount) ||
    option.price.amount <= 0 ||
    option.price.currency !== 'UZS'
  )
    errors.amount = 'owner.editor.validation.amount_positive'
  if (
    option.description &&
    option.description.length > VENUE_VALIDATION_LIMITS.pricingDescriptionMax
  )
    errors.description = 'owner.editor.validation.price_description_max'
  return errors
}

export function isPricingOptionValid(option: PricingOption): boolean {
  return !Object.keys(validatePricingOption(option)).length
}

export function isPricingValid(pricing: readonly PricingOption[]): boolean {
  return pricing.every(isPricingOptionValid)
}

export function isScheduleSubmissionReady(draft: VenueEditorDraft): boolean {
  return Boolean(
    draft.schedule &&
      isOpeningHoursValid(draft.schedule) &&
      normalizeOpeningHours(draft.schedule).weekly.some((day) => !day.isClosed),
  )
}

export function isMediaDraftValid(draft: VenueEditorDraft): boolean {
  const ids = new Set(draft.media.map((item) => item.id))
  return (
    draft.media.every((item) => item.type === 'image' && !item.url.startsWith('data:')) &&
    (!draft.coverMedia || ids.has(draft.coverMedia.id))
  )
}

export function isVenueEditorStepValid(
  stepId: VenueEditorStepId,
  draft: VenueEditorDraft,
): boolean {
  if (stepId === 'basic-information') return !Object.keys(validateBasicInformation(draft)).length
  if (stepId === 'category') return Boolean(draft.categoryId)
  if (stepId === 'location') return !Object.keys(validateLocation(draft)).length
  if (stepId === 'category-features')
    return areCategoryFieldsValid(
      getCategoryById(draft.categoryId).editorFields ?? [],
      draft.categoryAttributes,
    )
  if (stepId === 'media') return isMediaDraftValid(draft)
  if (stepId === 'pricing') return isPricingValid(draft.pricing)
  if (stepId === 'working-hours') return isScheduleSubmissionReady(draft)
  if (stepId === 'contacts') return !Object.keys(validateContacts(draft.contacts)).length
  return true
}

export type SubmissionIssue =
  | 'name'
  | 'basic'
  | 'category'
  | 'address'
  | 'coordinates'
  | 'category_fields'
  | 'schedule'
  | 'pricing'
  | 'contacts'
  | 'media'

export function validateVenueSubmission(draft: VenueEditorDraft): readonly SubmissionIssue[] {
  const issues: SubmissionIssue[] = []
  const basic = validateBasicInformation(draft)
  if (basic.name) issues.push('name')
  if (basic.shortDescription || basic.description) issues.push('basic')
  if (!draft.categoryId) issues.push('category')
  const location = validateLocation(draft)
  if (location.address) issues.push('address')
  if (location.latitude || location.longitude) issues.push('coordinates')
  if (
    !areCategoryFieldsValid(
      getCategoryById(draft.categoryId).editorFields ?? [],
      draft.categoryAttributes,
    )
  )
    issues.push('category_fields')
  if (!isScheduleSubmissionReady(draft)) issues.push('schedule')
  if (!isPricingValid(draft.pricing)) issues.push('pricing')
  if (Object.keys(validateContacts(draft.contacts)).length) issues.push('contacts')
  if (!isMediaDraftValid(draft)) issues.push('media')
  return issues
}
