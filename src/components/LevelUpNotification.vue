<script setup lang="ts">
import { ref, watch } from 'vue';
import VuetySvgIcon from '@vueties/components/misc/VuetySvgIcon.vue';
import { Icon } from '@/assets/design-tokens/iconography';

const { newLevel, isRecord } = defineProps<{
  newLevel: number
  isRecord: boolean
}>()

const shouldShow = ref(false)
const visibilityInterval = ref<number>()

function hide() {
  shouldShow.value = false
  clearInterval(visibilityInterval.value)
}

watch(() => newLevel, (value, oldValue) => {
  shouldShow.value = value > oldValue
  
  if (shouldShow.value) {
    visibilityInterval.value = Number(setInterval(() => hide(), 2000))
  }
})
</script>

<template>
  <Transition>
    <div v-if="shouldShow" id="level-up-notification">
      <div class="spacer"></div>
      <div class="content-wrapper">
        <span class="headline">
          {{ isRecord ? "New record!" : "Level up!" }}
        </span>
        <VuetySvgIcon :icon="isRecord ? Icon.Crown : Icon.Medal" />
      </div>
      <div class="spacer"></div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@use '@design-tokens/typography';
@use '@design-tokens/palette';

div#level-up-notification {
  align-items: center;
  display: flex;
  flex-direction: column;
  
  .content-wrapper {
    align-items: center;
    display: flex;
    gap: 0.5em;
    
    .svg-icon {
      width: 1.5em;
    }
  }
  
  span {
    letter-spacing: 0.1em;
    text-transform: uppercase;
    @include palette.color-attribute('color', 'yellow');
    
    &.headline {
      @extend .strong;
    }
    
    &.caption {
      @extend .caption;
    }
  }
}

.v-enter-active {
  $duration: 0.25s;
  $easing: ease;
  
  transition: opacity $duration $easing;
  
  .content-wrapper {
    transition: transform $duration $easing;
  }
}

.v-leave-active {
  transition: opacity 1s linear;
}

.v-enter-from {
  opacity: 0;
  
  .content-wrapper {
    transform: translateY(1em);
  }
}

.v-leave-to {
  opacity: 0;
  
  .content-wrapper {
    transform: none;
  }
}
</style>
