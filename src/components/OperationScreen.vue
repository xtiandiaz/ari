<script setup lang="ts">
import { computed } from 'vue';
import { Operator, type Operation } from '@/models/math';
import { operatorIcon } from '@/view-models/math.vm'
import SvgIcon from '@vueties/components/misc/VuetySvgIcon.vue';
import { clamp } from '@/assets/tungsten/math';
import { isMobile } from '@/assets/tungsten/navigator';

const { operation } = defineProps<{
  operation: Operation
  input: string
  isInputCorrect: boolean
}>()

interface Layout {
  maxDigitCountPerLine: number
  responsiveWidth: string
}

const maxDigitCountSingleLineOperation = isMobile() ? 8 : 12

const layout = computed<Layout>(() => {  
  const digitCounts = operation?.operands.map(o => o.toString().length)  
  const digitTotal = digitCounts.reduce((sum, odc) => sum + odc, 0)
  
  if (operation.operator !== Operator.Percent && digitTotal <= maxDigitCountSingleLineOperation) {
    return { 
      maxDigitCountPerLine: Math.min(digitTotal, maxDigitCountSingleLineOperation), 
      responsiveWidth: 'fit-content'
    }
  } else {
    return { 
      maxDigitCountPerLine: Math.max(...digitCounts),
      responsiveWidth: 'min-content' 
    }
  }
})

const operationFontSize = computed(() => {
  const _layout = layout.value
  
  const operationViewport = document.getElementById('operation-viewport')!
  const operationViewportWidth = operationViewport.clientWidth
  const maxFontSizeEm = 3.25
  const rawFontSizeEm = operationViewportWidth / _layout.maxDigitCountPerLine / 16
  
  // console.log(
  //   'viewportWidth:', operationViewportWidth, 
  //   'layout:', _layout,
  //   'rawFontSizeEm:', rawFontSizeEm,
  //   'maxFontSizeEm:', maxFontSizeEm, 
  // )
  
  return `${clamp(rawFontSizeEm, 2, maxFontSizeEm)}em`
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
  padding-left: 0;
  padding-right: 0;
  
  #operation {
    font-family: 'Inter Medium', sans-serif;
    font-size: v-bind(operationFontSize);
    width: v-bind('layout.responsiveWidth');
    
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
