<script setup lang="ts">
import { computed } from 'vue';
import { Operator, type Operation } from '@/models/math';
import { operatorIcon } from '@/view-models/math.vm'
import SvgIcon from '@vueties/components/misc/VuetySvgIcon.vue';
import { clamp } from '@/assets/tungsten/math';
import { isMobile } from '@/assets/tungsten/navigator';

const { operation } = defineProps<{
  operation?: Operation
  input: string
  isInputCorrect: boolean
}>()

const operandsDigitCount = computed(() => operation?.operands.map(o => o.toString().length))
const operandsDigitTotal = computed(() => operandsDigitCount.value?.reduce((sum, odc) => sum + odc, 0) ?? 0)

const maxOperationDigitCountSingleRow = isMobile() ? 8 : 12
const operationResponsiveWidth = computed(() => {
  switch (operation?.operator) {
    case Operator.Percent:
      return 'min-content'
    default:
      return operandsDigitTotal.value <= maxOperationDigitCountSingleRow ? 'fit-content' : 'min-content'
  }
})

const operationFontSize = computed(() => {
  const operationViewport = document.getElementById('operation-viewport')!
  const operationViewportWidth = operationViewport.clientWidth
  const maxFontSizeEm = Math.min(3.5, operationViewportWidth / 8 / 16)
  const maxDigitTotal = Math.floor(operationViewportWidth / (maxFontSizeEm * 16))
  const maxDigitCount = operationResponsiveWidth.value === 'fit-content' 
    ? Math.min(operandsDigitTotal.value, maxDigitTotal)
    : Math.max(...(operandsDigitCount.value ?? [maxDigitTotal]))
  const rawSize = operationViewportWidth / maxDigitCount / 16
  
  // console.log(
  //   'width:', operationViewportWidth, 
  //   'maxDigitCount:', maxDigitCount, 
  //   'maxDigitTotal:', maxDigitTotal, 
  //   'rawSize:', rawSize,
  //   'maxFontSizeEm:', maxFontSizeEm, 
  // )
  
  return `${clamp(rawSize, 2, maxFontSizeEm)}em`
})
</script>

<template>
  <section id="operation-viewport">
    <div class="spacer"></div>
    <div id="operation" v-if="operation">
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
</template>

<style scoped lang="scss">
@use '@vueties/utils/styles';
@use '@design-tokens/palette';
@use '@/assets/math';

section#operation-viewport {  
  #operation {
    font-family: 'Inter Medium', sans-serif;
    font-size: v-bind(operationFontSize);
    width: v-bind(operationResponsiveWidth);
    
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
        flex-direction: row;
      }
      
      &.percent {
        #operator-and-second-operand {
          @extend .operator-colored-item;
          column-gap: 0;
          flex-direction: row-reverse;
          
          ::after {
            content: '%';
          }
          
          #operator {
            display: none;
          }
        }
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
</style>
