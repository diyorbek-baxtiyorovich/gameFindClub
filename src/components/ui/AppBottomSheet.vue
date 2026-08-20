<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import AppLucideIcon from './AppLucideIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    closeLabel?: string
    closeOnBackdrop?: boolean
  }>(),
  { closeLabel: 'Close', closeOnBackdrop: true },
)
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; close: [] }>()
const titleId = useId()
const closeButton = ref<HTMLButtonElement>()
const panel = ref<HTMLElement>()
let previousFocus: HTMLElement | null = null

function close(): void {
  emit('update:modelValue', false)
  emit('close')
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') close()
  if (event.key !== 'Tab' || !panel.value) return
  const focusable = [...panel.value.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable.at(-1)
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
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
    <Transition name="app-sheet">
      <div v-if="modelValue" class="app-sheet" @mousedown.self="closeOnBackdrop && close()">
        <section
          ref="panel"
          class="app-sheet__panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <div class="app-sheet__handle" aria-hidden="true" />
          <header class="app-sheet__header">
            <h2 :id="titleId">{{ title }}</h2>
            <button
              ref="closeButton"
              type="button"
              class="app-sheet__close"
              :aria-label="closeLabel"
              @click="close"
            >
              <AppLucideIcon name="x" />
            </button>
          </header>
          <div class="app-sheet__body"><slot /></div>
          <footer v-if="$slots.footer" class="app-sheet__footer"><slot name="footer" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.app-sheet {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  background: var(--color-overlay);
}
.app-sheet__panel {
  width: 100%;
  max-height: calc(92vh - var(--safe-area-top));
  max-height: calc(92dvh - var(--safe-area-top));
  overflow: auto;
  padding-bottom: var(--safe-area-bottom);
  border: 1px solid var(--color-border);
  border-bottom: 0;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  color: var(--color-text-primary);
  background: var(--color-surface-raised);
  box-shadow: var(--elevation-2);
}
.app-sheet__handle {
  width: 40px;
  height: 4px;
  margin: var(--space-2) auto 0;
  border-radius: var(--radius-pill);
  background: var(--color-border-strong);
}
.app-sheet__header {
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
h2 {
  margin: 0;
  font-size: var(--font-size-lg);
}
.app-sheet__close {
  width: var(--touch-target-min);
  height: var(--touch-target-min);
  border: 0;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  background: transparent;
  cursor: pointer;
  font-size: 1.5rem;
}
.app-sheet__body,
.app-sheet__footer {
  padding: var(--space-4);
}
.app-sheet__footer {
  position: sticky;
  bottom: 0;
  padding-bottom: calc(var(--space-4) + var(--safe-area-bottom));
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-raised);
}
.app-sheet-enter-active,
.app-sheet-leave-active {
  transition: opacity var(--motion-normal);
}
.app-sheet-enter-active .app-sheet__panel,
.app-sheet-leave-active .app-sheet__panel {
  transition: transform var(--motion-normal) var(--ease-standard);
}
.app-sheet-enter-from,
.app-sheet-leave-to {
  opacity: 0;
}
.app-sheet-enter-from .app-sheet__panel,
.app-sheet-leave-to .app-sheet__panel {
  transform: translateY(100%);
}
@media (min-width: 520px) {
  .app-sheet__panel {
    max-width: var(--content-max-width);
    margin-inline: auto;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }
}
</style>
