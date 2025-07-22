import { createVuetyRouter } from '@vueties/router/vuety-router'
import GameView from './views/GameView.vue'
import DailySummaryView from './views/DailySummaryView.vue'
import SettingsView from './views/SettingsView.vue'

export default createVuetyRouter([
  {
    path: '/',
    components: {
      main: GameView
    },
    children: [
      {
        path: 'daily-summary',
        components: {
          modal: DailySummaryView
        }
      },
      { 
        path: 'settings', 
        components: {
          modal: SettingsView
        }
      },
    ]
  },
])
