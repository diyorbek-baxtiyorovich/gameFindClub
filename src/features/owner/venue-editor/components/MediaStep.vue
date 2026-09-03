<script setup lang="ts">
import { ref } from 'vue'

import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import type { VenueMedia } from '@/entities/venue'
import type { VenueEditorDraft } from '@/features/owner/venue-editor'
import { t } from '@/i18n'
import {
  ownerMediaSelectionService,
  type LocalMediaSelectionError,
} from '@/services/owner-media-selection'
import { useOwnerVenueDraftStore } from '@/stores'

const props = defineProps<{ draft: VenueEditorDraft }>()
const draftStore = useOwnerVenueDraftStore()
const fileInput = ref<HTMLInputElement>()
const errors = ref<readonly LocalMediaSelectionError[]>([])

function chooseFiles(): void {
  fileInput.value?.click()
}

function selectFiles(event: Event): void {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const result = ownerMediaSelectionService.select(input.files)
  errors.value = result.errors
  const media = [...props.draft.media, ...result.media].map((item, index) => ({
    ...item,
    sortOrder: index,
  }))
  draftStore.setMedia(media, props.draft.coverMedia ?? media[0])
  input.value = ''
}

function setCover(media: VenueMedia): void {
  draftStore.setMedia(props.draft.media, media)
}

function remove(media: VenueMedia): void {
  ownerMediaSelectionService.release(media.url)
  const items = props.draft.media
    .filter((item) => item.id !== media.id)
    .map((item, index) => ({ ...item, sortOrder: index }))
  const cover = props.draft.coverMedia?.id === media.id ? items[0] : props.draft.coverMedia
  draftStore.setMedia(items, cover)
}

function move(index: number, direction: -1 | 1): void {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= props.draft.media.length) return
  const items = [...props.draft.media]
  const current = items[index]
  const target = items[nextIndex]
  if (!current || !target) return
  items[index] = target
  items[nextIndex] = current
  draftStore.setMedia(
    items.map((item, itemIndex) => ({ ...item, sortOrder: itemIndex })),
    props.draft.coverMedia,
  )
}
</script>

<template>
  <div class="media-step">
    <input
      ref="fileInput"
      class="media-step__input"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      multiple
      @change="selectFiles"
    />
    <header>
      <h3>{{ t('owner.editor.media.title') }}</h3>
      <p>{{ t('owner.editor.media.description') }}</p>
    </header>
    <button class="media-step__picker" type="button" @click="chooseFiles">
      <span><AppLucideIcon name="image" :size="24" /></span>
      <strong>{{ t('owner.editor.media.choose') }}</strong>
      <small>{{ t('owner.editor.media.formats') }}</small>
    </button>
    <p class="media-step__notice">{{ t('owner.editor.media.local_notice') }}</p>
    <ul v-if="errors.length" class="media-step__errors" role="alert">
      <li v-for="error in errors" :key="`${error.fileName}-${error.code}`">
        {{ error.fileName }} —
        {{
          error.code === 'file-too-large'
            ? t('owner.editor.media.too_large')
            : t('owner.editor.media.unsupported')
        }}
      </li>
    </ul>

    <div v-if="draft.media.length" class="media-step__grid">
      <article v-for="(media, index) in draft.media" :key="media.id" class="media-step__item">
        <img :src="media.url" :alt="media.alt || t('owner.editor.media.preview')" />
        <span v-if="draft.coverMedia?.id === media.id">{{ t('owner.editor.media.cover') }}</span>
        <div>
          <button
            type="button"
            :disabled="draft.coverMedia?.id === media.id"
            @click="setCover(media)"
          >
            {{ t('owner.editor.media.make_cover') }}
          </button>
          <button
            type="button"
            :aria-label="t('owner.editor.media.move_up')"
            :disabled="index === 0"
            @click="move(index, -1)"
          >
            ↑
          </button>
          <button
            type="button"
            :aria-label="t('owner.editor.media.move_down')"
            :disabled="index === draft.media.length - 1"
            @click="move(index, 1)"
          >
            ↓
          </button>
          <button
            type="button"
            class="media-step__remove"
            :aria-label="t('owner.editor.media.remove')"
            @click="remove(media)"
          >
            <AppLucideIcon name="x" :size="17" />
          </button>
        </div>
      </article>
    </div>
    <p v-else class="media-step__empty">{{ t('owner.editor.media.empty') }}</p>
  </div>
</template>

<style scoped>
.media-step {
  display: grid;
  gap: var(--space-4);
}
.media-step__input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.media-step header h3,
.media-step header p {
  margin: 0;
}
.media-step header p {
  margin-top: var(--space-1);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.media-step__picker {
  min-height: 132px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-xl);
  color: var(--color-text);
  background: var(--color-surface-muted);
  cursor: pointer;
  font: inherit;
  text-align: center;
}
.media-step__picker span {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--color-primary);
  background: var(--color-primary-soft);
}
.media-step__picker small {
  color: var(--color-text-secondary);
}
.media-step__notice,
.media-step__empty {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.media-step__errors {
  margin: 0;
  padding-left: var(--space-5);
  color: var(--color-danger);
  font-size: var(--font-size-sm);
}
.media-step__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}
.media-step__item {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}
.media-step__item img {
  width: 100%;
  aspect-ratio: 4 / 3;
  display: block;
  object-fit: cover;
}
.media-step__item > span {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  padding: 2px var(--space-2);
  border-radius: var(--radius-pill);
  color: var(--color-text-inverse);
  background: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}
.media-step__item > div {
  display: flex;
  align-items: center;
  padding: var(--space-1);
}
.media-step__item button {
  min-width: 38px;
  min-height: var(--touch-target-min);
  border: 0;
  color: var(--color-primary);
  background: transparent;
  cursor: pointer;
  font-size: var(--font-size-xs);
}
.media-step__item button:first-child {
  flex: 1;
}
.media-step__item button:disabled {
  opacity: 0.45;
  cursor: default;
}
.media-step__item .media-step__remove {
  color: var(--color-danger);
}
@media (max-width: 350px) {
  .media-step__grid {
    grid-template-columns: 1fr;
  }
}
</style>
