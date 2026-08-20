<script setup lang="ts">
withDefaults(defineProps<{ width?: string; height?: string; radius?: string; label?: string }>(), { width: '100%', height: '1rem', radius: 'var(--radius-sm)', label: 'Loading content' })
</script>

<template><span class="app-skeleton" role="status" :aria-label="label" :style="{ width, height, borderRadius: radius }" /></template>

<style scoped>
.app-skeleton { display: block; overflow: hidden; background: var(--color-surface-muted); }
.app-skeleton::after { content: ''; display: block; width: 100%; height: 100%; transform: translateX(-100%); background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-text-primary) 8%, transparent), transparent); animation: shimmer 1.4s infinite; }
@keyframes shimmer { to { transform: translateX(100%); } }
</style>
