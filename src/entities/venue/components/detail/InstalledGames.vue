<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ games: readonly string[] }>()
const expanded = ref(false)
</script>
<template><section v-if="games.length" class="games"><header><h2>O‘rnatilgan o‘yinlar</h2><button v-if="games.length>6" type="button" @click="expanded=!expanded">{{ expanded?'Kamroq':'Barchasini ko‘rish' }}</button></header><div class="games__grid"><span v-for="game in expanded?games:games.slice(0,6)" :key="game">{{ game }}</span></div></section></template>
<style scoped>.games{display:grid;gap:var(--space-4)}.games header{display:flex;align-items:center;justify-content:space-between;gap:var(--space-3)}.games h2{margin:0}.games button{min-height:44px;border:0;color:var(--color-primary);background:transparent;font-weight:var(--font-weight-semibold)}.games__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:var(--space-2)}.games__grid span{min-height:52px;display:flex;align-items:center;padding:var(--space-3);border:1px solid var(--color-border);border-radius:var(--radius-md);background:var(--color-surface);font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold)}</style>
