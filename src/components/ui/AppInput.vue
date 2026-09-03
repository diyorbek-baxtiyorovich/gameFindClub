<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label: string
    id?: string
    type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'number' | 'time' | 'date'
    placeholder?: string
    hint?: string
    error?: string
    disabled?: boolean
    required?: boolean
    autocomplete?: string
    min?: number
    max?: number
    step?: number
    maxlength?: number
  }>(),
  { modelValue: '', type: 'text', disabled: false, required: false },
)

defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const generatedId = useId()
const inputId = props.id ?? generatedId
</script>

<template>
  <div class="app-input" :class="{ 'app-input--error': error }">
    <label :for="inputId" class="app-input__label">{{ label }}</label>
    <input
      :id="inputId"
      class="app-input__control"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :min="min"
      :max="max"
      :step="step"
      :maxlength="maxlength"
      :aria-invalid="Boolean(error)"
      :aria-describedby="hint || error ? `${inputId}-message` : undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
    <p v-if="hint || error" :id="`${inputId}-message`" class="app-input__message">
      {{ error || hint }}
    </p>
  </div>
</template>

<style scoped>
.app-input {
  display: grid;
  gap: var(--space-2);
}
.app-input__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
.app-input__control {
  min-height: var(--touch-target-min);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  background: var(--color-surface);
}
.app-input__control::placeholder {
  color: var(--color-text-secondary);
}
.app-input__control:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.app-input__message {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
}
.app-input--error .app-input__control {
  border-color: var(--color-danger);
}
.app-input--error .app-input__message {
  color: var(--color-danger);
}
</style>
