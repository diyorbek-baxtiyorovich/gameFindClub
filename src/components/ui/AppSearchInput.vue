<script setup lang="ts">
import { useId } from 'vue'
import { t } from '@/i18n'
import AppLucideIcon from './AppLucideIcon.vue'

withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    disabled?: boolean
  }>(),
  { modelValue: '', label: () => t('search.placeholder'), placeholder: () => t('search.placeholder'), disabled: false },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  clear: []
}>()

const inputId = useId()

function clear(): void {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <form class="app-search" role="search" @submit.prevent="$emit('search', modelValue)">
    <label :for="inputId" class="app-search__label">{{ label }}</label>
    <span class="app-search__icon"><AppLucideIcon name="search" :size="21" /></span>
    <input
      :id="inputId"
      class="app-search__control"
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button v-if="modelValue" class="app-search__clear" type="button" aria-label="Clear search" :disabled="disabled" @click="clear"><AppLucideIcon name="x" :size="19" /></button>
  </form>
</template>

<style scoped>
.app-search { position: relative; }
.app-search__label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.app-search__icon { position: absolute; left: var(--space-3); top: 50%; transform: translateY(-50%); color: var(--color-text-secondary); font-size: 1.35rem; }
.app-search__control { width: 100%; min-height: var(--touch-target-min); padding: var(--space-2) var(--space-10); border: 1px solid var(--color-border); border-radius: var(--radius-lg); color: var(--color-text-primary); background: var(--color-surface-muted); appearance: none; }
.app-search__control::-webkit-search-cancel-button { display: none; }
.app-search__clear { position: absolute; right: 0; top: 50%; width: var(--touch-target-min); height: var(--touch-target-min); transform: translateY(-50%); border: 0; border-radius: 50%; color: var(--color-text-secondary); background: transparent; cursor: pointer; font-size: 1.25rem; }
</style>
