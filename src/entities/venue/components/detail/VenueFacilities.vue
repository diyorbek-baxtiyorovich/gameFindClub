<script setup lang="ts">
import type { Facility } from '../../model/venue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import DetailSection from './DetailSection.vue'
defineProps<{ items?: readonly Facility[] }>()
</script>
<template>
  <DetailSection v-if="items?.length" title="Imkoniyatlar"
    ><ul class="item-list">
      <li v-for="item in items" :key="item.id">
        <AppLucideIcon class="item-list__icon" name="sparkles" /><strong>{{ item.name }}</strong
        ><span v-if="item.description">{{ item.description }}</span>
      </li>
    </ul></DetailSection
  >
</template>
<style scoped>
.item-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.item-list li {
  display: grid;
  justify-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  text-align: center;
}
.item-list__icon {
  color: var(--color-primary);
  font-size: 1.6rem;
}
.item-list strong,
.item-list span {
  display: block;
}
.item-list span {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
</style>
