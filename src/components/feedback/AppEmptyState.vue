<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'

withDefaults(defineProps<{ title: string; description?: string; actionLabel?: string }>(), {})
defineEmits<{ action: [] }>()
</script>

<template>
  <section class="app-empty" aria-live="polite">
    <div class="app-empty__icon" aria-hidden="true"><slot name="icon">○</slot></div>
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
    <AppButton v-if="actionLabel" variant="secondary" @click="$emit('action')">{{ actionLabel }}</AppButton>
    <slot />
  </section>
</template>

<style scoped>
.app-empty { display: grid; justify-items: center; gap: var(--space-3); padding: var(--space-8) var(--space-4); text-align: center; color: var(--color-text-primary); }
.app-empty__icon { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; color: var(--color-text-secondary); background: var(--color-surface-muted); font-size: var(--font-size-xl); }
h2, p { margin: 0; }
h2 { font-size: var(--font-size-lg); }
p { max-width: 34ch; color: var(--color-text-secondary); }
</style>
