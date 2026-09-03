<script setup lang="ts">
defineProps<{ modelValue: string; busy?: readonly string[] }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
const slots = ['10:00', '12:00', '14:00', '16:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
</script>
<template>
  <div class="slots" role="radiogroup" aria-label="Boshlanish vaqti">
    <button v-for="slot in slots" :key="slot" type="button" role="radio" :aria-checked="modelValue === slot" :disabled="busy?.includes(slot)" :class="{ selected: modelValue === slot, busy: busy?.includes(slot) }" @click="$emit('update:modelValue', slot)">{{ slot }}<small v-if="busy?.includes(slot)">band</small></button>
  </div>
</template>
<style scoped>
.slots { display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:var(--space-2) }.slots button { min-height:52px;display:grid;place-items:center;padding:6px;border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-text-primary);background:var(--color-surface-muted);cursor:pointer }.slots button.selected { border-color:var(--color-primary);background:var(--color-primary-soft);box-shadow:0 0 0 1px var(--color-primary),0 0 18px rgb(139 92 246 / 18%) }.slots button.busy { color:var(--color-text-secondary);text-decoration:line-through;opacity:.5;cursor:not-allowed }.slots small { font-size:9px;text-decoration:none } @media(max-width:420px){.slots{grid-template-columns:repeat(4,minmax(0,1fr))}}
</style>
