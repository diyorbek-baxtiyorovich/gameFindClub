<script setup lang="ts">
import { computed } from 'vue'
import AppChip from '@/components/ui/AppChip.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppSwitch from '@/components/ui/AppSwitch.vue'
import type { DynamicFilterValue, FilterPrimitive, FilterRangeValue, FilterSchema } from '@/types'
import FilterSection from './FilterSection.vue'
import RangeFilter from './RangeFilter.vue'

const props = defineProps<{ schema: FilterSchema; modelValue?: DynamicFilterValue }>()
const emit = defineEmits<{ 'update:modelValue': [value: DynamicFilterValue] }>()
const selectOptions = computed(() => (props.schema.options ?? []).filter((option) => typeof option.value !== 'boolean') as readonly { value: string | number; label: string; disabled?: boolean }[])

function toggleOption(value: FilterPrimitive): void {
  if (typeof value === 'boolean') return
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const index = current.indexOf(value as never)
  if (index >= 0) current.splice(index, 1)
  else current.push(value as never)
  emit('update:modelValue', current)
}
</script>
<template>
  <FilterSection :title="schema.label" :description="schema.description">
    <AppSelect v-if="schema.control === 'select' || schema.control === 'single-select'" :model-value="(modelValue as string | number | null) ?? null" :label="schema.label" :options="selectOptions" @update:model-value="$emit('update:modelValue', $event)" />
    <div v-else-if="schema.control === 'multi-select'" class="dynamic-filter__chips">
      <AppChip v-for="option in schema.options ?? []" :key="String(option.value)" :selected="Array.isArray(modelValue) && modelValue.includes(option.value as never)" @click="toggleOption(option.value)">{{ option.label }}</AppChip>
    </div>
    <RangeFilter v-else-if="schema.control === 'range'" :model-value="(modelValue as FilterRangeValue) ?? {}" :label="schema.label" :min="schema.min" :max="schema.max" :step="schema.step" :unit-label="schema.unitLabel" @update:model-value="$emit('update:modelValue', $event)" />
    <AppSwitch v-else-if="schema.control === 'boolean' || schema.control === 'toggle'" :model-value="Boolean(modelValue)" :label="schema.label" @update:model-value="$emit('update:modelValue', $event)" />
    <AppInput v-else-if="schema.control === 'number'" :model-value="modelValue == null ? '' : String(modelValue)" :label="schema.label" type="number" :placeholder="schema.unitLabel" @update:model-value="$emit('update:modelValue', $event === '' ? null : Number($event))" />
    <AppInput v-else-if="schema.control === 'text'" :model-value="typeof modelValue === 'string' ? modelValue : ''" :label="schema.label" @update:model-value="$emit('update:modelValue', $event)" />
    <p v-else class="dynamic-filter__unsupported">This filter is not supported yet.</p>
  </FilterSection>
</template>
<style scoped>.dynamic-filter__chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }.dynamic-filter__unsupported { margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm); }</style>
