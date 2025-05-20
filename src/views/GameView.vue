<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Operation, Operator } from '@/models/math';
import statsStore from '@/stores/stats'
import { generateRandomOperation } from '@/services/operation-generator';
import { operatorIcon } from '@/view-models/vm-math';
import NumberPad from '@vueties/pads/NumberPad.vue';
import SvgIcon from '@vueties/misc/SvgIcon.vue';
import { isMobile } from '@/assets/tungsten/navigator';
import { clearDailyStatsIfNeeded, saveDailyStats, saveRecords } from '@/services/stats-management'
import { onWindowEvent } from '@vueties/composables/window-event'

const problem = ref<Operation>()
const resetInterval = ref<number>()
const isSolved = computed(() => problem.value && Number(input.value) === problem.value.result)
const isLocked = computed(() => resetInterval.value !== undefined)

const input = ref('')

const stats = statsStore()

function reset() {
  clearInterval(resetInterval.value)
  
  problem.value = generateRandomOperation()
  input.value = ''
  
  resetInterval.value = undefined
}

function storeOperatorStatsAndReset(operator: Operator) {
  reset()
  
  stats.addScore(operator)
  
  saveDailyStats()
  saveRecords()
}

function onInput(value: number) {
  if (isLocked.value) {
    return
  }
  
  if (input.value.length === 0 && value === 0 && String(problem.value!.result).length > 1) {
    return
  }
  
  switch (value) {
    case -2:
      input.value = ''
      break
    case -1:
      input.value = input.value.slice(0, -1)
      break
    default:
      input.value += String(value)
      break
  }
  
  if (isSolved.value) {    
    resetInterval.value = Number(setInterval(() => {
      storeOperatorStatsAndReset(problem.value!.operator)
    }, 250))
  }
}

function onPageFocusedOrUnmounted() {
  console.log("Game View focused or unmounted...")
  
  clearDailyStatsIfNeeded()
}

watch(() => stats.dailyTotalScore, (newTotal) => {
  if (newTotal === 0) {
    reset()
  }
})

onMounted(() => {  
  reset()
  
  if (isMobile()) {
    return
  }
  
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    // console.log(e.key, e.code)
    
    if (/^Digit\d|Backspace$/.test(e.code)) {
      onInput(e.code === 'Backspace' ? -1 : Number(e.key))
    }
  })
})

onBeforeUnmount(() => {
  onPageFocusedOrUnmounted()
})

onWindowEvent('focus', onPageFocusedOrUnmounted)
// onWindowEvent('beforeunload', onPageUnfocusedOrUnmounted)
// onWindowEvent('pagehide', onPageUnfocusedOrUnmounted) // for iOS
</script>

<template>  
  <main>
    <section class="input">
      <div class="spacer"></div>
      <div id="screen" v-if="problem">
        <div id="problem" class="line" :class="problem.operator.toLowerCase()">
          <h1>{{ problem.operands[0] }}</h1>
          <SvgIcon :icon="operatorIcon(problem.operator)" />
          <h1>{{ problem.operands[1] }}</h1>
        </div>
        <div 
          id="solution" 
          class="line" :class="{ correct: isSolved }"
        >
          <h1>{{ input.length > 0 ? input : '?' }}</h1>
        </div>
      </div>
      <div class="spacer"></div>
    </section>
    <section>
      <NumberPad @input="onInput" />
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/styles/utils';
@use '@vueties/styles/pads';
@use '@vueties/styles/bars';
@use '@design-tokens/palette';
@use '@design-tokens/typography';
@use '@/assets/math';

main {  
  section {
    $h-padding: 1em;
    $v-padding: 1em;
    
    align-items: center;
    display: flex;
    flex-direction: column;
    height: calc(50% - $v-padding * 2);
    padding: $v-padding $h-padding;
    text-align: center;
    width: calc(100% - $h-padding * 2);
    
    &.input {
      div#screen {
        @extend .operator-icons;
        
        max-width: pads.$pad-max-width;
        
        h1, h2 {
          margin: 0;
          text-align: right;
        }
        
        div.line {
          align-items: center;
          display: flex;
          flex-direction: row;
          gap: 0.5em;
          justify-content: right;
          
          .svg-icon {
            @extend h1;
            height: 100%;
            aspect-ratio: 1;
          }
          
          &#solution {
            &.correct {
              * {
                @include palette.color-attribute('color', 'green');
              }
            }
            
            h1 {
              @include palette.color-attribute('color', 'tertiary-body');
            }
          }
        }
      }
    }
  }
}
</style>
