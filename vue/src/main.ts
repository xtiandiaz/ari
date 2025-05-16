import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import hashRouter from './hash-router/plugin'
import GameView from './views/GameView.vue'

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
    }
  ]
})

app.mount('#app')
