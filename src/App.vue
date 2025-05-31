<script setup lang="ts">
import { computed } from 'vue'
import scoreStore from '@/stores/scores'
import HashRouterScene from '@/hash-router/scenes/HashRouterScene.vue'
import { type NavigationBarVM } from '@vueties/view-models'
import { Icon } from '@design-tokens/iconography'

const score = scoreStore()

const navigationBarVM = computed<NavigationBarVM>(() => {
  return {
    isVisible: true,
    leftBarItems: [
      { icon: Icon.Gear, isEnabled: true, routeKey: 'settings' }
    ],
    rightBarItems: [
      { icon: Icon.Stats, isEnabled: score.dailyTotalOperatorsScore > 0, routeKey: 'daily-summary' }
    ]
  }
})
</script>

<template>
  <HashRouterScene 
    :navigationBarVM="navigationBarVM"
  />
</template>
