<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import type { VenueDetail, VenuePrimaryAction } from '../../model/venue'
const props = defineProps<{ venue: VenueDetail }>()
const emit = defineEmits<{ action: [action: VenuePrimaryAction] }>()
const secondary = computed<VenuePrimaryAction[]>(() => {
  const actions: VenuePrimaryAction[] = []
  if (props.venue.contact?.phone)
    actions.push({
      kind: 'call',
      label: 'Qo‘ng‘iroq',
      url: `tel:${props.venue.contact.phone}`,
      isAvailable: true,
    })
  return actions
})
</script>
<template>
  <div v-if="secondary.length" class="venue-actions">
    <AppButton
      v-for="action in secondary"
      :key="action.kind"
      variant="secondary"
      @click="emit('action', action)"
      ><template #leading><AppLucideIcon class="venue-actions__icon" name="phone" /></template
      >{{ action.label }}</AppButton
    >
  </div>
</template>
<style scoped>
.venue-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-3);
}
.venue-actions :deep(.app-button) {
  min-height: 64px;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  background: var(--color-surface);
}
.venue-actions__icon {
  color: var(--color-primary);
  font-size: 1.35rem;
}
</style>
