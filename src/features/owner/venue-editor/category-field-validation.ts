import type { FilterSchema } from '@/types'

import type { VenueCategoryAttributes } from './venue-editor-draft'

export function isCategoryFieldValueValid(field: FilterSchema, value: unknown): boolean {
  const empty = value == null || value === '' || (Array.isArray(value) && value.length === 0)
  if (empty) return !field.required
  if (field.control === 'text') return typeof value === 'string'
  if (field.control === 'number') {
    return typeof value === 'number' && Number.isFinite(value)
      && (field.min == null || value >= field.min)
      && (field.max == null || value <= field.max)
  }
  if (field.control === 'toggle' || field.control === 'boolean') return typeof value === 'boolean'
  if (field.control === 'single-select' || field.control === 'select') {
    return field.options?.some((option) => option.value === value) ?? false
  }
  if (field.control === 'multi-select') {
    return Array.isArray(value) && value.every((item) => field.options?.some((option) => option.value === item))
  }
  return true
}

export function areCategoryFieldsValid(
  fields: readonly FilterSchema[],
  attributes: VenueCategoryAttributes,
): boolean {
  return fields.every((field) => isCategoryFieldValueValid(field, attributes[field.key]))
}
