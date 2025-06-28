<script setup lang="ts">
import { computed } from 'vue'
import scoreStore from '@/stores/scores'
import { Icon } from '@design-tokens/iconography'
import { type VuetyNavigationBarVM } from '@vueties/components/bars/view-models'
import VuetyNavigationBar from './vueties/components/bars/VuetyNavigationBar.vue'

const score = scoreStore()

const navigationBarVM = computed<VuetyNavigationBarVM>(() => {
  return {
    isVisible: true,
    leftBarItems: [
      { icon: Icon.Gear, isEnabled: true, path: '/settings' }
    ],
    rightBarItems: [
      { icon: Icon.BarChart, isEnabled: score.hasAnyDailyScore, path: '/daily-summary' }
    ]
  }
})
</script>

<template>
  <VuetyNavigationBar :viewModel="navigationBarVM" />
  
  <RouterView />
</template>
