<script setup lang="ts">
import { Operator } from '@/enums';
import VuetyTag from '@/vueties/components/misc/VuetyTag.vue';
import { operatorIcon } from '@/utils/game.utils';

defineProps<{
  operator: Operator,
  score: number
}>()
</script>

<template>
  <VuetyTag 
    :class="operator.toLowerCase()"
    :icon="operatorIcon(operator)" 
    :label="score.toString()" 
  />
</template>

<style scoped lang="scss">
@use '@/assets/math';

@include math.color-tags();
</style>
