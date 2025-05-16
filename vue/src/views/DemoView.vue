<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { type Operation } from '@/models/math';
import { operationResult, randomOperation } from '@/utils/math.utils';
import { operatorIcon } from '@/view-models/vm-math';
import NumberPad from '@vueties/pads/NumberPad.vue';
import NavigationBar from '@vueties/bars/NavigationBar.vue'
import SvgIcon from '@vueties/misc/SvgIcon.vue';
import { Icon } from '@design-tokens/iconography';

const problem = ref<Operation>()
const resetInterval = ref<number>()
const isSolved = computed(() => problem.value && Number(input.value) === operationResult(problem.value))
const isLocked = computed(() => resetInterval.value !== undefined)

const input = ref('')

function reset() {
  clearInterval(resetInterval.value)
  
  problem.value = randomOperation()
  
  input.value = ''
  
  resetInterval.value = undefined
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
  
  if (isSolved.value) {    
    resetInterval.value = Number(setInterval(() => {
      reset()
    }, 250))
  }
}

function onRouteSelected(key: string) {
  switch (key) {
    case 'reset':
      reset()
      break
  }
}

onMounted(() => {
  reset()
  console.log(problem.value)
})
</script>

<template>
  <NavigationBar 
    :vm="{
      isVisible: true,
      leftBarItems: [
        { icon: Icon.ArrowReset, isEnabled: true, routeKey: 'reset' }
      ],
      rightBarItems: [
        { icon: Icon.Stats, isEnabled: false, routeKey: 'stats' }
      ]
    }"
    @route-selected="onRouteSelected"
  />
  
  <main class="demo">
    <section class="input">
      <div class="spacer"></div>
      <div id="screen" v-if="problem">
        <div id="problem" class="line">
          <h1>{{ problem.operands[0] }}</h1>
          <SvgIcon 
            :icon="operatorIcon(problem.operator)"
            :class="problem.operator.toLowerCase()"
          />
          <h1>{{ problem.operands[1] }}</h1>
        </div>
        <div 
          id="solution" 
          class="line" :class="{ correct: isSolved }"
        >
          <!-- <h2>=</h2> -->
          <h1>{{ input.length > 0 ? input : '?' }}</h1>
          <SvgIcon v-if="isSolved" :icon="Icon.Right" />
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
@use '@design-tokens/palette';
@use '@design-tokens/typography';

section.input {
  #screen {
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
      
      &#problem {
        .svg-icon {
          &.addition {
            @include palette.color-attribute('color', 'sky-blue');  
          }
          &.division {
            @include palette.color-attribute('color', 'purple');
          }
          &.multiplication {
            @include palette.color-attribute('color', 'blue');
          }
          &.subtraction {
            @include palette.color-attribute('color', 'pink');
          }
        }
      }
      
      &#solution {
        &.correct {
          * {
            @include palette.color-attribute('color', 'green');
          }
        }
        
        h1, h2 {
          @include palette.color-attribute('color', 'tertiary-body');
        }
        
        .svg-icon {
          @extend h3;
          @include palette.color-attribute('color', 'green');
        }
      }
    }
  }
}
</style>
