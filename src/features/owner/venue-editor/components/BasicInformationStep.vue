<script setup lang="ts">
import { computed } from 'vue'

import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import { validateBasicInformation, type VenueEditorDraft } from '@/features/owner/venue-editor'
import { t } from '@/i18n'
import { useOwnerVenueDraftStore } from '@/stores'

const props = defineProps<{ draft: VenueEditorDraft }>()
const draftStore = useOwnerVenueDraftStore()

const errors = computed(() => validateBasicInformation(props.draft))
const nameError = computed(() => errors.value.name ? t(errors.value.name) : undefined)
const shortError = computed(() => errors.value.shortDescription ? t(errors.value.shortDescription) : undefined)
const descriptionError = computed(() => errors.value.description ? t(errors.value.description) : undefined)
</script>

<template>
  <div class="basic-information-step">
    <AppInput :model-value="draft.name" :label="t('owner.editor.basic.name')" :placeholder="t('owner.editor.basic.name_placeholder')" :hint="t('owner.editor.basic.name_hint')" :error="nameError" :maxlength="120" required @update:model-value="draftStore.setBasicInformation({ name: $event })" />
    <AppTextarea :model-value="draft.shortDescription" :label="t('owner.editor.basic.short_description')" :placeholder="t('owner.editor.basic.short_placeholder')" :hint="t('owner.editor.basic.short_hint', { count: draft.shortDescription.length })" :error="shortError" :maxlength="160" :rows="3" @update:model-value="draftStore.setBasicInformation({ shortDescription: $event })" />
    <AppTextarea :model-value="draft.description" :label="t('owner.editor.basic.description')" :placeholder="t('owner.editor.basic.description_placeholder')" :hint="t('owner.editor.basic.description_hint', { count: draft.description.length })" :error="descriptionError" :maxlength="2000" :rows="6" @update:model-value="draftStore.setBasicInformation({ description: $event })" />
  </div>
</template>

<style scoped>.basic-information-step { display: grid; gap: var(--space-5); }</style>
