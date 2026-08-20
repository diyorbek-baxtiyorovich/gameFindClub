<script setup lang="ts">
import AppChip from '@/components/ui/AppChip.vue'
import { CATEGORY_CONFIGS } from '@/config'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import { t, type MessageKey } from '@/i18n'

defineProps<{ selectedId?: string | null; includeAll?: boolean }>()
defineEmits<{ select: [categoryId: string | null] }>()
const categoryIcons: Readonly<Record<string, string>> = {
  gaming: 'gamepad',
  tennis: 'trophy',
  football: 'trophy',
  gym: 'dumbbell',
}
</script>

<template>
  <div class="category-selector" role="list" aria-label="Venue categories">
    <AppChip v-if="includeAll" :selected="!selectedId" @click="$emit('select', null)"
      >{{ t('common.all') }}</AppChip
    >
    <AppChip
      v-for="category in CATEGORY_CONFIGS"
      :key="category.id"
      :selected="selectedId === category.id"
      @click="$emit('select', category.id)"
    >
      <span class="category-selector__icon"
        ><AppLucideIcon :name="categoryIcons[category.code] ?? 'sparkles'" :size="16"
      /></span>
      {{ t(category.label.key as MessageKey) }}
    </AppChip>
  </div>
</template>

<style scoped>
.category-selector {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  margin-inline: calc(var(--space-4) * -1);
  padding: 0 var(--space-4) var(--space-1);
  scrollbar-width: none;
}
.category-selector::-webkit-scrollbar {
  display: none;
}
.category-selector > * {
  flex: 0 0 auto;
}
.category-selector__icon {
  display: inline-flex;
}
</style>
