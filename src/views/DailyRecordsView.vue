<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { OperationModality } from '@/models/game';
import useRecordsStore from '@/stores/records'
// import OperatorScoreTag from '@/components/OperatorScoreTag.vue';
// import VuetyForm from '@vueties/components/form/VuetyForm.vue';
// import VuetyFormSection from '@vueties/components/form/VuetyFormSection.vue';
// import VuetyCustomFormRow from '@vueties/components/form/rows/VuetyCustomFormRow.vue';
// import VuetyProgressRing from '@vueties/components/misc/VuetyProgressRing.vue';
import OperatorScoreTag from '@/components/OperatorScoreTag.vue';
import VuetySvgIcon from '@vueties/components/misc/VuetySvgIcon.vue';
import '@/assets/tungsten/extensions/array.extensions'
import { Icon } from '@/assets/design-tokens/iconography';

const route = useRoute()
const records = useRecordsStore()

const levels = [OperationModality.Visual, OperationModality.Aural].map(mod => records.getLevel(mod))
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
    <section id="level-cards">
      <div 
        v-for="(level) of levels"
        class="card"
        :key="level.modality"
      >
        <div class="modality">
          <VuetySvgIcon :icon="level.modality == OperationModality.Visual ? Icon.Eye : Icon.Ear" />
        </div>
        <span class="caption">level</span>
        <h1>{{ level.value }}</h1>
        <span class="caption">Best: <strong>{{ level.best }}</strong></span>
        <div class="tags">
          <OperatorScoreTag 
            v-for="(score) in level.operatorScores"
            class="small"
            :key="score.operator"
            :operator="score.operator"
            :score="score.value"
          />
        </div>
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

section#level-cards {
  $cards-gap: 0.5em;
  
  display: flex;
  gap: $cards-gap;
  
  > * {
    @include vs.color-attribute('background-color', vs.$background-color);
  }
  
  .card {
    border-radius: 1em;
    display: flex;
    flex: 1 1 calc(50% - $cards-gap);
    flex-direction: column;
    overflow: hidden;
    padding: 1.25em;
    position: relative;
    
    h1 {
      margin: 0;
    }
    
    .modality {
      @include vs.position(absolute, 0.5em, 0.5em);
      @include vs.size(2.5em);
      
      .svg-icon {
        @include vs.size(100%);
        @include vs.color-attribute('color', vs.$accessory-color);
      }
    }
    
    .caption {
      text-transform: uppercase;
      letter-spacing: 0.1em;
      @include vs.color-attribute('color', vs.$secondary-body-color);
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25em;
      margin-top: 1em;
    }
  }
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
      @include vs.size(1.75em);
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
        @include vs.color-attribute('color', vs.$secondary-body-color);
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
