<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import type { Operation } from '@/models';
import useRecordsStore from '@/stores/records'
import useGameStore from '@/stores/game'
import { generateRandomOperation } from '@/services/operation-generator';
import { clearScoresIfNeeded, saveRecords } from '@/services/records-management'
import { saveSettings } from '@/services/settings-management';
import OperationScreen from '@/components/OperationScreen.vue'
import ModalitySelector from '@/components/ModalitySelector.vue';
import NumberPad from '@vueties/components/pads/VuetyNumberPad.vue';
import { useEvent } from '@vueties/composables/event'
import { isMobile } from '@/assets/tungsten/navigator';
import VuetyNavigationalView from '@/vueties/views/VuetyNavigationalView.vue';
import { navBarItem } from '@/vueties/components/shared/view-models';
import { Icon } from '@design-tokens/iconography';

const records = useRecordsStore()
const settings = useGameStore().settings

const operation = ref<Operation>()
const resetInterval = ref<number>()
const input = ref('')
const display = useTemplateRef('display')

const isInputCorrect = computed(() => input.value != undefined
  && operation.value != undefined 
  && Number(input.value) === operation.value.result
)
const isLocked = computed(() => resetInterval.value !== undefined)

function reset() {
  clearInterval(resetInterval.value)
  
  operation.value = generateRandomOperation(settings.modality)
  
  input.value = ''
  
  resetInterval.value = undefined
}

function resetAndSaveScoreForOperatorIfNeeded(operation: Operation) {
  reset()
  
  if (clearScoresIfNeeded()) {
    return
  }
  
  records.registerOperationScore(operation)
  
  saveRecords()
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
  
  clearScoresIfNeeded()
}

watch(() => records.hasAnyDailyScore, (hasAny) => {
  if (!hasAny) {
    reset()
  }
})

watch(() => settings.modality, () => {
  reset()
  saveSettings()
})

onMounted(async () => {  
  reset()
  
  if (!import.meta.env.DEV && isMobile()) {
    return
  }
  
  window.addEventListener("keydown", (e: KeyboardEvent) => {    
    if (/^Digit\d|Backspace$/.test(e.code)) {
      onInput(e.code === 'Backspace' ? -1 : Number(e.key))
    } else {
      switch (e.code) {
        case 'Escape':
          reset()
          break
        case 'KeyR': // Repeat
          display.value?.utterOperation()
          break
      }
    }
  })
})

onBeforeUnmount(() => {
  onPageFocusedOrUnmounted()
})

useEvent('focus', window, onPageFocusedOrUnmounted)
</script>

<template>
  <VuetyNavigationalView
    :nav-bar-items="[
      navBarItem('/settings', -1, undefined, Icon.Gear),
      navBarItem('/daily-records', 1, `${records.levels.map(l => l.value).join(' • ')}`, Icon.BarChart, records.hasAnyDailyScore),
    ]"
  >
    <main>      
      <OperationScreen
        v-if="operation"
        ref="display"
        :operation="operation"
        :input="input"
        :isInputCorrect="isInputCorrect"
      />
          
      <section v-if="isMobile()">
        <NumberPad @input="onInput" />
      </section>
    </main>
  </VuetyNavigationalView>
</template>

<style scoped lang="scss">
@use '@vueties/utils/vuetystrap' as vs;
@use '@vueties/components/bars/styles' as bar-styles;

main {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: visible;
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

#modality-selector {
  transform: translate(-50%, -50%);
  z-index: calc(bar-styles.$nav-bar-z-index + 1);
  @include vs.position(
    absolute, 
    calc(env(safe-area-inset-top) + bar-styles.$nav-bar-height / 2),
    null,
    null,
    50%
  );
}
</style>
