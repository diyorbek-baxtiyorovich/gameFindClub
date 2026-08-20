<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(defineProps<{ modelValue?: boolean; label: string; id?: string; disabled?: boolean; description?: string }>(), { modelValue: false, disabled: false })
defineEmits<{ 'update:modelValue': [value: boolean]; change: [value: boolean] }>()
const inputId = props.id ?? useId()
</script>

<template>
  <label class="app-switch" :class="{ 'app-switch--disabled': disabled }" :for="inputId">
    <span><span class="app-switch__label">{{ label }}</span><small v-if="description">{{ description }}</small></span>
    <input :id="inputId" class="app-switch__input" type="checkbox" role="switch" :checked="modelValue" :disabled="disabled" @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked); $emit('change', ($event.target as HTMLInputElement).checked)" />
    <span class="app-switch__track" aria-hidden="true"><span class="app-switch__thumb" /></span>
  </label>
</template>

<style scoped>
.app-switch { min-height: var(--touch-target-min); display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); cursor: pointer; }
.app-switch__label { display: block; }
small { display: block; color: var(--color-text-secondary); }
.app-switch__input { position: absolute; opacity: 0; pointer-events: none; }
.app-switch__track { width: 48px; height: 28px; padding: 3px; flex: 0 0 auto; border-radius: var(--radius-pill); background: var(--color-border-strong); transition: background var(--motion-fast); }
.app-switch__thumb { display: block; width: 22px; height: 22px; border-radius: 50%; background: var(--color-surface); box-shadow: var(--elevation-1); transition: transform var(--motion-fast); }
.app-switch__input:checked + .app-switch__track { background: var(--color-primary); }
.app-switch__input:checked + .app-switch__track .app-switch__thumb { transform: translateX(20px); }
.app-switch__input:focus-visible + .app-switch__track { outline: 3px solid color-mix(in srgb, var(--color-focus) 55%, transparent); outline-offset: 2px; }
.app-switch--disabled { opacity: 0.55; cursor: not-allowed; }
</style>
