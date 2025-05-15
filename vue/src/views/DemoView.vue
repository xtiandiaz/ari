<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import NumberPad from '@vueties/pads/NumberPad.vue';
import { operation } from '@/legacy/services/factory';
import { operationString, operandString } from '@/legacy/services/stringifier';
import Operation from '@/legacy/models/operation';
import Operator from '@/legacy/models/operator';

const problem = ref<Operation>()
const resetInterval = ref<number>()
const isSolved = computed(() => input.value === operandString(problem.value!.result))
const isLocked = computed(() => resetInterval.value !== undefined)

const input = ref('')

function reset() {
  clearInterval(resetInterval.value)
  
  problem.value = operation(
    Math.random() * 3,
    [Operator.addition, Operator.multiplication]
  )
  
  input.value = ''
  
  resetInterval.value = undefined
}

function onInput(value: number) {
  if (isLocked.value) {
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
      reset()
    }, 250))
  }
}

onMounted(() => {
  reset()
})
</script>

<template>
  <main class="demo">
    <section class="input">
      <div class="spacer"></div>
      <div id="screen" v-if="problem">
        <h1 id="problem">{{ operationString(problem) }}</h1>
        <h1 id="solution" :class="{ correct: isSolved }">{{ input.length > 0 ? input : '?' }}</h1>
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
@use '@design-tokens/palette';

section.input {
  #screen {
    max-width: pads.$pad-max-width;
    
    h1 {
      margin: 0;
      text-align: right;
      
      &#solution {
        @include palette.color-attribute('color', 'tertiary-body');
        
        &.correct {
          @include palette.color-attribute('color', 'green');
        }
      }
    }
  }
}
</style>
