import { ref, type Ref } from 'vue'
import { createRouter, createWebHashHistory } from "vue-router"
import GameView from './views/GameView.vue'
import DailySummaryView from './views/DailySummaryView.vue'
import SettingsView from './views/SettingsView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: Ref<string | undefined>
  }
}

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { 
      path: '/',
      component: GameView,
      children: [
        {
          path: 'daily-summary',
          components: {
            modal: DailySummaryView
          },
          meta: {
            title: ref("Today's Scores")
          }
        },
        { 
          path: 'settings', 
          components: {
            modal: SettingsView
          },
          meta: {
            title: ref("Settings")
          }
        },
      ]
    },
  ]
})
