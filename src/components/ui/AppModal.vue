<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import AppLucideIcon from './AppLucideIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    closeLabel?: string
    closeOnBackdrop?: boolean
    placement?: 'center' | 'bottom'
  }>(),
  { closeLabel: 'Close', closeOnBackdrop: true, placement: 'center' },
)
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; close: [] }>()
const titleId = useId()
const closeButton = ref<HTMLButtonElement>()
let previousFocus: HTMLElement | null = null

function close(): void {
  emit('update:modelValue', false)
  emit('close')
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') close()
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      closeButton.value?.focus()
    } else {
      document.body.style.removeProperty('overflow')
      document.removeEventListener('keydown', onKeydown)
      previousFocus?.focus()
    }
  },
)

onBeforeUnmount(() => {
  document.body.style.removeProperty('overflow')
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="app-modal">
      <div v-if="modelValue" class="app-modal" :class="`app-modal--${placement}`" @mousedown.self="closeOnBackdrop && close()">
        <section
          class="app-modal__panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <header class="app-modal__header">
            <h2 :id="titleId">{{ title }}</h2>
            <button
              ref="closeButton"
              type="button"
              class="app-modal__close"
              :aria-label="closeLabel"
              @click="close"
            >
              <AppLucideIcon name="x" />
            </button>
          </header>
          <div class="app-modal__body"><slot /></div>
          <footer v-if="$slots.footer" class="app-modal__footer"><slot name="footer" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.app-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: calc(var(--space-4) + var(--safe-area-top)) calc(var(--space-4) + var(--safe-area-right))
    calc(var(--space-4) + var(--safe-area-bottom)) calc(var(--space-4) + var(--safe-area-left));
  background: var(--color-overlay);
}
.app-modal__panel {
  width: min(100%, 440px);
  max-height: min(80vh, 640px);
  max-height: min(80dvh, 640px);
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  color: var(--color-text-primary);
  background: var(--color-surface-raised);
  box-shadow: var(--elevation-2);
}
.app-modal--bottom { align-items: end; padding-bottom: 0; }
.app-modal--bottom .app-modal__panel { width: min(100%, var(--content-max-width)); max-height: min(88dvh, 720px); border-radius: var(--radius-xl) var(--radius-xl) 0 0; border-bottom: 0; }
.app-modal__header {
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
h2 {
  margin: 0;
  font-size: var(--font-size-lg);
}
.app-modal__close {
  width: var(--touch-target-min);
  height: var(--touch-target-min);
  border: 0;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  background: transparent;
  cursor: pointer;
  font-size: 1.5rem;
}
.app-modal__body,
.app-modal__footer {
  padding: var(--space-4);
}
@media (max-width: 350px) { .app-modal { padding-inline: calc(var(--space-2) + var(--safe-area-left)) calc(var(--space-2) + var(--safe-area-right)); } .app-modal__footer { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.app-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  border-top: 1px solid var(--color-border);
}
.app-modal-enter-active,
.app-modal-leave-active {
  transition: opacity var(--motion-normal);
}
.app-modal-enter-from,
.app-modal-leave-to {
  opacity: 0;
}
</style>
