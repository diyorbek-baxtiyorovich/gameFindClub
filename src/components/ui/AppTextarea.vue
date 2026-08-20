<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label: string
  id?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  maxlength?: number
}>(), { modelValue: '', disabled: false, required: false, rows: 4 })

defineEmits<{ 'update:modelValue': [value: string]; blur: [event: FocusEvent] }>()
const generatedId = useId()
const inputId = props.id ?? generatedId
</script>

<template>
  <div class="app-textarea" :class="{ 'app-textarea--error': error }">
    <label :for="inputId">{{ label }}</label>
    <textarea :id="inputId" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :required="required" :rows="rows" :maxlength="maxlength" :aria-invalid="Boolean(error)" :aria-describedby="hint || error ? `${inputId}-message` : undefined" @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" @blur="$emit('blur', $event)" />
    <p v-if="hint || error" :id="`${inputId}-message`">{{ error || hint }}</p>
  </div>
</template>

<style scoped>
.app-textarea { display: grid; gap: var(--space-2); }
.app-textarea label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }
.app-textarea textarea { width: 100%; min-height: 112px; resize: vertical; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-primary); background: var(--color-surface); }
.app-textarea textarea::placeholder { color: var(--color-text-secondary); }
.app-textarea p { margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-xs); }
.app-textarea--error textarea { border-color: var(--color-danger); }
.app-textarea--error p { color: var(--color-danger); }
</style>
