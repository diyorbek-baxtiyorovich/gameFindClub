<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

import AppErrorState from '@/components/feedback/AppErrorState.vue'
import VenueEditorShell from '@/components/owner/VenueEditorShell.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import AppButton from '@/components/ui/AppButton.vue'
import {
  canAdvanceVenueEditor,
  clampVenueEditorStep,
  VENUE_EDITOR_STEPS,
  isVenueEditorStepValid,
  type VenueEditorMode,
} from '@/features/owner/venue-editor'
import BasicInformationStep from '@/features/owner/venue-editor/components/BasicInformationStep.vue'
import CategoryStep from '@/features/owner/venue-editor/components/CategoryStep.vue'
import LocationStep from '@/features/owner/venue-editor/components/LocationStep.vue'
import DynamicCategoryFieldsStep from '@/features/owner/venue-editor/components/DynamicCategoryFieldsStep.vue'
import AmenitiesFacilitiesStep from '@/features/owner/venue-editor/components/AmenitiesFacilitiesStep.vue'
import MediaStep from '@/features/owner/venue-editor/components/MediaStep.vue'
import PricingStep from '@/features/owner/venue-editor/components/PricingStep.vue'
import WorkingHoursStep from '@/features/owner/venue-editor/components/WorkingHoursStep.vue'
import ContactsStep from '@/features/owner/venue-editor/components/ContactsStep.vue'
import VenuePreviewStep from '@/features/owner/venue-editor/components/VenuePreviewStep.vue'
import SubmitForModerationStep from '@/features/owner/venue-editor/components/SubmitForModerationStep.vue'
import { ownerMediaSelectionService } from '@/services/owner-media-selection'
import { t } from '@/i18n'
import { useOwnerSessionStore, useOwnerVenueDraftStore, useOwnerVenuesStore } from '@/stores'
import { useTelegramBackButton } from '@/composables/useTelegramBackButton'

const props = defineProps<{ mode: VenueEditorMode; venueId?: string }>()
const router = useRouter()
const session = useOwnerSessionStore()
const venues = useOwnerVenuesStore()
const draftStore = useOwnerVenueDraftStore()
const currentStepIndex = ref(0)
const notFound = ref(false)

const currentStep = computed(() => VENUE_EDITOR_STEPS[currentStepIndex.value])
const loading = computed(() => venues.loading || draftStore.loading)
const loadError = computed(() => venues.error || (!draftStore.draft ? draftStore.error : null))
const canGoNext = computed(() => {
  const draft = draftStore.draft
  if (!draft || !canAdvanceVenueEditor(currentStepIndex.value, { ownerId: draft.ownerId })) return false
  return currentStep.value ? isVenueEditorStepValid(currentStep.value.id, draft) : false
})

async function initialize(): Promise<void> {
  currentStepIndex.value = 0
  notFound.value = false
  venues.clearError()
  if (props.mode === 'create') {
    await draftStore.initializeCreate(session.profile.id)
    return
  }
  if (!props.venueId) {
    notFound.value = true
    return
  }
  await venues.selectById(props.venueId)
  if (!venues.selected && !venues.error) notFound.value = true
  else if (venues.selected) await draftStore.initializeEdit(venues.selected)
}

function goBack(): void {
  if (currentStepIndex.value > 0) currentStepIndex.value = clampVenueEditorStep(currentStepIndex.value - 1)
  else void router.push({ name: 'owner-venues' })
}

function goNext(): void {
  if (!canGoNext.value) return
  currentStepIndex.value = clampVenueEditorStep(currentStepIndex.value + 1)
}

useTelegramBackButton(goBack)

watch(() => [props.mode, props.venueId] as const, initialize, { immediate: true })
onBeforeRouteLeave(async () => {
  await draftStore.flush()
  ownerMediaSelectionService.releaseAll()
  draftStore.reset()
  return true
})
</script>

<template>
  <div v-if="loading" class="owner-editor-loading" :aria-label="t('common.loading')">
    <AppSkeleton height="68px" />
    <AppSkeleton height="280px" radius="var(--radius-lg)" />
  </div>
  <AppErrorState v-else-if="loadError" :title="t('owner.editor.load_error')" :description="loadError" @retry="initialize" />
  <AppErrorState v-else-if="notFound" :title="t('owner.editor.not_found')" :description="t('owner.editor.not_found_description')" :retry-label="t('owner.editor.back_to_venues')" @retry="router.push({ name: 'owner-venues' })" />
  <VenueEditorShell v-else-if="draftStore.draft" :mode="mode" :steps="VENUE_EDITOR_STEPS" :current-step-index="currentStepIndex" :can-go-next="canGoNext" :save-state="draftStore.saveState" @back="goBack" @next="goNext">
    <template #default>
      <div v-if="draftStore.saveState === 'error'" class="owner-editor-save-error" role="alert">
        <p>{{ draftStore.error || t('owner.editor.save.failure_description') }}</p>
        <AppButton size="sm" variant="secondary" @click="draftStore.saveNow()">{{ t('owner.editor.save.retry') }}</AppButton>
      </div>
      <BasicInformationStep v-if="currentStep?.id === 'basic-information'" :draft="draftStore.draft" />
      <CategoryStep v-else-if="currentStep?.id === 'category'" :draft="draftStore.draft" />
      <LocationStep v-else-if="currentStep?.id === 'location'" :draft="draftStore.draft" />
      <DynamicCategoryFieldsStep v-else-if="currentStep?.id === 'category-features'" :draft="draftStore.draft" />
      <AmenitiesFacilitiesStep v-else-if="currentStep?.id === 'amenities-facilities'" :draft="draftStore.draft" />
      <MediaStep v-else-if="currentStep?.id === 'media'" :draft="draftStore.draft" />
      <PricingStep v-else-if="currentStep?.id === 'pricing'" :draft="draftStore.draft" />
      <WorkingHoursStep v-else-if="currentStep?.id === 'working-hours'" :draft="draftStore.draft" />
      <ContactsStep v-else-if="currentStep?.id === 'contacts'" :draft="draftStore.draft" />
      <VenuePreviewStep v-else-if="currentStep?.id === 'preview'" :draft="draftStore.draft" />
      <SubmitForModerationStep v-else-if="currentStep?.id === 'submit'" :draft="draftStore.draft" />
      <section v-else class="owner-editor-step">
        <span>{{ currentStepIndex + 1 }}</span>
        <h3>{{ currentStep ? t(currentStep.labelKey) : '' }}</h3>
        <p>{{ currentStep ? t(currentStep.descriptionKey) : '' }}</p>
      </section>
    </template>
  </VenueEditorShell>
</template>

<style scoped>
.owner-editor-loading { display: grid; gap: var(--space-4); }
.owner-editor-save-error { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); margin-bottom: var(--space-4); padding: var(--space-3); border: 1px solid var(--color-danger); border-radius: var(--radius-lg); background: var(--color-danger-soft); }
.owner-editor-save-error p { margin: 0; color: var(--color-danger); font-size: var(--font-size-sm); }
.owner-editor-step { min-height: 260px; display: grid; align-content: center; justify-items: center; gap: var(--space-3); padding: var(--space-5); border: 1px dashed var(--color-border-strong); border-radius: var(--radius-xl); text-align: center; }
.owner-editor-step > span { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; color: var(--color-primary); background: var(--color-primary-soft); font-weight: var(--font-weight-bold); }
.owner-editor-step h3, .owner-editor-step p { margin: 0; }
.owner-editor-step p { max-width: 34ch; color: var(--color-text-secondary); }
@media (max-width: 350px) { .owner-editor-save-error { align-items: stretch; flex-direction: column; } }
</style>
