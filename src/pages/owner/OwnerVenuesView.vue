<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppEmptyState from '@/components/feedback/AppEmptyState.vue'
import AppErrorState from '@/components/feedback/AppErrorState.vue'
import OwnerVenueCard from '@/components/owner/OwnerVenueCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppChip from '@/components/ui/AppChip.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppSearchInput from '@/components/ui/AppSearchInput.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import {
  getVenueStatusPresentation,
  OWNER_VENUE_STATUS_FILTERS,
  type VenueStatus,
  type OwnerVenue,
} from '@/entities/owner'
import { t } from '@/i18n'
import { useOwnerVenuesStore } from '@/stores'

type StatusFilter = 'all' | VenueStatus

const router = useRouter()
const venues = useOwnerVenuesStore()
const search = ref('')
const selectedStatus = ref<StatusFilter>('all')
const deleteCandidate = ref<OwnerVenue | null>(null)

const normalizedSearch = computed(() => search.value.trim().toLocaleLowerCase())
const filtersActive = computed(() => Boolean(normalizedSearch.value) || selectedStatus.value !== 'all')
const visibleVenues = computed(() => venues.items.filter((venue) => {
  if (selectedStatus.value !== 'all' && venue.status !== selectedStatus.value) return false
  if (!normalizedSearch.value) return true
  return [venue.name, venue.category?.name, venue.address?.formatted]
    .filter(Boolean)
    .some((value) => String(value).toLocaleLowerCase().includes(normalizedSearch.value))
}))

function openCreate(): void {
  void router.push({ name: 'owner-venue-new' })
}

function handleEmptyAction(): void {
  if (filtersActive.value) {
    search.value = ''
    selectedStatus.value = 'all'
  } else openCreate()
}

function editVenue(venue: OwnerVenue): void {
  void router.push({ name: 'owner-venue-edit', params: { id: venue.id } })
}

function viewVenue(venue: OwnerVenue): void {
  if (venue.slug) void router.push({ name: 'venue-detail', params: { slug: venue.slug } })
}

async function confirmDelete(): Promise<void> {
  if (!deleteCandidate.value) return
  const deleted = await venues.remove(deleteCandidate.value.id)
  if (deleted) deleteCandidate.value = null
}

onMounted(() => venues.load())
</script>

<template>
  <div class="owner-venues-page">
    <header class="owner-venues-page__header">
      <div>
        <h2>{{ t('owner.venues.title') }}</h2>
        <p>{{ t('owner.venues.description') }}</p>
      </div>
      <AppButton size="sm" @click="openCreate">
        <template #leading><AppLucideIcon name="plus" /></template>
        {{ t('owner.action.add_venue') }}
      </AppButton>
    </header>

    <AppSearchInput
      v-model="search"
      :label="t('owner.venues.search_label')"
      :placeholder="t('owner.venues.search_placeholder')"
      :disabled="venues.loading"
    />

    <section class="owner-venues-page__filters" :aria-label="t('owner.venues.status_filter')">
      <AppChip :selected="selectedStatus === 'all'" @click="selectedStatus = 'all'">{{ t('common.all') }}</AppChip>
      <AppChip
        v-for="status in OWNER_VENUE_STATUS_FILTERS"
        :key="status"
        :selected="selectedStatus === status"
        @click="selectedStatus = status"
      >
        {{ t(getVenueStatusPresentation(status).labelKey) }}
      </AppChip>
    </section>

    <div v-if="venues.loading && !venues.items.length" class="owner-venues-page__list" :aria-label="t('common.loading')">
      <AppSkeleton v-for="index in 4" :key="index" height="76px" radius="var(--radius-lg)" />
    </div>

    <AppErrorState
      v-else-if="venues.error"
      :title="t('owner.venues.load_error')"
      :description="venues.error"
      @retry="venues.load()"
    />

    <div v-else-if="visibleVenues.length" class="owner-venues-page__list">
      <OwnerVenueCard
        v-for="venue in visibleVenues"
        :key="venue.id"
        :venue="venue"
        :allow-view="venue.status === 'approved' && Boolean(venue.slug)"
        :allow-archive="venue.status !== 'draft' && venue.status !== 'archived'"
        :allow-delete="venue.status === 'draft'"
        @edit="editVenue(venue)"
        @view="viewVenue(venue)"
        @archive="venues.archive(venue.id)"
        @delete="deleteCandidate = venue"
      />
    </div>

    <AppEmptyState
      v-else
      :title="filtersActive ? t('owner.venues.no_matches') : t('owner.venues.empty')"
      :description="filtersActive ? t('owner.venues.no_matches_description') : t('owner.venues.empty_description')"
      :action-label="filtersActive ? t('filters.reset') : t('owner.action.add_first_venue')"
      @action="handleEmptyAction"
    />

    <AppModal :model-value="Boolean(deleteCandidate)" :title="t('owner.delete.title')" :close-label="t('common.close')" :close-on-backdrop="!venues.loading" @update:model-value="(open) => { if (!open) deleteCandidate = null }">
      <p class="owner-venues-page__delete-copy">{{ t('owner.delete.description', { name: deleteCandidate?.name || t('owner.venue.untitled') }) }}</p>
      <template #footer>
        <AppButton variant="secondary" :disabled="venues.loading" @click="deleteCandidate = null">{{ t('owner.action.cancel') }}</AppButton>
        <AppButton variant="danger" :loading="venues.loading" @click="confirmDelete">{{ t('owner.action.delete') }}</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.owner-venues-page { display: grid; gap: var(--space-4); }
.owner-venues-page__header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3); }
.owner-venues-page__header div { min-width: 0; }
.owner-venues-page__header h2, .owner-venues-page__header p { margin: 0; }
.owner-venues-page__header h2 { font-size: var(--font-size-xl); }
.owner-venues-page__header p { margin-top: var(--space-1); color: var(--color-text-secondary); font-size: var(--font-size-sm); }
.owner-venues-page__header :deep(.app-button) { flex: 0 0 auto; }
.owner-venues-page__filters { display: flex; gap: var(--space-2); overflow-x: auto; padding-bottom: var(--space-1); scrollbar-width: none; }
.owner-venues-page__filters::-webkit-scrollbar { display: none; }
.owner-venues-page__filters :deep(.app-chip) { flex: 0 0 auto; }
.owner-venues-page__list { display: grid; gap: var(--space-3); }
.owner-venues-page__delete-copy { margin: 0; color: var(--color-text-secondary); }
@media (max-width: 350px) { .owner-venues-page__header { align-items: stretch; flex-direction: column; } .owner-venues-page__header :deep(.app-button) { width: 100%; } }
</style>
