<script setup lang="ts">
import { Icon } from '@/assets/design-tokens/iconography';
import { OperationModality } from '@/models/game';
import { modalityIcon } from '@/utils/game.utils';
// import { localizedString } from '@/utils/localization.utils';
import VuetySegmentedButton from '@vueties/components/buttons/VuetySegmentedButton.vue';
import type { VuetySegmentedButtonSegment } from '@vueties/components/buttons/view-models'

defineProps<{
  choice?: OperationModality
}>()

const emits = defineEmits<{
  select: [choice?: OperationModality]
}>()

const segments: VuetySegmentedButtonSegment<OperationModality | undefined>[] = [
  OperationModality.Visual, 
  OperationModality.Aural, 
  undefined
].map(m => {
  return {
    key: m,
    label: '',
    icon: m ? modalityIcon(m) : Icon.ArrowShuffle
  }
})
</script>

<template>
  <div class="wrapper">
    <VuetySegmentedButton 
      :choice="choice"
      :segments="segments"
      @select="(modality) => emits('select', modality)"
    />
    
    <!-- <div id="modality-level" class="caption">
      <strong>{{ localizedString('title-level-abbr') }} 2</strong>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
@use '@vueties/utils/vuetystrap' as vs;

.wrapper {
  position: relative;
}

// #modality-level {
//   text-transform: uppercase;
//   transform: translate(-50%, 1.25rem);
//   @include vs.position(absolute, null, null, 0, 50%);
//   @include vs.color-attribute('color', vs.$accessory-color);
// }
</style>
