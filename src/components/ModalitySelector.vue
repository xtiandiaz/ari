<script setup lang="ts">
import { OperationModality } from '@/enums';
import { modalityIcon } from '@/utils/game.utils';
import type { VuetySelectionOption } from '@vueties/components/shared.vm';
import VuetySegmentedButton from '@vueties/components/buttons/VuetySegmentedButton.vue';
import { Icon } from '@/assets/design-tokens/iconography';

defineProps<{
  choice?: OperationModality
}>()

const emits = defineEmits<{
  select: [choice?: OperationModality]
}>()

const options: VuetySelectionOption<OperationModality | undefined>[] = [
  OperationModality.Visual, 
  OperationModality.Aural, 
  undefined
].map(m => {
  return {
    title: '',
    value: m,
    icon: m ? modalityIcon(m) : Icon.ArrowShuffle
  }
})
</script>

<template>
  <div class="wrapper">
    <VuetySegmentedButton 
      :choice="choice"
      :options="options"
      @select="(modality) => emits('select', modality)"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@vueties/utils/vuetystrap' as vs;

.wrapper {
  position: relative;
}
</style>
