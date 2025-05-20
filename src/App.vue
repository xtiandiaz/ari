<script setup lang="ts">
import { computed } from 'vue'
import statsStore from '@/stores/stats'
import HashRouterScene from '@/hash-router/scenes/HashRouterScene.vue'
import { type NavigationBarVM } from '@vueties/view-models'
import { Icon } from '@design-tokens/iconography'

const stats = statsStore()

const navigationBarVM = computed<NavigationBarVM>(() => {
  return {
    isVisible: true,
    leftBarItems: [
      { icon: Icon.Gear, isEnabled: true, routeKey: 'settings' }
    ],
    rightBarItems: [
      { icon: Icon.Stats, isEnabled: stats.dailySolutionsTotal > 0, routeKey: 'daily-stats' }
    ]
  }
})
</script>

<template>
  <HashRouterScene 
    :navigationBarVM="navigationBarVM"
  />
</template>
