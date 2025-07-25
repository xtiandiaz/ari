<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useRecordsStore from '@/stores/records'
// import OperatorScoreTag from '@/components/OperatorScoreTag.vue';
// import VuetyForm from '@vueties/components/form/VuetyForm.vue';
// import VuetyFormSection from '@vueties/components/form/VuetyFormSection.vue';
// import VuetyCustomFormRow from '@vueties/components/form/rows/VuetyCustomFormRow.vue';
// import VuetyProgressRing from '@vueties/components/misc/VuetyProgressRing.vue';
import VuetySvgIcon from '@vueties/components/misc/VuetySvgIcon.vue';
import '@/assets/tungsten/extensions/array.extensions'
import { Icon } from '@/assets/design-tokens/iconography';
// import { levelScoreWeight } from '@/utils/score.utils';
import { operatorIcon } from '@/view-models/math.vm';

const route = useRoute()
const records = useRecordsStore()

// const baselineScore = Math.floor(records.todayLevel) * records.playableOperatorsScores.length * levelScoreWeight
// const targetScore = records.playableOperatorsScores.length * levelScoreWeight
// console.log(records.todayAccumulatedScore, '-', baselineScore, '/', targetScore, "todayLevel:", records.todayLevel)
// const nextLevelProgress = computed(() => (records.todayAccumulatedScore - baselineScore) / targetScore)

onMounted(() => {
  route.meta.setTitle("Today's records", false)
})
</script>

<template>
  <main>
    <!-- <div id="level-dial">
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
    </div> -->
    
    <section 
      id="level"
      :class="{ 'new-record': records.isTodayLevelNewRecord }"
    >
      <span v-if="!records.isTodayLevelNewRecord" class="caption">Level</span>
      <VuetySvgIcon v-else :icon="Icon.Crown" />
      
      <h1>{{ records.displayableTodayLevel }}</h1>
      <span class="caption best">
        Best: <strong>{{ records.displayableRecordLevel }}</strong>
      </span>
    </section>
    
    <section id="operator-score-cards">
      <div
        v-for="(operatorScores) in records.playableOperatorsScores"
        :class="['card', operatorScores.operator.toLowerCase()]"
        :key="operatorScores.operator"
      >
        <VuetySvgIcon :icon="operatorIcon(operatorScores.operator)" />
        <div class="flex-spacer"></div>
        <h6 class="operator-colored-item">{{ operatorScores.score }}</h6>
      </div>
    </section>
    
    <section class="footnote">
      These scores will be cleared automatically by the end of the day. Try to beat your own records every day!
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/utils/vuetystrap' as vs;
@use '@vueties/components/form/styles' as form-styles;
@use '@/assets/math';

main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-top: 1em;
  max-width: form-styles.$max-width;
  padding: 0 1em;
}

#level {
  align-items: center;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  letter-spacing: 0.1em;
  padding: 1.5em;
  text-transform: uppercase;
  @include vs.color-attribute('background-color', vs.$background-color);
  
  &.new-record {
    * {
      @include vs.color-attribute('color', 'yellow');
    }
    
    .svg-icon {
      height: 1.5em;
      width: 2em;
    }
  }
  
  h1 {
    font-size: 4em;
  }
  
  > * {
    margin: 0;
  }
}

#operator-score-cards {
  $gap: 0.5em;
  
  border-radius: 1em;
  display: flex;
  flex-wrap: wrap;
  gap: $gap;
  overflow: hidden;
  
  .card {
    align-items: center;
    border-radius: 0.5em;
    box-sizing: border-box;
    display: flex;
    flex: 1 1 calc(50% - $gap);
    padding: 1em;
    @include vs.color-attribute('background-color', vs.$background-color);
    
    > * {
      margin: 0;
    }
    
    .svg-icon {
      @include vs.size(1.5em);
    }
  }
}

.footnote {
  margin: 0 1em;
  @include vs.caption();
  @include vs.color-attribute('color', vs.$tertiary-body-color);
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
        @include vs.color-attribute('stroke', 'yellow');
      }
      
      #level-info {
        @include vs.color-attribute('color', 'yellow');
        
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
      @include vs.position(absolute, 0, 0, 0.5em, 0);
      
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
        @include vs.color-attribute('color', 'secondary-body');
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
