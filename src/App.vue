<script setup lang="ts">
import { computed } from 'vue'
import useRecordsStore from '@/stores/records'
import { type VuetyNavigationBarVM } from '@vueties/components/bars/view-models'
import VuetyScene from '@vueties/scenes/VuetyScene.vue'
import { Icon } from '@design-tokens/iconography'

const records = useRecordsStore()

const navigationBarVM = computed<VuetyNavigationBarVM>(() => {
  return {
    leftBarItems: [
      { icon: Icon.Gear, path: '/settings' }
    ],
    rightBarItems: [
      { 
        icon: Icon.BarChart, 
        isEnabled: records.hasAnyDailyScore, 
        path: '/daily-records'
      }
    ]
  }
})
</script>

<template>
  <VuetyScene :navigationBarVM="navigationBarVM" />
</template>
