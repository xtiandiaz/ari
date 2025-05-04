<script setup lang="ts">
import { ref } from 'vue'
import * as Randomness from '@/assets/tungsten/randomness'

const randomInt = ref(Randomness.integer(0, 1000))
</script>

<template>
  <main>
    <h1>{{ randomInt }}</h1>
  </main>
</template>

<style scoped lang="scss">
</style>
