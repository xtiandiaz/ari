<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useRecordsStore from '@/stores/records'
import OperatorScoreTag from '@/components/OperatorScoreTag.vue';
import VuetySvgIcon from '@vueties/components/misc/VuetySvgIcon.vue';
import { localizedString } from '@/utils/localization.utils';
import '@/assets/tungsten/extensions/array.extensions'
// import { Icon } from '@/assets/design-tokens/iconography';
import { modalityIcon } from '@/utils/game.utils';

const route = useRoute()
const records = useRecordsStore()

onMounted(() => {
  route.meta.setTitle(localizedString('title-daily-records'), false)
})
</script>

<template>
  <main>
    <section id="level-cards">
      <div 
        v-for="(level) of records.levels"
        :class="['card', { best: level.value > 0 && level.value >= level.best }]"
        :key="level.modality"
      >
        <div class="modality">
          <!-- <VuetySvgIcon class="crown" :icon="Icon.Crown" /> -->
          <VuetySvgIcon :icon="modalityIcon(level.modality)" />
        </div>
        <span class="caption">{{ localizedString('title-level') }}</span>
        <h1>{{ level.value }}</h1>
        <span class="caption">{{ localizedString('title-personal-best') }} <span class="h6">{{ level.best }}</span></span>
        <div class="tags">
          <OperatorScoreTag
            v-for="(score) in level.operatorScores"
            class="small"
            :key="score.operator"
            :operator="score.operator"
            :score="score.value"
          />
        </div>
      </div>
    </section>
    
    <section class="footnote">
      {{ localizedString('text-about-scores') }}
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '@vueties/utils/vuetystrap' as vs;
@use '@vueties/components/form/styles' as form-styles;
@use '@/assets/math';

main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-top: 1em;
  max-width: form-styles.$max-width;
  padding: 0 1em;
}

section#level-cards {
  $cards-gap: 0.5em;
  
  display: flex;
  gap: $cards-gap;
  
  > * {
    @include vs.color-attribute('background-color', vs.$background-color);
  }
  
  .card {
    border-radius: 1em;
    display: flex;
    flex: 1 1 calc(50% - $cards-gap);
    flex-direction: column;
    overflow: hidden;
    padding: 1.25em;
    position: relative;
    
    &.best {
      border: 2px solid;
      @include vs.color-attribute('border-color', 'yellow', 0.25);
      
      &, .caption, .modality .svg-icon {
        @include vs.color-attribute('color', 'yellow');
      }
    }
    
    h1 {
      margin: 0;
    }
    
    .modality {
      @include vs.size(2.5rem);
      @include vs.position(absolute, 0.5rem, 0.5rem);
      
      .svg-icon {        
        @include vs.size(100%);
        @include vs.color-attribute('color', vs.$accessory-color);
      }
    }
    
    .caption {
      text-transform: uppercase;
      letter-spacing: 0.1em;
      @include vs.color-attribute('color', vs.$secondary-body-color);
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25em;
      margin-top: 1em;
    }
  }
}

.footnote {
  margin: 0 1em;
  @include vs.caption();
  @include vs.color-attribute('color', vs.$tertiary-body-color);
}
</style>
