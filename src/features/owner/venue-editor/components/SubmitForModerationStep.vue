<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import {
  draftToCreateInput,
  draftToUpdateInput,
} from '@/features/owner/venue-editor/draft-venue-adapter'
import {
  validateVenueSubmission,
  type SubmissionIssue,
} from '@/features/owner/venue-editor/submission-validation'
import type { VenueEditorDraft } from '@/features/owner/venue-editor'
import { t } from '@/i18n'
import { useOwnerVenueDraftStore, useOwnerVenuesStore } from '@/stores'

const props = defineProps<{ draft: VenueEditorDraft }>()
const router = useRouter()
const drafts = useOwnerVenueDraftStore()
const venues = useOwnerVenuesStore()
const confirmOpen = ref(false)
const submitting = ref(false)
const localError = ref<string | null>(null)
const issues = computed(() => validateVenueSubmission(props.draft))
const issueLabel = (issue: SubmissionIssue) => t(`owner.editor.submit.issue.${issue}`)
const sourceCannotSubmit = computed(
  () => props.draft.mode === 'edit' && venues.selected?.status !== 'draft',
)

async function submit(): Promise<void> {
  if (issues.value.length || sourceCannotSubmit.value) return
  submitting.value = true
  localError.value = null
  try {
    await drafts.flush()
    const saved =
      props.draft.mode === 'create'
        ? await venues.create(draftToCreateInput(props.draft))
        : await venues.update(props.draft.sourceVenueId!, draftToUpdateInput(props.draft))
    if (!saved) throw new Error(venues.error || t('owner.editor.submit.failed'))
    const submitted = await venues.submitForReview(saved.id)
    if (!submitted) throw new Error(venues.error || t('owner.editor.submit.failed'))
    confirmOpen.value = false
    await drafts.discard()
    await router.push({ name: 'owner-venues' })
  } catch (caught) {
    localError.value = caught instanceof Error ? caught.message : t('owner.editor.submit.failed')
  } finally {
    submitting.value = false
  }
}
</script>
<template>
  <section class="submit-step">
    <span class="submit-step__ready"><AppLucideIcon name="check" :size="28" /></span>
    <header>
      <h3>{{ t('owner.editor.submit.ready_title') }}</h3>
      <p>{{ t('owner.editor.submit.description') }}</p>
    </header>
    <div v-if="issues.length" class="submit-step__issues">
      <strong>{{ t('owner.editor.submit.fix_first') }}</strong>
      <ul>
        <li v-for="issue in issues" :key="issue">{{ issueLabel(issue) }}</li>
      </ul>
    </div>
    <p v-if="sourceCannotSubmit" class="submit-step__error">
      {{ t('owner.editor.submit.draft_only') }}
    </p>
    <p v-if="localError" class="submit-step__error" role="alert">{{ localError }}</p>
    <AppButton
      full-width
      :disabled="Boolean(issues.length) || sourceCannotSubmit"
      @click="confirmOpen = true"
      >{{ t('owner.editor.submit.action') }}</AppButton
    ><AppModal
      v-model="confirmOpen"
      placement="bottom"
      :title="t('owner.editor.submit.confirm_title')"
      :close-label="t('common.close')"
      ><p>{{ t('owner.editor.submit.confirm_description') }}</p>
      <template #footer
        ><AppButton variant="secondary" @click="confirmOpen = false">{{
          t('owner.action.cancel')
        }}</AppButton
        ><AppButton :loading="submitting" @click="submit">{{
          t('owner.editor.submit.confirm')
        }}</AppButton></template
      ></AppModal
    >
  </section>
</template>
<style scoped>
.submit-step {
  display: grid;
  justify-items: stretch;
  gap: var(--space-4);
  padding-top: var(--space-4);
  text-align: center;
}
.submit-step__ready {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  justify-self: center;
  border-radius: 50%;
  color: var(--color-success);
  background: var(--color-success-soft);
}
header h3,
header p,
.submit-step p {
  margin: 0;
}
header p {
  margin-top: var(--space-2);
  color: var(--color-text-secondary);
}
.submit-step__issues {
  padding: var(--space-4);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-lg);
  background: var(--color-warning-soft);
  text-align: left;
}
.submit-step__issues ul {
  margin-bottom: 0;
  padding-left: var(--space-5);
}
.submit-step__error {
  color: var(--color-danger);
}
</style>
