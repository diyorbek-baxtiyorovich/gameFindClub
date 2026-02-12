<template>
  <v-container fluid class="details-wrapper">
    <v-card class="section-card">
      <div class="section-title">
        <v-icon color="purple">mdi-information</v-icon>
        <span>About</span>
      </div>

      <p class="about-text">
        {{ about }}
      </p>
    </v-card>

    <v-card class="section-card">
      <div class="section-title">
        <v-icon color="purple">mdi-desktop-classic</v-icon>
        <span>Hardware Specs</span>
      </div>

      <v-row dense>
        <v-col cols="6" v-for="item in hardware" :key="item.label">
          <div class="spec-box">
            <v-icon color="purple" size="20">
              {{ item.icon }}
            </v-icon>

            <div>
              <small>{{ item.label }}</small>
              <p>{{ item.value }}</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="section-card">
      <div class="section-title">
        <v-icon color="purple">mdi-gamepad-variant</v-icon>
        <span>Popular Games</span>
      </div>

      <div class="games-row">
        <div v-for="(game, i) in games" :key="i" class="game-box">
          <img v-if="game.image" :src="game.image" />

          <v-icon v-else size="36" color="grey"> mdi-image </v-icon>
        </div>
      </div>
    </v-card>

    <v-card class="section-card">
      <div class="section-title">
        <v-icon color="purple">mdi-currency-usd</v-icon>
        <span>Pricing</span>
      </div>

      <div
        v-for="price in pricing"
        :key="price.name"
        class="price-item"
        :class="{ active: price.vip }"
      >
        <div class="price-left">
          <v-icon color="purple">
            {{ price.icon }}
          </v-icon>

          <div>
            <h4>{{ price.name }}</h4>
            <small>{{ price.desc }}</small>
          </div>
        </div>

        <div class="price-right">
          ${{ price.price }}
          <small>/hour</small>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
const about =
  'The most advanced eSports hub in the city. Featuring 50+ high-end gaming PCs, professional streaming rooms, and VR stations.'

const hardware = [
  {
    label: 'Processor',
    value: 'Core i9-14900K',
    icon: 'mdi-cpu-64-bit',
  },
  {
    label: 'Graphics',
    value: 'RTX 4090 24GB',
    icon: 'mdi-expansion-card',
  },
  {
    label: 'Display',
    value: '360Hz ROG OLED',
    icon: 'mdi-monitor',
  },
  {
    label: 'Peripherals',
    value: 'Razer Pro Line',
    icon: 'mdi-keyboard',
  },
]

const games = [{ image: '' }, { image: '' }, { image: '' }, { image: '' }, { image: '' }]

const pricing = [
  {
    name: 'Standard Zone',
    desc: '30-60 FPS Gaming',
    price: 2.5,
    icon: 'mdi-account',
    vip: false,
  },
  {
    name: 'VIP Pro Room',
    desc: 'RTX 4090 / 360Hz',
    price: 4.5,
    icon: 'mdi-crown',
    vip: true,
  },
  {
    name: 'Bootcamp 5v5',
    desc: 'Full Team Room',
    price: 18,
    icon: 'mdi-account-group',
    vip: false,
  },
]
</script>

<style scoped>
.details-wrapper {
  padding: 16px 12px 40px;
}

.section-card {
  background: linear-gradient(135deg, #1a1f2a, #141821);

  border-radius: 18px;

  padding: 16px;

  margin-bottom: 18px;

  border: 1px solid rgba(255, 255, 255, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 15px;
  font-weight: 600;

  margin-bottom: 10px;
}

.section-title span {
  color: #ededef;
}

.about-text {
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.85;
  color: #94a3b8;
}

.spec-box {
  background: rgba(255, 255, 255, 0.04);

  border-radius: 12px;

  padding: 10px;

  display: flex;
  gap: 10px;

  align-items: center;
}

.spec-box small {
  opacity: 0.6;
  font-size: 11px;
  color: #94a3b8;
}

.spec-box p {
  font-size: 13px;
  font-weight: 500;
  color: #ededef;
}

.games-row {
  display: flex;
  gap: 12px;

  overflow-x: auto;
}

.game-box {
  min-width: 70px;
  height: 70px;

  background: rgba(255, 255, 255, 0.06);

  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.game-box img {
  width: 100%;
  height: 100%;

  object-fit: cover;
  border-radius: 12px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: rgba(255, 255, 255, 0.04);

  border-radius: 14px;

  padding: 12px;

  margin-top: 10px;
}

.price-item.active {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(124, 58, 237, 0.05));
}

.price-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.price-left h4 {
  font-size: 14px;
  color: #ededef;
}

.price-left small {
  opacity: 0.6;
  color: #ededef;
}

.price-right {
  color: #a78bfa;
  font-weight: 600;
}
</style>
