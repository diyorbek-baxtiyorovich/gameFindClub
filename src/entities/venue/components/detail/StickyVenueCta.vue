<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import type { VenuePrimaryAction } from '../../model/venue'
const props = defineProps<{ action?: VenuePrimaryAction | null }>()
defineEmits<{ activate: [action: VenuePrimaryAction] }>()
const label = computed(() => {
  if (!props.action) return ''
  if (props.action.kind === 'directions') return 'Yo‘nalish olish'
  if (props.action.kind === 'call') return 'Qo‘ng‘iroq qilish'
  if (props.action.kind === 'book') return 'Band qilish'
  return props.action.label
})
</script>
<template><div v-if="action" class="sticky-cta"><AppButton full-width :disabled="action.isAvailable === false" @click="$emit('activate', action)"><template #leading><AppLucideIcon :name="action.kind === 'call' ? 'phone' : 'navigation'" /></template>{{ label }}</AppButton></div></template>
<style scoped>.sticky-cta { position: fixed; z-index: 90; right: 0; bottom: 0; left: 0; padding: var(--space-3) calc(var(--space-4) + var(--safe-area-right)) calc(var(--space-3) + var(--safe-area-bottom)) calc(var(--space-4) + var(--safe-area-left)); border-top: 1px solid var(--color-border); background: color-mix(in srgb, var(--color-surface) 94%, transparent); backdrop-filter: blur(12px); }@media (min-width: 520px) { .sticky-cta { right: 50%; left: auto; width: var(--content-max-width); transform: translateX(50%); border-right: 1px solid var(--color-border); border-left: 1px solid var(--color-border); } }</style>
