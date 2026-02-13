<template>
  <v-dialog v-model="props.modelValue" fullscreen transition="dialog-bottom-transition">
    <v-card class="filter-page">
      <div class="filter-header">
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <span class="title"> Filters </span>

        <v-btn variant="text" class="reset-btn" @click="reset"> Reset </v-btn>
      </div>

      <v-container class="filter-body">
        <div class="block">
          <h4>Distance</h4>

          <div class="chips">
            <v-chip
              v-for="d in distances"
              :key="d"
              :color="filters.distance === d ? 'purple' : ''"
              variant="outlined"
              @click="filters.distance = d"
            >
              {{ d }} km
            </v-chip>
          </div>
        </div>

        <div class="block">
          <h4>Rating</h4>

          <v-checkbox v-model="filters.rating" label="4+ Stars" color="purple" />
        </div>

        <div class="block">
          <h4>Games</h4>

          <div class="chips">
            <v-chip
              v-for="g in games"
              :key="g"
              :color="filters.games.includes(g) ? 'purple' : ''"
              variant="outlined"
              @click="toggle(filters.games, g)"
            >
              {{ g }}
            </v-chip>
          </div>
        </div>

        <div class="block">
          <h4>Hardware</h4>

          <div class="chips">
            <v-chip
              v-for="h in hardware"
              :key="h"
              :color="filters.hardware.includes(h) ? 'purple' : ''"
              variant="outlined"
              @click="toggle(filters.hardware, h)"
            >
              {{ h }}
            </v-chip>
          </div>
        </div>

        <div class="block">
          <h4>Room Types</h4>

          <div class="chips">
            <v-chip
              v-for="r in rooms"
              :key="r"
              :color="filters.rooms.includes(r) ? 'purple' : ''"
              variant="outlined"
              @click="toggle(filters.rooms, r)"
            >
              {{ r }}
            </v-chip>
          </div>
        </div>

        <div class="block">
          <h4>Narx / Soat</h4>

          <v-range-slider
            v-model="filters.price"
            :min="20"
            :max="500"
            step="1"
            color="purple"
            thumb-label
          />

          <div class="price-info">{{ filters.price[0] }} ming — {{ filters.price[1] }} ming</div>
        </div>
      </v-container>

      <div class="filter-footer">
        <v-btn block size="large" color="purple" class="apply-btn" @click="apply">
          Apply Filters
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'apply'])

const distances = [1, 5, 10, 20]

const games = ['CS2', 'Dota2', 'Valorant', 'GTA V', 'PUBG', 'FIFA']

const hardware = ['144Hz+', 'RTX 3060+', '16GB RAM+']

const rooms = ['VIP', '5x5', 'Streaming', 'Tournament']

const filters = reactive({
  distance: null,
  rating: false,
  games: [],
  hardware: [],
  rooms: [],
  price: [20, 500],
})

const toggle = (arr, val) => {
  const i = arr.indexOf(val)

  if (i === -1) arr.push(val)
  else arr.splice(i, 1)
}

const close = () => {
  emit('update:modelValue', false)
}

const reset = () => {
  filters.distance = null
  filters.rating = false
  filters.games = []
  filters.hardware = []
  filters.rooms = []
  filters.price = [20, 500]
}

const apply = () => {
  emit('apply', { ...filters })
  reset()
  close()
}
</script>

<style scoped>
.filter-page {
  background: #0f131a;
  color: white;
}

.filter-header {
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 16px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.title {
  font-size: 16px;
  font-weight: 600;
}

.reset-btn {
  color: #a78bfa;
}

.filter-body {
  padding: 16px;
}

.block {
  margin-bottom: 26px;
}

.block h4 {
  font-size: 15px;
  margin-bottom: 10px;
  color: #e5e7eb;
}

.chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.price-info {
  text-align: right;
  font-size: 13px;
  opacity: 0.7;
}

.filter-footer {
  padding: 16px;

  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.apply-btn {
  border-radius: 16px;
  font-weight: 600;
}
</style>
