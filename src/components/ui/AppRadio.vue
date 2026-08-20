<script setup lang="ts">
import { useId } from 'vue'

type RadioValue = string | number
const props = withDefaults(
  defineProps<{
    modelValue?: RadioValue | null
    value: RadioValue
    label: string
    name: string
    id?: string
    disabled?: boolean
  }>(),
  { modelValue: null, disabled: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: RadioValue]; change: [value: RadioValue] }>()
const inputId = props.id ?? useId()

function select(): void {
  emit('update:modelValue', props.value)
  emit('change', props.value)
}
</script>

<template>
  <label class="app-radio" :class="{ 'app-radio--disabled': disabled }" :for="inputId">
    <input
      :id="inputId"
      class="app-radio__input"
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="select"
    />
    <span class="app-radio__circle" aria-hidden="true" />
    <span>{{ label }}</span>
  </label>
</template>

<style scoped>
.app-radio {
  min-height: var(--touch-target-min);
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
}
.app-radio__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.app-radio__circle {
  width: 22px;
  height: 22px;
  border: 1px solid var(--color-border-strong);
  border-radius: 50%;
  background: var(--color-surface);
}
.app-radio__input:checked + .app-radio__circle {
  border: 6px solid var(--color-primary);
}
.app-radio__input:focus-visible + .app-radio__circle {
  outline: 3px solid color-mix(in srgb, var(--color-focus) 55%, transparent);
  outline-offset: 2px;
}
.app-radio--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
