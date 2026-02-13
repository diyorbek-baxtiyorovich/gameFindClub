import './assets/tailwind.css'
import { createApp } from 'vue'
import { createYmaps } from 'vue-yandex-maps'
import { createPinia } from 'pinia'
import router from './router'
import vuetify from '@/plugins/vuetify/index.js'

import App from './App.vue'

const app = createApp(App)

app.use(
  createYmaps({
    // apikey: import.meta.env.VITE_YANDEX_API_KEY,
    apikey: '28f11ff1-886e-42da-abcf-298defe6575b',
  }),
)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
