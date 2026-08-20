<script setup lang="ts">
import { useId } from 'vue'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    label: string
    options: readonly SelectOption[]
    id?: string
    placeholder?: string
    hint?: string
    error?: string
    disabled?: boolean
    required?: boolean
  }>(),
  { modelValue: null, placeholder: 'Select an option', disabled: false, required: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string | number | null]; change: [value: string | number | null] }>()
const selectId = props.id ?? useId()

function update(event: Event): void {
  const raw = (event.target as HTMLSelectElement).value
  const value = props.options.find((option) => String(option.value) === raw)?.value ?? null
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="app-select" :class="{ 'app-select--error': error }">
    <label :for="selectId" class="app-select__label">{{ label }}</label>
    <select
      :id="selectId"
      class="app-select__control"
      :value="modelValue ?? ''"
      :disabled="disabled"
      :required="required"
      :aria-invalid="Boolean(error)"
      :aria-describedby="hint || error ? `${selectId}-message` : undefined"
      @change="update"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">{{ option.label }}</option>
    </select>
    <p v-if="hint || error" :id="`${selectId}-message`" class="app-select__message">{{ error || hint }}</p>
  </div>
</template>

<style scoped>
.app-select { display: grid; gap: var(--space-2); }
.app-select__label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }
.app-select__control { min-height: var(--touch-target-min); width: 100%; padding: var(--space-2) var(--space-10) var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-primary); background: var(--color-surface); }
.app-select__message { margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-xs); }
.app-select--error .app-select__control { border-color: var(--color-danger); }
.app-select--error .app-select__message { color: var(--color-danger); }
</style>
