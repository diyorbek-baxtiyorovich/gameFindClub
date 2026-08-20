<script setup lang="ts">
import AppInput from '@/components/ui/AppInput.vue'
import type { FilterRangeValue } from '@/types'

const props = withDefaults(defineProps<{ modelValue: FilterRangeValue; label: string; min?: number; max?: number; step?: number; unitLabel?: string }>(), { step: 1 })
const emit = defineEmits<{ 'update:modelValue': [value: FilterRangeValue] }>()
const update = (key: 'min' | 'max', raw: string): void => emit('update:modelValue', { ...props.modelValue, [key]: raw === '' ? undefined : Number(raw) })
</script>
<template><div class="range-filter"><AppInput :model-value="modelValue.min?.toString() ?? ''" :label="`Minimum ${label}`" type="number" :placeholder="unitLabel" :min="min" :max="max" :step="step" @update:model-value="update('min', $event)" /><AppInput :model-value="modelValue.max?.toString() ?? ''" :label="`Maximum ${label}`" type="number" :placeholder="unitLabel" :min="min" :max="max" :step="step" @update:model-value="update('max', $event)" /></div></template>
<style scoped>.range-filter { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }</style>
