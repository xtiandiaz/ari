<script setup lang="ts">
import { computed } from 'vue'
import scoreStore from '@/stores/scores'
import HashRouterScene from '@vueties/plugins/hash-router/scenes/VuetyHashRouterScene.vue'
import { type VuetyNavigationBarVM } from '@vueties/components/bars/view-models'
import { Icon } from '@design-tokens/iconography'

const score = scoreStore()

const navigationBarVM = computed<VuetyNavigationBarVM>(() => {
  return {
    isVisible: true,
    leftBarItems: [
      { icon: Icon.Gear, isEnabled: true, routeKey: 'settings' }
    ],
    rightBarItems: [
      { icon: Icon.BarChart, isEnabled: score.hasAnyDailyScore, routeKey: 'daily-summary' }
    ]
  }
})
</script>

<template>
  <HashRouterScene 
    :navigationBarVM="navigationBarVM"
  />
</template>
