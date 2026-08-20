<script setup lang="ts">
import AppLucideIcon from './AppLucideIcon.vue'
const props = withDefaults(
  defineProps<{
    selected?: boolean
    disabled?: boolean
    removable?: boolean
    interactive?: boolean
  }>(),
  { selected: false, disabled: false, removable: false, interactive: true },
)

const emit = defineEmits<{
  'update:selected': [value: boolean]
  click: [event: MouseEvent]
  remove: []
}>()

function select(event: MouseEvent): void {
  if (props.disabled) return
  emit('click', event)
  emit('update:selected', !props.selected)
}
</script>

<template>
  <span
    class="app-chip"
    :class="{ 'app-chip--selected': selected, 'app-chip--disabled': disabled }"
  >
    <button
      v-if="interactive"
      type="button"
      class="app-chip__main"
      :aria-pressed="selected"
      :disabled="disabled"
      @click="select"
    >
      <slot />
    </button>
    <span v-else class="app-chip__main"><slot /></span>
    <button
      v-if="removable"
      type="button"
      class="app-chip__remove"
      :disabled="disabled"
      aria-label="Remove"
      @click="$emit('remove')"
    >
      <AppLucideIcon name="x" :size="16" />
    </button>
  </span>
</template>

<style scoped>
.app-chip {
  min-height: var(--touch-target-min);
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text-primary);
  background: var(--color-surface);
  overflow: hidden;
}
.app-chip--selected {
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
  background: var(--color-primary);
}
.app-chip--disabled {
  opacity: 0.55;
}
.app-chip__main,
.app-chip__remove {
  min-height: var(--touch-target-min);
  border: 0;
  color: inherit;
  background: transparent;
}
.app-chip__main {
  padding: 0 var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
button.app-chip__main,
.app-chip__remove {
  cursor: pointer;
}
.app-chip__remove {
  width: var(--touch-target-min);
  padding: 0;
  font-size: 1.1rem;
}
</style>
