<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Operation, Operator } from '@/models/math';
import scoresStore from '@/stores/scores'
import { generateRandomOperation } from '@/services/operation-generator';
import { clearScoreIfNeeded, saveScores } from '@/services/scores-management'
import OperationScreen from '@/components/OperationScreen.vue'
import NumberPad from '@/vueties/components/pads/VuetyNumberPad.vue';
import { isMobile } from '@/assets/tungsten/navigator';
import { onWindowEvent } from '@vueties/composables/window-event'

const scores = scoresStore()

const operation = ref<Operation>()
const resetInterval = ref<number>()
const input = ref('')

const isInputCorrect = computed(() => input.value != undefined
  && operation.value != undefined 
  && Number(input.value) === operation.value.result
)
const isLocked = computed(() => resetInterval.value !== undefined)

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
  
  scores.addOperatorScore(operator)
  
  saveScores()
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

watch(() => scores.hasAnyDailyScore, (stillHas) => {
  if (!stillHas) {
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
    <OperationScreen
      :operation="operation"
      :input="input"
      :isInputCorrect="isInputCorrect"
    />
    
    <section>
      <NumberPad @input="onInput" />
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/utils/styles' as utility-styles;

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
  }
}
</style>
