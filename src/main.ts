import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import Datepicker from 'vue3-persian-datetime-picker'


// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)
app.component('PersianDate', Datepicker)


// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
