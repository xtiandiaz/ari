<script setup lang="ts">
// import settingsStore from '@/stores/settings'
import { onBeforeMount } from 'vue';
import statsStore from '@/stores/stats'
import { clearDailyStats, clearRecords } from '@/services/stats-management'
import ButtonRow from '@vueties/form/ButtonRow.vue'

const emits = defineEmits<{
  viewTitle: [string?]
}>()

const stats = statsStore()

onBeforeMount(() => {
  emits('viewTitle', 'Settings')
})
</script>

<template>
  <section class="form">
    <!-- <ChoiceSection  -->
    <div class="section">
      <div class="rows">
        <ButtonRow 
          :label="`Clear today's progress and stats`" 
          :isDestructive="true"
          :class="{ disabled: stats.dailySolutionsTotal === 0 }"
          @click="clearDailyStats()"
        />
      </div>
      <!-- <div class="footer">Note</div> -->
    </div>
    <div class="section">
      <div class="rows">
        <ButtonRow 
          :label="`Clear all records`" 
          :isDestructive="true"
          :disabled="true"
          @click="clearRecords()"
        />
      </div>
      <!-- <div class="footer">Note</div> -->
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@vueties/styles/form';
</style>
