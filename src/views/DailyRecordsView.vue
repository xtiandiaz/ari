<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useRecordsStore from '@/stores/records'
import OperatorScoreTag from '@/components/OperatorScoreTag.vue';
import VuetyForm from '@vueties/components/form/VuetyForm.vue';
import VuetyFormSection from '@vueties/components/form/VuetyFormSection.vue';
import VuetyCustomFormRow from '@vueties/components/form/rows/VuetyCustomFormRow.vue';
import VuetyProgressRing from '@vueties/components/misc/VuetyProgressRing.vue';
import VuetySvgIcon from '@vueties/components/misc/VuetySvgIcon.vue';
import '@/assets/tungsten/extensions/array.extensions'
import { Icon } from '@/assets/design-tokens/iconography';
import { levelScoreWeight } from '@/utils/score.utils';

const route = useRoute()
const records = useRecordsStore()

const baselineScore = Math.floor(records.todayLevel) * records.playableOperatorsScores.length * levelScoreWeight
const targetScore = records.playableOperatorsScores.length * levelScoreWeight
// console.log(records.todayAccumulatedScore, '-', baselineScore, '/', targetScore, "todayLevel:", records.todayLevel)
const nextLevelProgress = computed(() => (records.todayAccumulatedScore - baselineScore) / targetScore)

onMounted(() => {
  route.meta.setTitle("Today's records", false)
})
</script>

<template>
  <main>
    <div id="level-dial">
      <div :class="['level', records.isTodayLevelNewRecord ? 'new-record' : undefined]">
        <VuetyProgressRing :progress="nextLevelProgress" :size="176" :stroke-width="6" />
        
        <div id="level-info">
          <VuetySvgIcon class="crown" :icon="Icon.Crown" />
          <h1>{{ records.displayableTodayLevel }}</h1>
          <span class="caption">
            Best: <strong>{{ records.displayableRecordLevel }}</strong>
          </span>
        </div>
      </div>
    </div>
    
    <VuetyForm id="scores">    
      <VuetyFormSection 
        :title="'Scores'"
        :footnote="`These scores will be cleared automatically by the end of the day. Try to beat your own records every day!`"
      >
        <VuetyCustomFormRow id="scores-row">
          <div class="content-wrapper">
            <OperatorScoreTag
              v-for="(operatorScores) in records.playableOperatorsScores"
              :key="operatorScores.operator"
              :operator="operatorScores.operator"
              :score="operatorScores.score"
            />
          </div>
        </VuetyCustomFormRow>
      </VuetyFormSection>
    </VuetyForm>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/components/form/styles' as form-styles;
@use '@vueties/styles/mixins';
@use '@design-tokens/palette';
@use '@design-tokens/typography';
@use '@/assets/math';

.spacer {
  flex: auto;
}

#level-dial {
  display: flex;
  justify-content: center;
  padding-top: 1em;
  text-transform: uppercase;
  
  .level {
    position: relative;
    
    &.new-record {
      :deep(.vuety-progress-ring #progress) {
        @include palette.color-attribute('stroke', 'yellow');
      }
      
      #level-info {
        @include palette.color-attribute('color', 'yellow');
        
        .crown {
          display: block;
        }
      }
    }
    
    #level-info {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      @include mixins.position(absolute, 0, 0, 0.5em, 0);
      
      h1 {
        margin: 0;
      }
      
      .crown {
        display: none;
        height: 1.5em;
        width: 2em;
      }
      
      .caption {
        text-transform: uppercase;
        letter-spacing: 0.1em;
        @include palette.color-attribute('color', 'secondary-body');
      }
    }
  }
}

#scores-row .content-wrapper {
  display: flex;
  flex-basis: 100%;
  flex-wrap: wrap;
  gap: 0.5em;
  justify-content: start;
  padding: 1em 0;
}
</style>
