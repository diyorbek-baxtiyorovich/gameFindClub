<script setup lang="ts">
import AppBottomSheet from '@/components/ui/AppBottomSheet.vue'
import AppRadio from '@/components/ui/AppRadio.vue'
import { useSortStore } from './sort.store'
import { SORT_OPTIONS } from './sort'
import type { VenueSort } from './sort'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
const sort = useSortStore()
</script>
<template>
  <AppBottomSheet
    :model-value="modelValue"
    title="Sort venues"
    @update:model-value="$emit('update:modelValue', $event)"
    ><div class="sort-sheet">
      <AppRadio
        v-for="option in SORT_OPTIONS"
        :key="option.value"
        :model-value="sort.selected"
        :value="option.value"
        name="venue-sort"
        :label="option.label"
        @update:model-value="sort.selected = $event as VenueSort"
      /></div
  ></AppBottomSheet>
</template>
<style scoped>
.sort-sheet {
  display: grid;
}
</style>
