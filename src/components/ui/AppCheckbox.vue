<script setup lang="ts">
import AppLucideIcon from './AppLucideIcon.vue'
import { useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label: string
    id?: string
    disabled?: boolean
    description?: string
  }>(),
  { modelValue: false, disabled: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; change: [value: boolean] }>()
const inputId = props.id ?? useId()

function update(event: Event): void {
  const value = (event.target as HTMLInputElement).checked
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <label class="app-check" :class="{ 'app-check--disabled': disabled }" :for="inputId">
    <input
      :id="inputId"
      class="app-check__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="update"
    />
    <span class="app-check__box"><AppLucideIcon v-if="modelValue" name="check" :size="16" /></span>
    <span
      ><span class="app-check__label">{{ label }}</span
      ><small v-if="description">{{ description }}</small></span
    >
  </label>
</template>

<style scoped>
.app-check {
  min-height: var(--touch-target-min);
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
}
.app-check__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.app-check__box {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  color: var(--color-text-inverse);
  background: var(--color-surface);
}
.app-check__input:checked + .app-check__box {
  border-color: var(--color-primary);
  background: var(--color-primary);
}
.app-check__input:focus-visible + .app-check__box {
  outline: 3px solid color-mix(in srgb, var(--color-focus) 55%, transparent);
  outline-offset: 2px;
}
.app-check__label {
  display: block;
}
small {
  display: block;
  color: var(--color-text-secondary);
}
.app-check--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
