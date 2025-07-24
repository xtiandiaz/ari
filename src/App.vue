<script setup lang="ts">
import { computed } from 'vue'
import useRecordsStore from '@/stores/records'
import { type VuetyNavigationBarVM } from '@vueties/components/bars/view-models'
import VuetyScene from '@vueties/scenes/VuetyScene.vue'
import { Icon } from '@design-tokens/iconography'

const records = useRecordsStore()

const navigationBarVM = computed<VuetyNavigationBarVM>(() => {
  console.log("isTodayLevelNewRecord", records.isTodayLevelNewRecord)
  return {
    leftBarItems: [
      { icon: Icon.Gear, path: '/settings' }
    ],
    rightBarItems: [
      { 
        icon: records.isTodayLevelNewRecord ? Icon.Crown : Icon.Levels, 
        isEnabled: records.hasAnyDailyScore, 
        path: '/daily-records',
        label: `${records.displayableTodayLevel}`
      }
    ]
  }
})
</script>

<template>
  <VuetyScene :navigationBarVM="navigationBarVM" />
</template>
