<script setup lang="ts">
import type { Amenity } from '../../model/venue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import DetailSection from './DetailSection.vue'
defineProps<{ items?: readonly Amenity[] }>()
</script>
<template>
  <DetailSection v-if="items?.length" title="Qulayliklar"
    ><ul class="amenities">
      <li v-for="item in items" :key="item.id"><AppLucideIcon name="check" />{{ item.name }}</li>
    </ul></DetailSection
  >
</template>
<style scoped>
.amenities {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.amenities li {
  min-height: 100px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  background: var(--color-surface);
  text-align: center;
  font-size: var(--font-size-sm);
}
.amenities li span {
  color: var(--color-primary);
  font-size: 1.5rem;
}
</style>
