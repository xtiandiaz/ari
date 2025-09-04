<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { OperationModality, Operator } from '@/enums';
import type { Operation } from '@/models';
import useGameStore from '@/stores/game'
import SvgIcon from '@vueties/components/misc/VuetySvgIcon.vue';
import VuetyIconButton from '@/vueties/components/buttons/VuetyIconButton.vue';
import { useUtterer } from '@vueties/composables/utterer';
import { interpolatedLocalizedString, preferredSpeechLanguageCode } from '@/utils/localization.utils';
import { operatorIcon } from '@/utils/game.utils';
import { isMobile } from '@/assets/tungsten/navigator';
import { clamp } from '@/assets/tungsten/math';
import { Icon } from '@design-tokens/iconography';

const { operation } = defineProps<{
  operation: Operation
  input: string
  isInputCorrect: boolean
}>()

const settings = useGameStore().settings
const utterer = useUtterer()

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

function utterOperation() {
  _utterOperation(operation)
}

function _utterOperation(operation: Operation) {
  if (operation.modality === OperationModality.Aural) {
    utterer.utter(
      interpolatedLocalizedString('operation', operation), 
      preferredSpeechLanguageCode(settings.language),
      settings.utteranceSpeed ?? 1
    )
  }
}

watch([() => operation, () => settings.utteranceSpeed, () => settings.language], ([newOperation]) => {
  _utterOperation(newOperation)
})

onMounted(() => {
  utterOperation()
})

defineExpose({
  utterOperation
})
</script>

<template>
  <section id="operation-viewport">
    <div class="flex-spacer"></div>
    
    <div 
      v-if="operation" 
      id="operation"
      :class="{ aural: operation.modality === OperationModality.Aural }"
    >
      <div 
        v-if="operation.modality === OperationModality.Visual"
        id="operands-and-operator" 
        :class="operation.operator.toLowerCase()"
      >
        <span id="first-operand">{{ operation.operands[0].toLocaleString() }}</span>
        <div id="operator-and-second-operand">
          <SvgIcon id="operator" :icon="operatorIcon(operation.operator)" />
          <span id="second-operand">{{ operation.operands[1].toLocaleString() }}</span>
        </div>
      </div>
      
      <VuetyIconButton 
        v-else 
        id="utterance-button"
        :class="['filled', { disabled: utterer.isUttering.value }]"
        :icon="Icon.EarWaves" 
        @click="_utterOperation(operation)"
      />
      
      <span id="result" :class=" { isCorrect: isInputCorrect }">
        {{ input.length > 0 ? Number(input).toLocaleString() : '?' }}
      </span>
    </div>
    
    <div class="flex-spacer"></div>
    
  </section>  
</template>

<style scoped lang="scss">
@use '@vueties/utils/vuetystrap' as vs;
@use '@/assets/math';

section#operation-viewport {
  padding-left: 0;
  padding-right: 0;
  
  * {
    line-height: 1.25;
    text-align: right;
  }
  
  #operation {
    display: flex;
    flex-direction: column;
    font-family: 'Inter Medium', sans-serif;
    font-size: v-bind(operationFontSize);
    width: v-bind('layout.responsiveWidth');
    
    &.aural {
      align-items: center;
      gap: 0.5rem;
      
      #utterance-button {
        @include vs.size(6rem);
      }
    }
    
    #operands-and-operator {
      $gap: 0.25rem;
      
      column-gap: $gap;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: right;
      
      #operator {
        @include vs.size(v-bind(operationFontSize));
      }
      
      #operator-and-second-operand {
        align-items: center;
        column-gap: $gap;
        display: flex;
        flex-direction: row;
      }
      
      &.percent {
        flex-direction: column;
        
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
      @include vs.color-attribute('color', vs.$tertiary-body-color);
      
      &.isCorrect {
        @include vs.color-attribute('color', 'green');
      }
    }
  }
}
</style>
