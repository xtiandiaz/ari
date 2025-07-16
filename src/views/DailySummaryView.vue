<script setup lang="ts">
import scoresStore from '@/stores/scores'
import { Icon } from '@design-tokens/iconography'
import { operatorIcon } from '@/view-models/math.vm';
import Form from '@vueties/components/form/VuetyForm.vue';
import Section from '@vueties/components/form/VuetyFormSection.vue';
import CustomFormRow from '@/vueties/components/form/rows/VuetyCustomFormRow.vue';
import SvgIcon from '@/vueties/components/misc/VuetySvgIcon.vue';
import '@/assets/tungsten/extensions/array.extensions'
import VuetySvgIcon from '@/vueties/components/misc/VuetySvgIcon.vue';

const scores = scoresStore()
</script>

<template>
  <main>
    <section id="levels">
      
      <span class="mark">Level</span>
      
      <div 
        id="level" 
        :class="{ 'new-record': scores.recordLevel === undefined || scores.todayLevel >= scores.recordLevel }"
      >
        <SvgIcon :icon="Icon.Crown" />
        <h1>{{ scores.todayLevel }}</h1>
      </div>
      
      <div id="record-level">
        <span>
          <span class="mark">
            <VuetySvgIcon :icon="Icon.Crown" />
            Best
          </span>
          <h4>{{ scores.recordLevel ?? scores.todayLevel }}</h4>
        </span>
      </div>
    </section>
    
    <Form id="scores">
      <Section
        :title="`Scores`"
        :footnote="`These scores will be cleared automatically by the end of the day. Try to beat your own records every day!`"
      >
        <CustomFormRow 
          v-for="(operatorScores) in scores.playableOperatorsScores" 
          :key="operatorScores.operator" 
          class="score-row" :class="operatorScores.operator.toLowerCase()"
        >
          <SvgIcon :icon="operatorIcon(operatorScores.operator)" class="representative-icon" />
          
          <div class="spacer"></div>
          
          <div class="mark operator-colored-items">
            <VuetySvgIcon :icon="Icon.CheckmarkCircle" />
            <span class="score">{{ operatorScores.score }}</span>
          </div>
          
        </CustomFormRow>
      </Section>
    </Form>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/components/form/styles' as form-styles;
@use '@vueties/utils/mixins';
@use '@design-tokens/palette';
@use '@design-tokens/typography';
@use '@/assets/math';

strong {
  display: inline !important;
}

section {
  &#levels {
    align-items: center;
    display: flex;
    gap: 1.75em;
    justify-content: center;
    @include palette.color-attribute('color', 'tertiary-body');
    
    > * {
      flex: 1;
    }
    
    > :first-child {
      justify-content: right;
    }
    
    h1, h4 {
      line-height: 1;
      margin: 0;
    }
    
    h1 {
      font-size: 3.75em;
    }
    
    #level {
      text-align: center;
      flex: 0;
      @include palette.color-attribute('color', 'body');
      
      .svg-icon {
        display: none;
        @include mixins.size(2.25em);
      }
      
      &.new-record {          
        .svg-icon {
          display: inline-block;
        }
      }
    }
    
    #record-level {
      > :first-child {
        display: inline-block;
        text-align: center;
      }
    }
    
    .new-record {
      &, * {
        @include palette.color-attribute('color', 'yellow');
      }
    }
  }
}

.mark {
  align-items: center;
  display: inline-flex;
  font-size: 0.9em;
  gap: 0.375em;
  letter-spacing: 0.075em;
  text-transform: uppercase;
  
  .svg-icon {
    @include mixins.size(1.25em);
  }
}

.score {
  @extend .strong;
  font-size: 1.2em;
}
</style>
