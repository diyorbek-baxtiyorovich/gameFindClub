<script setup lang="ts">
import { computed } from 'vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import VenueHeader from '@/entities/venue/components/detail/VenueHeader.vue'
import VenueLocation from '@/entities/venue/components/detail/VenueLocation.vue'
import VenuePricing from '@/entities/venue/components/detail/VenuePricing.vue'
import VenueQuickFacts from '@/entities/venue/components/detail/VenueQuickFacts.vue'
import VenueSchedule from '@/entities/venue/components/detail/VenueSchedule.vue'
import { draftToPreviewVenue } from '@/features/owner/venue-editor/draft-venue-adapter'
import type { VenueEditorDraft } from '@/features/owner/venue-editor'
import { t } from '@/i18n'
import { getCategoryById } from '@/config'
import type { MessageKey } from '@/i18n'
const props = defineProps<{ draft: VenueEditorDraft }>()
const venue = computed(() => {
  const preview = draftToPreviewVenue(props.draft, t('owner.venue.untitled'))
  const category = getCategoryById(props.draft.categoryId)
  return {
    ...preview,
    category: { ...preview.category, name: t(category.label.key as MessageKey) },
  }
})
</script>
<template>
  <section class="preview-step">
    <div class="preview-step__banner">
      <AppBadge tone="warning">{{ t('owner.editor.preview.badge') }}</AppBadge
      ><span>{{ t('owner.editor.preview.notice') }}</span>
    </div>
    <img
      v-if="venue.coverMedia"
      class="preview-step__cover"
      :src="venue.coverMedia.url"
      :alt="venue.coverMedia.alt || venue.name"
    /><VenueHeader :venue="venue" />
    <p v-if="venue.shortDescription" class="preview-step__summary">{{ venue.shortDescription }}</p>
    <p v-if="venue.description">{{ venue.description }}</p>
    <VenueQuickFacts :venue="venue" /><VenuePricing :options="venue.pricing" /><VenueSchedule
      :venue="venue"
      :schedule="venue.openingHours"
    /><VenueLocation :venue="venue" />
    <p
      v-if="
        !venue.shortDescription && !venue.description && !venue.address && !venue.pricing?.length
      "
      class="preview-step__empty"
    >
      {{ t('owner.editor.preview.incomplete') }}
    </p>
  </section>
</template>
<style scoped>
.preview-step {
  display: grid;
  gap: var(--space-4);
}
.preview-step__banner {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  background: var(--color-warning-soft);
  font-size: var(--font-size-sm);
}
.preview-step__cover {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: var(--radius-lg);
}
.preview-step p {
  margin: 0;
}
.preview-step__summary {
  color: var(--color-text-secondary);
}
.preview-step__empty {
  padding: var(--space-5);
  text-align: center;
  color: var(--color-text-secondary);
  background: var(--color-surface-muted);
  border-radius: var(--radius-lg);
}
</style>
