<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import { t } from '@/i18n'

withDefaults(defineProps<{ title: string; description?: string; retryLabel?: string }>(), {
  retryLabel: () => t('common.retry'),
})
defineEmits<{ retry: [] }>()
</script>

<template>
  <section class="app-error" role="alert">
    <div class="app-error__icon" aria-hidden="true">!</div>
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
    <AppButton v-if="retryLabel" variant="secondary" @click="$emit('retry')">{{
      retryLabel
    }}</AppButton>
    <slot />
  </section>
</template>

<style scoped>
.app-error {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  padding: var(--space-8) var(--space-4);
  text-align: center;
}
.app-error__icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--color-danger);
  background: var(--color-danger-soft);
  font-weight: var(--font-weight-bold);
}
h2,
p {
  margin: 0;
}
h2 {
  font-size: var(--font-size-lg);
}
p {
  max-width: 34ch;
  color: var(--color-text-secondary);
}
</style>
