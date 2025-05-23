import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import hashRouter from './hash-router/plugin'
import { HashRoutePresentationStyle } from './hash-router/models'
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
      presentationStyle: HashRoutePresentationStyle.Modal
    },
    {
      key: 'settings',
      view: SettingsView,
      presentationStyle: HashRoutePresentationStyle.Modal
    }
  ]
})

app.mount('#app')
