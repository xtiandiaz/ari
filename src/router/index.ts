import { createRouter, createWebHashHistory } from "vue-router"
import GameView from '../views/GameView.vue'
import DailySummaryView from '../views/DailySummaryView.vue'
import SettingsView from '../views/SettingsView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
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
            title: "Today's Scores"
          }
        },
        { 
          path: 'settings', 
          components: {
            modal: SettingsView
          },
          meta: {
            title: "Settings"
          }
        },
      ]
    },
  ]
})
