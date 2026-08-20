import type { MessageKey } from '@/i18n'

export type VenueEditorMode = 'create' | 'edit'

export type VenueEditorStepId =
  | 'basic-information'
  | 'category'
  | 'location'
  | 'category-features'
  | 'amenities-facilities'
  | 'media'
  | 'pricing'
  | 'working-hours'
  | 'contacts'
  | 'preview'
  | 'submit'

export interface VenueEditorStep {
  id: VenueEditorStepId
  labelKey: MessageKey
  descriptionKey: MessageKey
}
