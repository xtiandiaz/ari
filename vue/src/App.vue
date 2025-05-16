<script setup lang="ts">
import GameView from './views/GameView.vue'
import NavigationBar from './vueties/bars/NavigationBar.vue';
import NavigationalView from './vueties/views/NavigationalView.vue';
import { Icon } from '@design-tokens/iconography'

function onRouteSelected(key: string) {
  console.log(key)
}
</script>

<template>
  <NavigationalView>
    <template v-slot:bar>
      <NavigationBar 
        :vm="{
          isVisible: true,
          rightBarItems: [
            { icon: Icon.Stats, isEnabled: false, routeKey: 'stats' }
          ]
        }"
        @route-selected="onRouteSelected"
      />
    </template>
    <template v-slot:view>
      <GameView />
    </template>
  </NavigationalView>
</template>
