import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'

// Labs
import { VDateInput } from 'vuetify/labs/VDateInput'

import defaults from './defaults'
import { icons } from './icons'
import themes from './theme'

import 'vuetify/styles'

const vuetify = createVuetify({
  components: {
    ...components,
    VDateInput,
  },
  directives,
  defaults,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'light',
    themes,
  },
})

export default vuetify
