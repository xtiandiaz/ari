<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { type Operation } from '@/models/math';
import { allModalities, OperationModality } from '@/models/game';
import scoresStore from '@/stores/records'
import { generateRandomOperation } from '@/services/operation-generator';
import { clearScoreIfNeeded, saveScores } from '@/services/records-management'
import OperationScreen from '@/components/OperationScreen.vue'
import NumberPad from '@/vueties/components/pads/VuetyNumberPad.vue';
import { setUpEvent } from '@vueties/composables/set-up-event'
import { isMobile } from '@/assets/tungsten/navigator';
import { getRandomChoice } from '@/assets/tungsten/randomness';

const records = scoresStore()

const operation = ref<Operation>()
const resetInterval = ref<number>()
const currentModality = ref<OperationModality>(OperationModality.Aural)
const input = ref('')

const isInputCorrect = computed(() => input.value != undefined
  && operation.value != undefined 
  && Number(input.value) === operation.value.result
)
const isLocked = computed(() => resetInterval.value !== undefined)

function reset() {
  clearInterval(resetInterval.value)
  
  currentModality.value = getRandomChoice(allModalities)
  operation.value = generateRandomOperation(currentModality.value)
  
  input.value = ''
  
  resetInterval.value = undefined
}

function resetAndSaveScoreForOperatorIfNeeded(operation: Operation) {
  reset()
  
  if (clearScoreIfNeeded()) {
    return
  }
  
  records.registerOperationScore(operation)
  
  saveScores()
}

function onInput(value: number) {
  if (isLocked.value) {
    return
  }
  
  if (input.value.length === 0 && value === 0) {
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
    resetInterval.value = Number(
      setInterval(() => resetAndSaveScoreForOperatorIfNeeded(operation.value!), 250)
    )
  }
}

function onPageFocusedOrUnmounted() {
  console.log("Game View focused or unmounted...")
  
  clearScoreIfNeeded()
}

watch(() => records.hasAnyDailyScore, (stillHas) => {
  if (!stillHas) {
    reset()
  }
})

onMounted(async () => {  
  reset()
  
  if (!import.meta.env.DEV && isMobile()) {
    return
  }
  
  window.addEventListener("keydown", (e: KeyboardEvent) => {    
    if (/^Digit\d|Backspace$/.test(e.code)) {
      onInput(e.code === 'Backspace' ? -1 : Number(e.key))
    } else if (e.code === 'Escape') {
      reset()
    }
  })
})

onBeforeUnmount(() => {
  onPageFocusedOrUnmounted()
})

setUpEvent('focus', window, onPageFocusedOrUnmounted)
</script>

<template>
  <main>
    <OperationScreen
      v-if="operation"
      :operation="operation"
      :input="input"
      :isInputCorrect="isInputCorrect"
    />
    
    <section v-if="isMobile()">
      <NumberPad @input="onInput" />
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/components/bars/styles' as bar-styles;

main {
  display: flex;
  flex-direction: column;
  height: 100%;
  z-index: 1;
}

section {  
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex: 1 1 50%;
  flex-direction: column;
  padding: 1em;
  text-align: center;
}
</style>
