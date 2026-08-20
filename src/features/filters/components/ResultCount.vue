<script setup lang="ts">
defineProps<{ count?: number; loading?: boolean }>()
</script>
<template><p class="result-count" role="status">{{ loading ? 'Natijalar yangilanmoqda…' : count == null ? 'Natijalar' : `${count.toLocaleString()} ta joy topildi` }}</p></template>
<style scoped>.result-count { margin: var(--space-2) 0 0; color: var(--color-text-primary); font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); letter-spacing: -0.02em; }</style>
