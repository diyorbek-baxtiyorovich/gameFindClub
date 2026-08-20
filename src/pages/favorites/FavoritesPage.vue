<script setup lang="ts">
import { computed, ref } from 'vue'
import AppEmptyState from '@/components/feedback/AppEmptyState.vue'
import VenueList from '@/components/venue/VenueList.vue'
import { CategorySelector } from '@/entities/category'
import { useFavoritesStore } from '@/stores'
import { t } from '@/i18n'

const favorites = useFavoritesStore()
const categoryId = ref<string | null>(null)
const visibleItems = computed(() =>
  categoryId.value
    ? favorites.items.filter((venue) => venue.category.id === categoryId.value)
    : favorites.items,
)
</script>
<template>
  <section class="favorites-page">
    <CategorySelector
      :selected-id="categoryId"
      include-all
      @select="categoryId = $event"
    /><AppEmptyState
      v-if="visibleItems.length === 0"
      :title="t('favorites.empty')"
      :description="t('favorites.description')"
    /><VenueList v-else :items="visibleItems" @favorite="favorites.toggle($event.id)" />
  </section>
</template>
<style scoped>
.favorites-page {
  display: grid;
  gap: var(--space-4);
  padding-block: var(--space-3);
}
</style>
