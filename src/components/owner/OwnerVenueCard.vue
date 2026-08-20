<script setup lang="ts">
import { computed, ref } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import type { OwnerVenue } from '@/entities/owner'
import { t } from '@/i18n'
import { getCategoryById } from '@/config'
import type { MessageKey } from '@/i18n'

import VenueStatusBadge from './VenueStatusBadge.vue'

const props = withDefaults(defineProps<{
  venue: OwnerVenue
  variant?: 'default' | 'compact'
  allowView?: boolean
  allowArchive?: boolean
  allowDelete?: boolean
}>(), {
  variant: 'default',
  allowView: false,
  allowArchive: false,
  allowDelete: false,
})

const emit = defineEmits<{
  edit: []
  view: []
  archive: []
  delete: []
}>()
const menuOpen = ref(false)
const categoryLabel = computed(() => {
  const category = getCategoryById(props.venue.category?.id)
  return t(category.label.key as MessageKey)
})

function run(action: 'view' | 'archive' | 'delete'): void {
  menuOpen.value = false
  if (action === 'view') emit('view')
  else if (action === 'archive') emit('archive')
  else emit('delete')
}
</script>

<template>
  <article class="owner-venue-card" :class="`owner-venue-card--${variant}`">
    <div class="owner-venue-card__media">
      <img v-if="venue.coverMedia?.url" :src="venue.coverMedia.url" :alt="venue.coverMedia.alt || venue.name || t('owner.venue.untitled')" loading="lazy" decoding="async" />
      <span v-else aria-hidden="true"><AppLucideIcon name="map-pin" :size="28" /></span>
    </div>
    <div class="owner-venue-card__content">
      <div class="owner-venue-card__heading">
        <div>
          <strong>{{ venue.name || t('owner.venue.untitled') }}</strong>
          <small>{{ categoryLabel }}</small>
        </div>
        <VenueStatusBadge :status="venue.status" />
      </div>
      <div class="owner-venue-card__meta">
        <span v-if="venue.rating"><AppLucideIcon name="star" :size="15" filled />{{ venue.rating.average.toFixed(1) }}</span>
        <time :datetime="venue.updatedAt">{{ t('owner.venue.updated', { date: new Date(venue.updatedAt).toLocaleDateString() }) }}</time>
      </div>
      <div class="owner-venue-card__actions">
        <AppButton size="sm" variant="secondary" @click="$emit('edit')">
          <template #leading><AppLucideIcon name="settings" :size="18" /></template>
          {{ t('owner.action.edit') }}
        </AppButton>
        <div v-if="allowView || allowArchive || allowDelete" class="owner-venue-card__more">
          <button type="button" :aria-label="t('owner.action.more')" aria-haspopup="menu" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen"><AppLucideIcon name="more" /></button>
          <div v-if="menuOpen" class="owner-venue-card__menu" role="menu">
            <button v-if="allowView" type="button" role="menuitem" @click="run('view')">{{ t('owner.action.view') }}</button>
            <button v-if="allowArchive" type="button" role="menuitem" @click="run('archive')">{{ t('owner.action.archive') }}</button>
            <button v-if="allowDelete" type="button" role="menuitem" class="owner-venue-card__delete" @click="run('delete')">{{ t('owner.action.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.owner-venue-card { position: relative; display: grid; grid-template-columns: 112px minmax(0, 1fr); overflow: visible; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--elevation-1); }
.owner-venue-card__media { min-height: 144px; display: grid; place-items: center; overflow: hidden; border-radius: var(--radius-lg) 0 0 var(--radius-lg); color: var(--color-text-secondary); background: var(--color-surface-muted); }
.owner-venue-card__media img { width: 100%; height: 100%; object-fit: cover; }
.owner-venue-card__content { min-width: 0; display: grid; align-content: space-between; gap: var(--space-3); padding: var(--space-3); }
.owner-venue-card__heading { min-width: 0; display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-2); }
.owner-venue-card__heading > div { min-width: 0; display: grid; gap: 2px; }
.owner-venue-card__heading strong, .owner-venue-card__heading small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.owner-venue-card__heading small, .owner-venue-card__meta { color: var(--color-text-secondary); font-size: var(--font-size-xs); }
.owner-venue-card__heading :deep(.app-badge) { flex: 0 0 auto; }
.owner-venue-card__meta { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
.owner-venue-card__meta span { display: inline-flex; align-items: center; gap: var(--space-1); color: var(--color-warning); }
.owner-venue-card__actions { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); }
.owner-venue-card__more { position: relative; margin-left: auto; }
.owner-venue-card__more > button { width: var(--touch-target-min); height: var(--touch-target-min); display: grid; place-items: center; border: 0; border-radius: var(--radius-md); color: var(--color-text-secondary); background: transparent; cursor: pointer; }
.owner-venue-card__menu { position: absolute; z-index: 20; right: 0; bottom: calc(100% + var(--space-1)); min-width: 150px; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-raised); box-shadow: var(--elevation-2); }
.owner-venue-card__menu button { width: 100%; min-height: var(--touch-target-min); padding-inline: var(--space-3); border: 0; border-bottom: 1px solid var(--color-border); color: var(--color-text-primary); background: transparent; text-align: left; cursor: pointer; }
.owner-venue-card__menu button:last-child { border-bottom: 0; }
.owner-venue-card__menu .owner-venue-card__delete { color: var(--color-danger); }
.owner-venue-card--compact { grid-template-columns: 72px minmax(0, 1fr); }
.owner-venue-card--compact .owner-venue-card__media { min-height: 108px; }
.owner-venue-card--compact .owner-venue-card__meta { display: none; }
@media (max-width: 350px) { .owner-venue-card { grid-template-columns: 84px minmax(0, 1fr); } .owner-venue-card__heading { display: grid; } }
</style>
