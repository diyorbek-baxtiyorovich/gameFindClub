<script setup lang="ts">
withDefaults(defineProps<{ title: string; description?: string; actionLabel?: string }>(), {})
defineEmits<{ action: [] }>()
</script>

<template>
  <header class="section-header">
    <div><h2>{{ title }}</h2><p v-if="description">{{ description }}</p></div>
    <button v-if="actionLabel" type="button" @click="$emit('action')">{{ actionLabel }}</button>
  </header>
</template>

<style scoped>
.section-header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
h2, p { margin: 0; }
h2 { font-size: var(--font-size-xl); letter-spacing: -0.02em; }
p { margin-top: var(--space-1); color: var(--color-text-secondary); font-size: var(--font-size-sm); }
button { min-height: var(--touch-target-min); flex: 0 0 auto; padding: 0; border: 0; color: var(--color-primary); background: transparent; cursor: pointer; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }
</style>
