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
    apikey: import.meta.env.VITE_YANDEX_API_KEY,
    // apikey: 'DSADSADASD',
  }),
)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
