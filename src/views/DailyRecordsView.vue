<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import OperatorScoreTag from '@/components/OperatorScoreTag.vue';
import VuetySvgIcon from '@vueties/components/misc/VuetySvgIcon.vue';
import { localizedString } from '@/utils/localization.utils';
import { composeLevelCards, modalityIcon } from '@/utils/game.utils';
import '@/assets/tungsten/extensions/array.extensions'

const route = useRoute()

onMounted(() => {
  route.meta.setTitle(localizedString('title-daily-records'), false)
})
</script>

<template>
  <main>
    <section id="level-cards">
      <div 
        v-for="(card) of composeLevelCards()"
        :class="['card', { best: card.level > 0 && card.level >= card.personalBest }]"
        :key="card.modality"
      >
        <div class="modality">
          <VuetySvgIcon :icon="modalityIcon(card.modality)" />
        </div>
        <span class="caption">{{ localizedString('title-level') }}</span>
        <h1>{{ card.level }}</h1>
        <span class="caption">{{ localizedString('title-personal-best') }} <span class="h6">{{ card.personalBest }}</span></span>
        <div class="tags">
          <OperatorScoreTag
            v-for="(score) in card.operatorScores"
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
      &, .caption, .modality .svg-icon {
        @include vs.color-attribute('color', 'yellow');
      }
      
      .svg-icon {
        opacity: 0.75;
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
