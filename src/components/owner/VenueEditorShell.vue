<script setup lang="ts">
import { computed } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import type { VenueEditorMode, VenueEditorStep } from '@/features/owner/venue-editor'
import { t } from '@/i18n'

const props = withDefaults(defineProps<{
  mode: VenueEditorMode
  steps: readonly VenueEditorStep[]
  currentStepIndex: number
  canGoNext?: boolean
  saveState?: 'idle' | 'saving' | 'saved' | 'error'
}>(), {
  canGoNext: true,
  saveState: 'idle',
})

defineEmits<{ back: []; next: [] }>()

const currentStep = computed(() => props.steps[props.currentStepIndex])
const progress = computed(() => props.steps.length
  ? `${((props.currentStepIndex + 1) / props.steps.length) * 100}%`
  : '0%')
</script>

<template>
  <section class="venue-editor-shell">
    <header class="venue-editor-shell__header">
      <div>
        <small>{{ mode === 'create' ? t('owner.editor.create') : t('owner.editor.edit') }}</small>
        <h2>{{ currentStep ? t(currentStep.labelKey) : t('owner.editor.title') }}</h2>
      </div>
      <slot name="save-state">
        <span class="venue-editor-shell__save" role="status">{{ t(`owner.editor.save.${saveState}` as 'owner.editor.save.idle' | 'owner.editor.save.saving' | 'owner.editor.save.saved' | 'owner.editor.save.error') }}</span>
      </slot>
    </header>

    <div class="venue-editor-shell__progress" :aria-label="t('owner.editor.progress', { current: currentStepIndex + 1, total: steps.length })">
      <span>{{ t('owner.editor.progress', { current: currentStepIndex + 1, total: steps.length }) }}</span>
      <div aria-hidden="true"><i :style="{ width: progress }" /></div>
    </div>

    <main class="venue-editor-shell__content"><slot :step="currentStep" /></main>

    <footer class="venue-editor-shell__actions">
      <slot name="actions">
        <AppButton variant="secondary" @click="$emit('back')">{{ t('owner.editor.back') }}</AppButton>
        <AppButton :disabled="!canGoNext || currentStepIndex >= steps.length - 1" @click="$emit('next')">{{ t('owner.editor.next') }}</AppButton>
      </slot>
    </footer>
  </section>
</template>

<style scoped>
.venue-editor-shell { min-height: calc(100dvh - var(--safe-area-top)); display: grid; grid-template-rows: auto auto minmax(0, 1fr) auto; margin: calc(var(--space-5) * -1) calc((var(--space-4) + var(--safe-area-right)) * -1) calc((var(--space-5) + var(--safe-area-bottom)) * -1) calc((var(--space-4) + var(--safe-area-left)) * -1); background: var(--color-bg); }
.venue-editor-shell__header { min-height: 68px; display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) calc(var(--space-4) + var(--safe-area-right)) var(--space-3) calc(var(--space-4) + var(--safe-area-left)); border-bottom: 1px solid var(--color-border); background: var(--color-surface); }
.venue-editor-shell__header div { min-width: 0; }
.venue-editor-shell__header small { color: var(--color-primary); font-weight: var(--font-weight-semibold); }
.venue-editor-shell__header h2 { margin: 2px 0 0; overflow: hidden; font-size: var(--font-size-lg); text-overflow: ellipsis; white-space: nowrap; }
.venue-editor-shell__save { flex: 0 0 auto; color: var(--color-text-secondary); font-size: var(--font-size-xs); }
.venue-editor-shell__progress { display: grid; gap: var(--space-2); padding: var(--space-3) calc(var(--space-4) + var(--safe-area-right)) var(--space-3) calc(var(--space-4) + var(--safe-area-left)); background: var(--color-surface); }
.venue-editor-shell__progress span { color: var(--color-text-secondary); font-size: var(--font-size-xs); }
.venue-editor-shell__progress div { height: 4px; overflow: hidden; border-radius: var(--radius-pill); background: var(--color-surface-muted); }
.venue-editor-shell__progress i { display: block; height: 100%; border-radius: inherit; background: var(--color-primary); transition: width var(--motion-normal) var(--ease-standard); }
.venue-editor-shell__content { min-width: 0; padding: var(--space-5) calc(var(--space-4) + var(--safe-area-right)) var(--space-8) calc(var(--space-4) + var(--safe-area-left)); }
.venue-editor-shell__actions { position: sticky; bottom: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); padding: var(--space-3) calc(var(--space-4) + var(--safe-area-right)) calc(var(--space-3) + var(--safe-area-bottom)) calc(var(--space-4) + var(--safe-area-left)); border-top: 1px solid var(--color-border); background: color-mix(in srgb, var(--color-surface) 97%, transparent); backdrop-filter: blur(12px); }
@media (max-width: 350px) { .venue-editor-shell__header { align-items: flex-start; } .venue-editor-shell__content { padding-top: var(--space-4); } .venue-editor-shell__actions { gap: var(--space-2); } }
</style>
