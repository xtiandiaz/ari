<script setup lang="ts">
// import settingsStore from '@/stores/settings'
import { onBeforeMount } from 'vue';
import statsStore from '@/stores/stats'
import { clearDailyStats, clearRecords } from '@/services/stats-management'
import ButtonRow from '@vueties/form/ButtonRow.vue'
import { version } from '@/../package.json'

const emits = defineEmits<{
  viewTitle: [string?]
}>()

const stats = statsStore()

onBeforeMount(() => {
  emits('viewTitle', 'Settings')
})
</script>

<template>
  <main>
    <section class="form">
      <!-- <ChoiceSection  -->
      <div class="section">
        <div class="rows">
          <ButtonRow 
            :label="`Clear today's score`" 
            :isDestructive="true"
            :class="{ disabled: stats.dailyTotalScore === 0 }"
            @click="clearDailyStats()"
          />
        </div>
      </div>
      <!-- <div class="section">
        <div class="rows">
          <ButtonRow 
            :label="`Clear all records`" 
            :isDestructive="true"
            :disabled="true"
            @click="clearRecords()"
          />
        </div>
      </div> -->
    </section>
    <span class='version'>v{{ version }}</span>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/styles/form';
@use '@design-tokens/palette';
@use '@design-tokens/typography';

main {
  text-align: center;
  
  .version {
    @extend .caption;
    @include palette.color-attribute('color', 'tertiary-body');
  }
}
</style>
