<script setup lang="ts">
import AppBottomSheet from '@/components/ui/AppBottomSheet.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { CATEGORY_CONFIGS, GLOBAL_FILTER_SCHEMAS } from '@/config'
import { useFiltersStore } from '@/stores'
import type { DynamicFilterValue, FilterRangeValue } from '@/types'
import { t } from '@/i18n'

import DynamicFilterControl from './DynamicFilterControl.vue'

withDefaults(defineProps<{ modelValue: boolean; resultCount?: number }>(), {})
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; apply: [] }>()
const filters = useFiltersStore()
const categoryOptions = CATEGORY_CONFIGS.map((category) => ({ value: category.id, label: category.label.defaultValue }))

function globalValue(key: string): DynamicFilterValue {
  if (key === 'radius') return filters.radius
  if (key === 'minRating') return filters.minRating
  if (key === 'priceRange') return filters.priceRange
  if (key === 'openNow') return filters.openNow
  if (key === 'amenities') return filters.amenities
  if (key === 'verifiedOnly') return filters.verifiedOnly
  if (key === 'availability') return filters.availability
  return null
}

function setGlobal(key: string, value: DynamicFilterValue): void {
  if (key === 'radius') filters.radius = typeof value === 'number' ? value : 10
  else if (key === 'minRating') filters.minRating = typeof value === 'number' ? value : null
  else if (key === 'priceRange') filters.priceRange = (value as FilterRangeValue) ?? {}
  else if (key === 'openNow') filters.openNow = Boolean(value)
  else if (key === 'amenities') filters.amenities = Array.isArray(value) ? value.map(String) : []
  else if (key === 'verifiedOnly') filters.verifiedOnly = Boolean(value)
  else if (key === 'availability') filters.availability = value == null ? null : Boolean(value)
}

function apply(): void {
  emit('apply')
  emit('update:modelValue', false)
}
</script>

<template>
  <AppBottomSheet :model-value="modelValue" title="Filters" @update:model-value="$emit('update:modelValue', $event)">
    <div class="filter-sheet">
      <div class="filter-sheet__top">
        <AppSelect :model-value="filters.categoryId" label="Category" placeholder="All categories" :options="categoryOptions" @update:model-value="filters.setCategory($event == null ? null : String($event))" />
        <AppButton variant="ghost" @click="filters.resetAll">{{ t('filters.reset') }}</AppButton>
      </div>
      <section class="filter-sheet__group">
        <h3>Gaming klub filtrlari</h3>
        <DynamicFilterControl v-for="schema in GLOBAL_FILTER_SCHEMAS" :key="schema.key" :schema="schema" :model-value="globalValue(schema.key)" @update:model-value="setGlobal(schema.key, $event)" />
      </section>
      <section v-if="filters.categorySchemas.length" class="filter-sheet__group">
        <h3>{{ filters.category.label.defaultValue }} filters</h3>
        <DynamicFilterControl v-for="schema in filters.categorySchemas" :key="schema.key" :schema="schema" :model-value="filters.dynamic[schema.key]" @update:model-value="filters.setDynamic(schema.key, $event)" />
      </section>
    </div>
    <template #footer><AppButton full-width @click="apply">{{ resultCount == null ? t('filters.apply') : `${resultCount.toLocaleString()} ta klubni ko‘rish` }}</AppButton></template>
  </AppBottomSheet>
</template>

<style scoped>.filter-sheet { display: grid; gap: var(--space-6); }.filter-sheet__top { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: var(--space-2); }.filter-sheet__group { display: grid; gap: var(--space-4); padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }.filter-sheet__group h3 { margin: 0; font-size: var(--font-size-md); }</style>
