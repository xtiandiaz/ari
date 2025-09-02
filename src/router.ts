import { createRouter, createWebHashHistory } from 'vue-router'
import GameView from './views/GameView.vue'
import DailyRecordsView from './views/DailyRecordsView.vue'
import SettingsView from './views/SettingsView.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: GameView
      },
      children: [
        {
          path: 'daily-records',
          components: {
            modal: DailyRecordsView
          }
        },
        { 
          path: 'settings', 
          components: {
            modal: SettingsView
          }
        },
      ]
    }
  ],
})
