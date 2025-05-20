<script setup lang="ts">
import { capitalize, computed, onBeforeMount } from 'vue';
import { Operator } from '@/models/math'
import statsStore from '@/stores/stats'
import { calculateLevelForOperator, calculateOverallLevel } from '@/utils/stats.utils'
import '@/assets/tungsten/extensions/array.extensions'
import { Icon } from '@design-tokens/iconography'
import SvgIcon from '@/vueties/misc/SvgIcon.vue';
import { operatorIcon } from '@/view-models/vm-math';
import InfoRow from '@/vueties/form/InfoRow.vue';

const emits = defineEmits<{
  viewTitle: [string],
}>()

const stats = statsStore()
const operatorsStats = computed(() => [
    Operator.Addition, 
    Operator.Subtraction, 
    Operator.Multiplication, 
    Operator.Division
  ].map(o => stats.getOperatorDailyStats(o) ?? {
    operator: o,
    solutionCount: 0
  })
)

onBeforeMount(() => {
  emits('viewTitle', `Today's Stats`)
})
</script>

<template>
  <main>
    <section id="average">
      <span class="caption-all-caps">Level</span>
      <h1>{{ calculateOverallLevel() }}</h1>
    </section>
    <section id="summary" class="form">
      <div class="section">
        <div class="header">
          <span class="title">Levels</span>
        </div>
        <div class="rows">
          <InfoRow 
            v-for="(operatorStats) of operatorsStats" 
            :key="operatorStats.operator"
            :title="capitalize(operatorStats.operator)"
            :subtitle="`Solutions: ${operatorStats.solutionCount}`"
            :value="String(calculateLevelForOperator(operatorStats.operator))"
            :icon="operatorIcon(operatorStats.operator)"
            :class="`operator-${operatorStats.operator.toLowerCase()}`"
          />
        </div>
      </div>
        
        <!-- <div class="stats">
          <h3 class="operator-colored-item">{{  }}</h3>
          
          <div class="marks">
            <span class="mark">
              <SvgIcon :icon="Icon.Right" />
              <span>{{ operatorStats.solutionCount }}</span>
            </span> -->
            <!-- <span class="mark operator-colored-item">
              <SvgIcon :icon="Icon.Lighning" />
              <span>{{ operatorStats.solutionCount }}</span>
            </span> -->
          <!-- </div>
        </div> -->
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/styles/form';
@use '@vueties/styles/utils';
@use '@design-tokens/palette';
@use '@design-tokens/typography';
@use '@/assets/math';

span.caption-all-caps {
  @extend .caption;
  letter-spacing: 0.125em;
  text-transform: uppercase;
}

:deep(.row.info) {
  .value {
    @extend .h6;
  }
}

main {  
  section {
    margin: 0 1em;
    
    &#average {
      padding: 3em 1em;
      text-align: center;
      
      h1 {
        margin: 0;
      }
    }
    
    &#summary {
      $gap: 0.5em;
      
      display: flex;
      flex-wrap: wrap;
      gap: $gap;
      @extend .operator-icons;
      
      div.operator-stats-box {
        $h-padding: 1em;
        $v-padding: 1em;
        
        border-radius: 1em;
        flex: 1 1 calc(25% - 2 * $h-padding - 3 * $gap);
        padding: $v-padding $h-padding;
        position: relative;
        @include palette.color-attribute('background-color', 'background');
        
        @media screen and (max-width: 560px) {  
          flex-basis: calc(50% - 2 * $h-padding - $gap);
        }
        
        .svg-icon {
          $icon-size: 2em;
          
          height: $icon-size;
          width:  $icon-size;
          
          &.operator-icon {
            position: absolute;
            top: $v-padding;
            right: $h-padding;
          }
        }
        
        .stats {
          margin-top: 0.5em;
          padding: 2em 0 0 0.25em;
          
          h3 {
            margin: 0;
          }
          
          .marks {
            display: flex;
            gap: 1em;
            margin-top: 0.25em;
            
            span.mark {              
              @extend strong;
              
              > * {
                vertical-align: middle;
              }
              
              .svg-icon {
                $icon-size: 1.25em;
                
                height: $icon-size;
                margin-right: 0.25em;
                width:  $icon-size;
              }
            }
          }
        }
      }
    }
  }
}
</style>
