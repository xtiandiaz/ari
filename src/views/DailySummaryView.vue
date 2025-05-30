<script setup lang="ts">
import { onBeforeMount } from 'vue';
import scoresStore from '@/stores/scores'
import { Icon } from '@design-tokens/iconography'
import { operatorIcon } from '@/view-models/vm-math';
import SvgIcon from '@/vueties/misc/SvgIcon.vue';
import DataMark from '@/vueties/accessories/DataMark.vue';
import '@/assets/tungsten/extensions/array.extensions'

const emits = defineEmits<{
  viewTitle: [string],
}>()

const scores = scoresStore()

onBeforeMount(() => {
  emits('viewTitle', `Today's Scores`)
})
</script>

<template>
  <main>
    <section id="levels">
      <span class="caption-all-caps">Level</span>
      <div id="level" :class="{ 'new-record': scores.todayLevel >= scores.recordLevel }">
        <SvgIcon :icon="Icon.Crown" />
        <h1>{{ scores.todayLevel }}</h1>
      </div>
      <div id="record-level">
        <span>
          <DataMark :icon="Icon.Crown" :value="`Best`" class="caption-all-caps" />
          <h4>{{ scores.recordLevel }}</h4>
        </span>
      </div>
    </section>
    
    <section id="scores" class="form">
      <div class="section">
        <div class="header">
          <span class="title">Scores</span>
        </div>
        <div class="rows">
          <div 
            v-for="(operatorScores) in scores.playableOperatorsScores" 
            :key="operatorScores.operator" 
            class="row score-row" :class="operatorScores.operator.toLowerCase()"
          >
            <SvgIcon :icon="operatorIcon(operatorScores.operator)" class="representative-icon" />
            <div class="spacer"></div>
            <div class="marks operator-colored-items">
              <DataMark 
                :icon="Icon.Right" 
                :value="operatorScores.score"
                class="strong"
              />
            </div>
          </div>
        </div>
        <div class="footer">
          These scores will be cleared automatically by the end of the day. <strong>Try to beat your own records every day!</strong>
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
        font-size: 4em;
      }
      
      #level {
        text-align: center;
        flex: 0;
        @include palette.color-attribute('color', 'body');
        
        .svg-icon {
          width: 2em;
          display: none;
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
}
</style>
