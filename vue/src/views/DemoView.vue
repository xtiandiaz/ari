<script setup lang="ts">
import { ref } from 'vue'
import NumberPad from '@vueties/pads/NumberPad.vue';

const input = ref<number>()

function onInput(value: number) {
  input.value = value >= 0 ? value : undefined
}
</script>

<template>
  <main class="demo">
    <section><h1>{{ input }}</h1></section>
    <section>
      <NumberPad @input="onInput" />
    </section>
  </main>
</template>
