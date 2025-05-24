<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { Operation, Operator } from '@/models/math';
import settingsStore from '@/stores/settings'
import statsStore from '@/stores/stats'
import { generateRandomOperation } from '@/services/operation-generator';
import { operatorIcon } from '@/view-models/vm-math';
import NumberPad from '@vueties/pads/NumberPad.vue';
import SvgIcon from '@vueties/misc/SvgIcon.vue';
import { isMobile } from '@/assets/tungsten/navigator';
import { clearScoreIfNeeded, saveScore, saveRecords } from '@/services/stats-management'
import { onWindowEvent } from '@vueties/composables/window-event'

const operation = ref<Operation>()
const resetInterval = ref<number>()
const input = ref('')

const operandsDigitCount = computed(() => operation.value?.operands.reduce((count, o) => count + String(o).length, 0) ?? 0)
const isInputCorrect = computed(() => input.value && operation.value && Number(input.value) === operation.value.result)
const isLocked = computed(() => resetInterval.value !== undefined)

const settings = settingsStore()
const stats = statsStore()

function reset() {
  clearInterval(resetInterval.value)
  
  operation.value = generateRandomOperation()
  input.value = ''
  
  resetInterval.value = undefined
}

function resetAndSaveScoreForOperatorIfNeeded(operator: Operator) {
  reset()
  
  if (clearScoreIfNeeded()) {
    return
  }
  
  stats.addScore(operator)
  
  saveScore()
  saveRecords()
}

async function centerOperation() {
  await nextTick()
  
  const operationDiv = document.getElementById('operation') as HTMLDivElement
  operationDiv.style.width = operandsDigitCount.value < settings.maxDigitsPerOperationLine 
    ? 'fit-content' 
    : 'min-content'
}

function onInput(value: number) {
  if (isLocked.value) {
    return
  }
  
  if (input.value.length === 0 && value === 0 && String(operation.value!.result).length > 1) {
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
  
  if (isInputCorrect.value) {    
    resetInterval.value = Number(setInterval(() => {
      resetAndSaveScoreForOperatorIfNeeded(operation.value!.operator)
    }, 250))
  }
}

function onPageFocusedOrUnmounted() {
  console.log("Game View focused or unmounted...")
  
  clearScoreIfNeeded()
}

watch(() => stats.dailyTotalScore, (newTotal) => {
  if (newTotal === 0) {
    reset()
  }
})

watch(operation, async () => {
  await centerOperation()
})

onMounted(async () => {  
  reset()
  
  if (isMobile()) {
    return
  }
  
  window.addEventListener("keydown", (e: KeyboardEvent) => {    
    if (/^Digit\d|Backspace$/.test(e.code)) {
      onInput(e.code === 'Backspace' ? -1 : Number(e.key))
    }
  })
})

onBeforeUnmount(() => {
  onPageFocusedOrUnmounted()
})

onWindowEvent('focus', onPageFocusedOrUnmounted)
</script>

<template>  
  <main>
    <section>
      <div class="spacer"></div>
      <div id="operation" ref="operation-template" v-if="operation">
        <div id="operands-and-operator" :class="operation.operator.toLowerCase()">
          <h1 id="first-operand">{{ operation.operands[0].toLocaleString() }}</h1>
          <div id="operator-and-second-operand">
            <SvgIcon id="operator" :icon="operatorIcon(operation.operator)" />
            <h1 id="second-operand">{{ operation.operands[1].toLocaleString() }}</h1>
          </div>
        </div>
        <h1 id="result" :class=" { isCorrect: isInputCorrect }">
          {{ input.length > 0 ? Number(input).toLocaleString() : '?' }}
        </h1>
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
    
    div#operation {
      max-width: pads.$pad-max-width;
      width: fit-content;
      
      h1 {
        margin: 0;
      }
      
      #operands-and-operator {
        $gap: 0.25em;
        
        column-gap: $gap;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: right;
        
        #operator {
          width: 3.5em;
        }
        
        #operator-and-second-operand {
          align-items: center;
          column-gap: $gap;
          display: flex;
        }
      }
      
      h1#result {
        float: right;
        @include palette.color-attribute('color', 'tertiary-body');
        
        &.isCorrect {
          @include palette.color-attribute('color', 'green');
        }
      }
    }
  }
}
</style>
