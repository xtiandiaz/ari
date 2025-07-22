<script setup lang="ts">
import { computed } from 'vue'
import scoreStore from '@/stores/scores'
import { type VuetyNavigationBarVM } from '@vueties/components/bars/view-models'
import VuetyScene from '@vueties/scenes/VuetyScene.vue'
import { Icon } from '@design-tokens/iconography'

const score = scoreStore()

const navigationBarVM = computed<VuetyNavigationBarVM>(() => {
  return {
    leftBarItems: [
      { icon: Icon.Gear, path: '/settings' }
    ],
    rightBarItems: [
      { icon: Icon.BarChart, isEnabled: score.hasAnyDailyScore, path: '/daily-summary' }
    ]
  }
})
</script>

<template>
  <VuetyScene :navigationBarVM="navigationBarVM" />
</template>
