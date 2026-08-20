<script setup lang="ts">
import { computed } from 'vue'

import AppCheckbox from '@/components/ui/AppCheckbox.vue'
import AppChip from '@/components/ui/AppChip.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import type { SelectOption } from '@/components/ui/AppSelect.vue'
import { getCategoryById } from '@/config'
import type { FilterOption, FilterSchema } from '@/types'
import type { VenueCategoryAttributeValue, VenueEditorDraft } from '@/features/owner/venue-editor'
import { t, type MessageKey } from '@/i18n'
import { useOwnerVenueDraftStore } from '@/stores'

const props = defineProps<{ draft: VenueEditorDraft }>()
const draftStore = useOwnerVenueDraftStore()
const category = computed(() => getCategoryById(props.draft.categoryId))
const fields = computed(() => category.value.editorFields ?? [])
const categoryLabel = computed(() => t(category.value.label.key as MessageKey))

const label = (field: FilterSchema): string => field.labelKey ? t(field.labelKey as MessageKey) : field.label
const optionLabel = (option: FilterOption): string => option.labelKey ? t(option.labelKey as MessageKey) : option.label
const valueFor = (field: FilterSchema): VenueCategoryAttributeValue | undefined => props.draft.categoryAttributes[field.key]

function errorFor(field: FilterSchema): string | undefined {
  const value = valueFor(field)
  if (field.required && (value == null || value === '' || (Array.isArray(value) && !value.length))) return t('owner.editor.validation.field_required')
  if (field.control === 'number' && value != null) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return t('owner.editor.validation.number')
    if (field.min != null && value < field.min) return t('owner.editor.validation.number_min', { min: field.min })
    if (field.max != null && value > field.max) return t('owner.editor.validation.number_max', { max: field.max })
  }
  return undefined
}

function updateNumber(field: FilterSchema, raw: string): void {
  if (!raw.trim()) {
    draftStore.setCategoryAttribute(field.key, undefined)
    return
  }
  const value = Number(raw)
  if (!Number.isFinite(value)) return
  if (field.min != null && value < field.min) return
  if (field.max != null && value > field.max) return
  draftStore.setCategoryAttribute(field.key, value)
}

function updateSelect(field: FilterSchema, value: string | number | null): void {
  const allowed = field.options?.some((option) => option.value === value)
  draftStore.setCategoryAttribute(field.key, allowed && value != null ? value : undefined)
}

function toggleMulti(field: FilterSchema, option: FilterOption): void {
  if (typeof option.value !== 'string' && typeof option.value !== 'number') return
  const current = valueFor(field)
  if (typeof option.value === 'string') {
    const values = Array.isArray(current) ? current.filter((item): item is string => typeof item === 'string') : []
    draftStore.setCategoryAttribute(field.key, values.includes(option.value) ? values.filter((item) => item !== option.value) : [...values, option.value])
  } else {
    const values = Array.isArray(current) ? current.filter((item): item is number => typeof item === 'number') : []
    draftStore.setCategoryAttribute(field.key, values.includes(option.value) ? values.filter((item) => item !== option.value) : [...values, option.value])
  }
}

function isSelected(field: FilterSchema, option: FilterOption): boolean {
  const value = valueFor(field)
  return Array.isArray(value) && value.includes(option.value as never)
}

function selectedValue(field: FilterSchema): string | number | null {
  const value = valueFor(field)
  return typeof value === 'string' || typeof value === 'number' ? value : null
}

function selectOptions(field: FilterSchema): readonly SelectOption[] {
  return (field.options ?? []).flatMap((option) =>
    typeof option.value === 'string' || typeof option.value === 'number'
      ? [{ value: option.value, label: optionLabel(option), disabled: option.disabled }]
      : [],
  )
}
</script>

<template>
  <div class="dynamic-fields-step">
    <header>
      <h3>{{ t('owner.editor.features.title', { category: categoryLabel }) }}</h3>
      <p>{{ t('owner.editor.features.description') }}</p>
    </header>

    <template v-for="field in fields" :key="field.key">
      <AppInput v-if="field.control === 'text'" :model-value="String(valueFor(field) ?? '')" :label="label(field)" :hint="field.description" :error="errorFor(field)" :required="field.required" @update:model-value="draftStore.setCategoryAttribute(field.key, $event)" />
      <AppInput v-else-if="field.control === 'number'" :model-value="valueFor(field)?.toString() ?? ''" type="number" :label="label(field)" :hint="field.unitLabel" :error="errorFor(field)" :required="field.required" :min="field.min" :max="field.max" :step="field.step" @update:model-value="updateNumber(field, $event)" />
      <AppCheckbox v-else-if="field.control === 'toggle' || field.control === 'boolean'" :model-value="valueFor(field) === true" :label="label(field)" :description="field.description" @update:model-value="draftStore.setCategoryAttribute(field.key, $event)" />
      <AppSelect v-else-if="field.control === 'single-select' || field.control === 'select'" :model-value="selectedValue(field)" :label="label(field)" :options="selectOptions(field)" :error="errorFor(field)" :required="field.required" @update:model-value="updateSelect(field, $event)" />
      <fieldset v-else-if="field.control === 'multi-select'" class="dynamic-fields-step__multi">
        <legend>{{ label(field) }}</legend>
        <div>
          <AppChip v-for="option in field.options" :key="String(option.value)" :selected="isSelected(field, option)" :disabled="option.disabled" @click="toggleMulti(field, option)">{{ optionLabel(option) }}</AppChip>
        </div>
        <small v-if="errorFor(field)">{{ errorFor(field) }}</small>
      </fieldset>
    </template>

    <p v-if="!fields.length" class="dynamic-fields-step__empty">{{ t('owner.editor.features.empty') }}</p>
  </div>
</template>

<style scoped>
.dynamic-fields-step { display: grid; gap: var(--space-5); }
.dynamic-fields-step header h3, .dynamic-fields-step header p { margin: 0; }
.dynamic-fields-step header p, .dynamic-fields-step__empty { margin-top: var(--space-2); color: var(--color-text-secondary); }
.dynamic-fields-step__multi { display: grid; gap: var(--space-2); margin: 0; padding: 0; border: 0; }
.dynamic-fields-step__multi legend { margin-bottom: var(--space-2); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }
.dynamic-fields-step__multi > div { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.dynamic-fields-step__multi small { color: var(--color-danger); }
</style>
