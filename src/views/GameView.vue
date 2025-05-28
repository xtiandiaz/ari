<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Operation, Operator } from '@/models/math';
import scoreStore from '@/stores/score'
import { generateRandomOperation } from '@/services/operation-generator';
import { operatorIcon } from '@/view-models/vm-math';
import NumberPad from '@vueties/pads/NumberPad.vue';
import SvgIcon from '@vueties/misc/SvgIcon.vue';
import { isMobile } from '@/assets/tungsten/navigator';
import { clearScoreIfNeeded, saveScore } from '@/services/score-management'
import { onWindowEvent } from '@vueties/composables/window-event'
import { clamp } from '@/assets/tungsten/math';

const score = scoreStore()

const operation = ref<Operation>()
const resetInterval = ref<number>()
const input = ref('')

const isInputCorrect = computed(() => input.value && operation.value && Number(input.value) === operation.value.result)
const isLocked = computed(() => resetInterval.value !== undefined)

const operandsDigitCount = computed(() => operation.value?.operands.map(o => o.toString().length))
const operandsDigitTotal = computed(() => operandsDigitCount.value?.reduce((sum, odc) => sum + odc, 0) ?? 0)

const operationResponsiveWidth = computed(() => operandsDigitTotal.value >= 9 ? 'min-content' : 'fit-content')
const operationFontSize = computed(() => {
  const operationViewport = document.getElementById('operation-viewport')!
  const operationViewportWidth = operationViewport.clientWidth
  const maxSizeEm = 3.25
  const maxDigitTotal = Math.floor(operationViewportWidth / (maxSizeEm * 16))
  const maxDigitCount = operationResponsiveWidth.value === 'min-content' 
    ? Math.max(...(operandsDigitCount.value ?? [maxDigitTotal]))
    : Math.min(operandsDigitTotal.value, maxDigitTotal)
  const rawSize = operationViewportWidth / maxDigitCount / 16
  
  console.log(operationViewportWidth, maxDigitCount, maxDigitTotal)
  
  return `${clamp(rawSize, 2, maxSizeEm)}em`
})

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
  
  score.addOperatorScore(operator)
  
  saveScore()
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

watch(() => score.dailyTotalScore, (newTotal) => {
  if (newTotal === 0) {
    reset()
  }
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
    <section id="operation-viewport">
      <div class="spacer"></div>
      <div 
        id="operation" 
        v-if="operation" 
        :style="{ fontSize: operationFontSize, width: operationResponsiveWidth }"
      >
        <div id="operands-and-operator" :class="operation.operator.toLowerCase()">
          <span id="first-operand">{{ operation.operands[0].toLocaleString() }}</span>
          <div id="operator-and-second-operand">
            <SvgIcon id="operator" :icon="operatorIcon(operation.operator)" />
            <span id="second-operand">{{ operation.operands[1].toLocaleString() }}</span>
          </div>
        </div>
        <span id="result" :class=" { isCorrect: isInputCorrect }">
          {{ input.length > 0 ? Number(input).toLocaleString() : '?' }}
        </span>
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
    
    &#operation-viewport {
      padding: 0
    }
    
    div#operation {
      font-family: 'Inter Medium', sans-serif;
      font-size: 3em;
      
      #operands-and-operator {
        $gap: 0.25rem;
        
        column-gap: $gap;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: right;
        
        #operator {
          width: 1.125em;
        }
        
        #operator-and-second-operand {
          align-items: center;
          column-gap: $gap;
          display: flex;
        }
      }
      
      #result {
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
