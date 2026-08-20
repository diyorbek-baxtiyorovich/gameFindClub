import type { CreateVenueInput } from '@/entities/owner'

import type { VenueEditorStep } from './editor.types'

export const VENUE_EDITOR_STEPS: readonly VenueEditorStep[] = [
  { id: 'basic-information', labelKey: 'owner.editor.step.basic', descriptionKey: 'owner.editor.step.basic_description' },
  { id: 'category', labelKey: 'owner.editor.step.category', descriptionKey: 'owner.editor.step.category_description' },
  { id: 'location', labelKey: 'owner.editor.step.location', descriptionKey: 'owner.editor.step.location_description' },
  { id: 'category-features', labelKey: 'owner.editor.step.features', descriptionKey: 'owner.editor.step.features_description' },
  { id: 'amenities-facilities', labelKey: 'owner.editor.step.amenities', descriptionKey: 'owner.editor.step.amenities_description' },
  { id: 'media', labelKey: 'owner.editor.step.media', descriptionKey: 'owner.editor.step.media_description' },
  { id: 'pricing', labelKey: 'owner.editor.step.pricing', descriptionKey: 'owner.editor.step.pricing_description' },
  { id: 'working-hours', labelKey: 'owner.editor.step.hours', descriptionKey: 'owner.editor.step.hours_description' },
  { id: 'contacts', labelKey: 'owner.editor.step.contacts', descriptionKey: 'owner.editor.step.contacts_description' },
  { id: 'preview', labelKey: 'owner.editor.step.preview', descriptionKey: 'owner.editor.step.preview_description' },
  { id: 'submit', labelKey: 'owner.editor.step.submit', descriptionKey: 'owner.editor.step.submit_description' },
]

/** Validation rules can replace this permissive foundation without changing navigation UI. */
export function canAdvanceVenueEditor(_stepIndex: number, _draft: CreateVenueInput): boolean {
  return true
}

export function clampVenueEditorStep(index: number): number {
  return Math.min(Math.max(index, 0), VENUE_EDITOR_STEPS.length - 1)
}
