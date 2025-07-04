<script setup lang="ts">
import scoresStore from '@/stores/scores'
import { Icon } from '@design-tokens/iconography'
import { operatorIcon } from '@/view-models/math.vm';
import Form from '@vueties/components/form/VuetyForm.vue';
import Section from '@vueties/components/form/VuetyFormSection.vue';
import CustomFormRow from '@/vueties/components/form/rows/VuetyCustomFormRow.vue';
import SvgIcon from '@/vueties/components/misc/VuetySvgIcon.vue';
import DataMark from '@/vueties/components/accessories/VuetyDataMark.vue';
import '@/assets/tungsten/extensions/array.extensions'

const scores = scoresStore()
</script>

<template>
  <main>
    <section id="levels">
      <span class="caption-all-caps">Level</span>
      <div 
        id="level" 
        :class="{ 'new-record': scores.recordLevel === undefined || scores.todayLevel >= scores.recordLevel }"
      >
        <SvgIcon :icon="Icon.Crown" />
        <h1>{{ scores.todayLevel }}</h1>
      </div>
      <div id="record-level">
        <span>
          <DataMark :icon="Icon.Crown" :value="`Best`" class="caption-all-caps" />
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
          <div class="marks operator-colored-items">
            <DataMark 
              :icon="Icon.CheckmarkCircleFilled" 
              :value="operatorScores.score"
              class="strong"
            />
          </div>
        </CustomFormRow>
      </Section>
    </Form>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/components/form/styles' as form-styles;
@use '@vueties/components/accessories/styles' as accessory-styles;
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

section {
  &#levels {
    align-items: center;
    display: flex;
    gap: 1.5em;
    justify-content: center;
    padding: 1em;
    @include palette.color-attribute('color', 'tertiary-body');
    
    > * {
      flex: 1;
    }
    
    > :first-child {
      text-align: right;
    }
    
    h1, h4 {
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
        transform: translateY(8px);
        width: 2em;
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
</style>
