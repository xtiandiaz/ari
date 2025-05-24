<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Operator } from '@/models/math'
import statsStore from '@/stores/score'
import { calculateLevel, calculateRecordLevel } from '@/utils/score.utils'
import { Icon } from '@design-tokens/iconography'
import { operatorIcon } from '@/view-models/vm-math';
import SvgIcon from '@/vueties/misc/SvgIcon.vue';
import DataMark from '@/vueties/accessories/DataMark.vue';
import '@/assets/tungsten/extensions/array.extensions'

const emits = defineEmits<{
  viewTitle: [string],
}>()

const stats = statsStore()
const operatorsScores = [
  Operator.Addition, 
  Operator.Subtraction, 
  Operator.Multiplication, 
  Operator.Division
].map(o => stats.getOperatorDailyScore(o) ?? {
  operator: o,
  score: 0,
  record: 0
})
const currentLevel = calculateLevel()
const recordLevel = calculateRecordLevel()

onBeforeMount(() => {
  emits('viewTitle', `Today's Scores`)
})
</script>

<template>
  <main>
    <section id="levels">
      <span class="caption-all-caps">Level</span>
      <h1 id="level" :class="{ 'current-record': currentLevel >= recordLevel }">{{ currentLevel }}</h1>
      <div id="record-level" :class="{ 'current-record': recordLevel > currentLevel }">
        <span class="caption-all-caps">Best</span>
        <h5>{{ recordLevel }}</h5>
      </div>
    </section>
    
    <section id="scores" class="form">
      <div class="section">
        <div class="header">
          <span class="title">Scores</span>
        </div>
        <div class="rows">
          <div 
            v-for="(operatorScore) in operatorsScores" 
            :key="operatorScore.operator" 
            class="row score-row" :class="operatorScore.operator.toLowerCase()"
          >
            <SvgIcon :icon="operatorIcon(operatorScore.operator)" class="representative-icon" />
            <div class="spacer"></div>
            <div class="marks operator-colored-items">
              <DataMark 
                :icon="Icon.Right" 
                :value="operatorScore.score"
                class="strong"
              />
            </div>
          </div>
        </div>
        <div class="footer">
          All scores will be cleared automatically by the end of the day. <strong>Try to beat your own records every day!</strong>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/styles/form';
@use '@vueties/styles/accessories';
@use '@design-tokens/palette';
@use '@design-tokens/typography';
@use '@/assets/math';

strong {
  display: inline !important;
}

span.caption-all-caps {
  @extend .caption;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

main {  
  section {
    margin: 0 1em;
    
    &#levels {
      align-items: center;
      display: flex;
      gap: 2em;
      justify-content: center;
      padding: 1em;
      
      > * {
        flex: 1;
      }
      
      > :first-child {
        text-align: right;
      }
      
      h1, h5 {
        margin: 0;
      }
      
      #level {
        text-align: center;
        flex: 0;
      }
      
      // .current-record {
      //   &, * {
      //     @include palette.color-attribute('color', 'yellow');
      //   }
      // }
      
      #record-level {
        @include palette.color-attribute('color', 'tertiary-body');
      }
    }
  }
}
</style>
