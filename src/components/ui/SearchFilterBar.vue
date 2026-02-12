<template>
  <div class="search-wrapper">
    <div class="search-row">
      <div class="search-box">
        <v-icon size="22" color="#9ca3af"> mdi-magnify </v-icon>

        <input
          v-model="search"
          type="text"
          placeholder="Search clubs, arenas..."
          class="search-input"
        />
      </div>

      <v-btn icon variant="flat" class="filter-btn" @click="$emit('openFilter')">
        <v-icon color="#6D28D9">mdi-tune-vertical-variant</v-icon>
      </v-btn>
    </div>

    <div class="filter-row">
      <button
        v-for="item in filters"
        :key="item.key"
        class="filter-chip"
        :class="{ active: activeFilter === item.key }"
        @click="setFilter(item.key)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['search', 'filter', 'openFilter'])

const search = ref('')
const activeFilter = ref('all')

const filters = [
  { key: 'all', label: 'All Venues' },
  { key: 'open', label: 'Open Now' },
  { key: 'top', label: 'Top Rated' },
  { key: 'near', label: 'Near Me' },
  { key: 'near', label: 'Near Me' },
  { key: 'near', label: 'Near Me' },
  { key: 'near', label: 'Near Me' },
]

const setFilter = (key) => {
  activeFilter.value = key
  emit('filter', key)
}

watch(search, (val) => {
  emit('search', val)
})
</script>

<style scoped>
.search-wrapper {
  padding: 18px;

  background: transparent;
  backdrop-filter: blur(8px);

  border-radius: 24px;
}

.search-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-box {
  flex: 1;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 14px 18px;

  background: rgba(255, 255, 255, 0.06);

  border-radius: 18px;

  border: 1px solid rgba(255, 255, 255, 0.12);
}

.search-input {
  flex: 1;

  background: transparent;
  border: none;
  outline: none;

  color: #f3f4f6;
  font-size: 14px;
}

.search-input::placeholder {
  color: #9ca3af;
}

.filter-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;

  background: #2d3441 !important;

  border: 1px solid rgba(255, 255, 255, 0.08);
}

.filter-row {
  display: flex;
  gap: 10px;

  margin-top: 14px;

  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-chip {
  padding: 9px 18px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.05);

  border: 1px solid rgba(255, 255, 255, 0.1);

  color: #e5e7eb;
  font-size: 13px;

  white-space: nowrap;
  cursor: pointer;

  transition: all 0.2s ease;
}

.filter-chip.active {
  background: linear-gradient(135deg, #7c3aed, #9333ea);
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.5);
}

.filter-chip:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-chip.active {
  background: linear-gradient(135deg, #7c3aed, #9333ea);

  border-color: transparent;

  color: #fff;

  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}
</style>
