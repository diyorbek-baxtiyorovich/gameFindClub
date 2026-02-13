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

    <v-card class="section-card">
      <div class="section-title">
        <v-icon color="purple">mdi-clock-outline</v-icon>
        <span>Working Hours</span>
      </div>

      <div class="hours-row" v-for="(item, i) in workingHours" :key="i">
        <span class="day">{{ item.day }}</span>
        <span class="time">{{ item.time }}</span>
      </div>
    </v-card>

    <v-card class="section-card">
      <div class="section-title">
        <v-icon color="purple">mdi-email-outline</v-icon>
        <span>Contact Info</span>
      </div>

      <div class="contact-item">
        <v-icon size="18" color="grey-lighten-1">mdi-map-marker-outline</v-icon>
        <div>
          <p>{{ contact.address }}</p>
          <small>{{ contact.sub }}</small>
        </div>
      </div>

      <div class="contact-item">
        <v-icon size="18" color="grey-lighten-1">mdi-phone-outline</v-icon>
        <p>{{ contact.phone }}</p>
      </div>
    </v-card>

    <v-card class="section-card">
      <div class="reviews-header">
        <div class="section-title">
          <v-icon color="purple">mdi-star-outline</v-icon>
          <span>User Reviews</span>
        </div>

        <span class="view-all">View All</span>
      </div>

      <div v-for="review in reviews" :key="review.name" class="review-item">
        <v-avatar size="40">
          <img :src="review.avatar" />
        </v-avatar>

        <div class="review-content">
          <div class="review-top">
            <strong>{{ review.name }}</strong>
            <small>{{ review.time }}</small>
          </div>

          <div class="stars">
            <v-icon
              v-for="n in 5"
              :key="n"
              size="16"
              :color="n <= review.rating ? 'yellow' : 'grey'"
            >
              mdi-star
            </v-icon>
          </div>

          <p>{{ review.text }}</p>
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

const workingHours = [
  { day: 'Monday - Friday', time: 'Open 24 Hours' },
  { day: 'Saturday - Sunday', time: 'Open 24 Hours' },
]

const contact = {
  address: 'Main Street 124, 2nd Floor',
  sub: 'Business District, NYC',
  phone: '+1 (555) 000-9988',
}

const reviews = [
  {
    name: 'Marcus Thorne',
    time: '2 days ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/100?img=1',
    text: 'Best gaming club in town! The equipment is top-notch.',
  },
  {
    name: 'Sarah Jenkins',
    time: '1 week ago',
    rating: 4,
    avatar: 'https://i.pravatar.cc/100?img=2',
    text: 'Great atmosphere for team practice. Worth it.',
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

.hours-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  color: #cbd5e1;
}

.day {
  opacity: 0.7;
}

.time {
  font-weight: 600;
}

.contact-item {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  align-items: flex-start;
}

.contact-item p {
  color: #ededef;
  margin: 0;
}

.contact-item small {
  color: #94a3b8;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-all {
  color: #a78bfa;
  font-size: 13px;
  cursor: pointer;
}

.review-item {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.review-content {
  flex: 1;
}

.review-top {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #ededef;
}

.review-top small {
  opacity: 0.6;
}

.stars {
  display: flex;
  gap: 2px;
  margin: 4px 0;
}

.review-content p {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}
</style>
