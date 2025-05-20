<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { Operator } from '@/models/math'
import statsStore from '@/stores/stats'
import { calculateLevelForOperator, calculateOverallLevel } from '@/utils/stats.utils'
import '@/assets/tungsten/extensions/array.extensions'
import { Icon } from '@design-tokens/iconography'
import SvgIcon from '@/vueties/misc/SvgIcon.vue';
import { operatorIcon } from '@/view-models/vm-math';

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
    <section id="summary">
      <div v-for="(operatorStats) of operatorsStats" 
        :key="operatorStats.operator"
        class="operator-stats" :class="operatorStats.operator.toLowerCase()"
      >
        <div>
          <SvgIcon :icon="operatorIcon(operatorStats.operator)" />
        </div>
        <div class="spacer"></div>
        <div class="stats operator-colored-item">
          <span class="caption-all-caps">Level</span>
          <h3 class="">{{ calculateLevelForOperator(operatorStats.operator) }}</h3>
          
          <div class="marks">
            <span class="mark">
              <SvgIcon :icon="Icon.Right" />
              <span>{{ operatorStats.solutionCount }}</span>
            </span>
            <!-- <span class="mark operator-colored-item">
              <SvgIcon :icon="Icon.Lighning" />
              <span>{{ operatorStats.solutionCount }}</span>
            </span> -->
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/styles/form';
@use '@vueties/styles/utils';
@use '@design-tokens/palette';
@use '@/assets/math';

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
      
      div.operator-stats {
        $h-padding: 2em;
        $v-padding: 1em;
        
        align-items: center;
        border-radius: 1em;
        display: flex;
        flex: 1 1 calc(50% - $h-padding * 2 - $gap);
        padding: $v-padding $h-padding;
        @include palette.color-attribute('background-color', 'background');
        
        @media screen and (max-width: 480px) {  
          flex-basis: 100%;
        }
        
        .svg-icon {
          $icon-size: 2.5em;
          
          height: $icon-size;
          width:  $icon-size;
        }
        
        h3 {
          margin: 0;
        }
        
        .stats {
          text-align: right;
          
          .marks {
            display: flex;
            gap: 1em;
            justify-content: right;
            margin-top: 0.5em;
            
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
