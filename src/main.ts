import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router/index'

import App from './App.vue'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
