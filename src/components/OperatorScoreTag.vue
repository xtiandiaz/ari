<script setup lang="ts">
import { Operator } from '@/models/math';
import { operatorIcon } from '@/view-models/math.vm';
import VuetyTag from '@/vueties/components/misc/VuetyTag.vue';

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
