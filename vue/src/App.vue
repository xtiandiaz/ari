<script setup lang="ts">
import HashRouterScene from '@/hash-router/scenes/HashRouterScene.vue'
import { Icon } from '@design-tokens/iconography'
</script>

<template>
  <HashRouterScene 
    :navigationBarVM="{
      isVisible: true,
      rightBarItems: [
        { icon: Icon.Stats, isEnabled: false, routeKey: 'stats' }
      ]
    }"
  />
</template>
