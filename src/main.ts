import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import hashRouter from '@vueties/plugins/hash-router/plugin'
import { VuetyHashRoutePresentationStyle } from '@vueties/plugins/hash-router/models'
import GameView from './views/GameView.vue'
import DailySummaryView from './views/DailySummaryView.vue'
import SettingsView from './views/SettingsView.vue'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

app.use(hashRouter, {
  rootRouteKey: 'game',
  routes: [
    {
      key: 'game',
      view: GameView,
      path: '/',
    },
    {
      key: 'daily-summary',
      view: DailySummaryView,
      presentationStyle: VuetyHashRoutePresentationStyle.Modal
    },
    {
      key: 'settings',
      view: SettingsView,
      presentationStyle: VuetyHashRoutePresentationStyle.Modal
    }
  ]
})

app.mount('#app')
