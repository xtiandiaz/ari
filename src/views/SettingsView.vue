<script setup lang="ts">
import { onBeforeMount } from 'vue';
import scoresStore from '@/stores/scores'
import { clearScores, clearRecords } from '@/services/scores-management'
import ButtonRow from '@vueties/form/ButtonRow.vue'
import { version } from '@/../package.json'

const emits = defineEmits<{
  viewTitle: [string?]
}>()

const scores = scoresStore()

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
            :label="`Clear today's scores`" 
            :isDestructive="true"
            :class="{ disabled: scores.dailyTotalOperatorsScore === 0 }"
            @click="clearScores()"
          />
        </div>
        <div class="footer">
          Daily scores will be cleared automatically by the end of the day. But, clear them now if you want to start today over.
        </div>
      </div>
      <div class="section">
        <div class="rows">
          <ButtonRow 
            :label="`Clear all records`" 
            :isDestructive="true"
            :class="{ disabled: scores.recordLevel <= scores.todayLevel }"
            @click="clearRecords()"
          />
        </div>
        <div class="footer">
          Use your records to compare your daily achievements. Clear them only if you'd like to re-establish your personal records.
        </div>
      </div>
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
