<script setup lang="ts">
import AppChip from '@/components/ui/AppChip.vue'
defineProps<{ label: string }>()
defineEmits<{ remove: [] }>()
</script>
<template><AppChip :interactive="false" removable @remove="$emit('remove')">{{ label }}</AppChip></template>
