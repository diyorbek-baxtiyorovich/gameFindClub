import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { getCategoryById, UNKNOWN_CATEGORY } from '@/config'
import type { DynamicFilterValue, FilterRangeValue, FilterState } from '@/types'

const DEFAULT_RADIUS = 10
const hasRange = (value: FilterRangeValue): boolean => value.min != null || value.max != null
const isFilterArray = (value: DynamicFilterValue): value is readonly string[] | readonly number[] => Array.isArray(value)
const hasDynamicValue = (value: DynamicFilterValue): boolean => {
  if (value == null || value === false || value === '') return false
  if (isFilterArray(value)) return value.length > 0
  if (typeof value === 'object') return hasRange(value as FilterRangeValue)
  return true
}

export const useFiltersStore = defineStore('filters', () => {
  const categoryId = ref<string | null>(null)
  const radius = ref(DEFAULT_RADIUS)
  const minRating = ref<number | null>(null)
  const priceRange = ref<FilterRangeValue>({})
  const openNow = ref(false)
  const amenities = ref<string[]>([])
  const verifiedOnly = ref(false)
  const availability = ref<boolean | null>(null)
  const dynamic = ref<FilterState>({})

  const category = computed(() => categoryId.value ? getCategoryById(categoryId.value) : UNKNOWN_CATEGORY)
  const categorySchemas = computed(() => category.value.filters ?? [])
  const activeFilterCount = computed(() => [
    radius.value !== DEFAULT_RADIUS,
    minRating.value != null,
    hasRange(priceRange.value),
    openNow.value,
    amenities.value.length > 0,
    verifiedOnly.value,
    availability.value != null,
    ...Object.values(dynamic.value).map(hasDynamicValue),
  ].filter(Boolean).length)
  const activeFilters = computed(() => {
    const entries: { key: string; label: string }[] = []
    if (radius.value !== DEFAULT_RADIUS) entries.push({ key: 'radius', label: `${radius.value} km` })
    if (openNow.value) entries.push({ key: 'openNow', label: 'Open now' })
    if (minRating.value != null) entries.push({ key: 'minRating', label: `${minRating.value}+ rating` })
    if (hasRange(priceRange.value)) entries.push({ key: 'priceRange', label: 'Price range' })
    if (amenities.value.length) entries.push({ key: 'amenities', label: `${amenities.value.length} amenities` })
    if (verifiedOnly.value) entries.push({ key: 'verifiedOnly', label: 'Verified' })
    if (availability.value != null) entries.push({ key: 'availability', label: 'Available now' })
    for (const schema of categorySchemas.value) {
      if (hasDynamicValue(dynamic.value[schema.key])) entries.push({ key: schema.key, label: schema.label })
    }
    return entries
  })

  const serializedParams = computed<Readonly<Record<string, string | number | boolean>>>(() => {
    const params: Record<string, string | number | boolean> = { radius: radius.value }
    if (categoryId.value) params.categoryId = categoryId.value
    if (minRating.value != null) params.minRating = minRating.value
    if (priceRange.value.min != null) params.priceMin = priceRange.value.min
    if (priceRange.value.max != null) params.priceMax = priceRange.value.max
    if (openNow.value) params.openNow = true
    if (amenities.value.length) params.amenities = amenities.value.join(',')
    if (verifiedOnly.value) params.verifiedOnly = true
    if (availability.value != null) params.availability = availability.value
    for (const [key, value] of Object.entries(dynamic.value)) {
      if (!hasDynamicValue(value)) continue
      if (isFilterArray(value)) params[key] = value.join(',')
      else if (typeof value === 'object' && value) {
        if (value.min != null) params[`${key}Min`] = value.min
        if (value.max != null) params[`${key}Max`] = value.max
      } else if (value != null) params[key] = value
    }
    return params
  })

  function setCategory(nextCategoryId: string | null): void {
    categoryId.value = nextCategoryId
    const validKeys = new Set((nextCategoryId ? getCategoryById(nextCategoryId).filters ?? [] : []).map((schema) => schema.key))
    dynamic.value = Object.fromEntries(Object.entries(dynamic.value).filter(([key]) => validKeys.has(key)))
  }

  function setDynamic(key: string, value: DynamicFilterValue): void {
    if (!categorySchemas.value.some((schema) => schema.key === key)) return
    dynamic.value = { ...dynamic.value, [key]: value }
  }

  function removeFilter(key: string): void {
    if (key === 'radius') radius.value = DEFAULT_RADIUS
    else if (key === 'minRating') minRating.value = null
    else if (key === 'priceRange') priceRange.value = {}
    else if (key === 'openNow') openNow.value = false
    else if (key === 'amenities') amenities.value = []
    else if (key === 'verifiedOnly') verifiedOnly.value = false
    else if (key === 'availability') availability.value = null
    else {
      const next = { ...dynamic.value }
      delete next[key]
      dynamic.value = next
    }
  }

  function resetAll(): void {
    categoryId.value = null
    radius.value = DEFAULT_RADIUS
    minRating.value = null
    priceRange.value = {}
    openNow.value = false
    amenities.value = []
    verifiedOnly.value = false
    availability.value = null
    dynamic.value = {}
  }

  return {
    categoryId, radius, minRating, priceRange, openNow, amenities, verifiedOnly, availability, dynamic,
    category, categorySchemas, activeFilterCount, activeFilters, serializedParams, setCategory, setDynamic, removeFilter, resetAll,
  }
})
