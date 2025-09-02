<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { Language } from '@/enums'
import useRecordsStore from '@/stores/records'
import useGameStore from '@/stores/game'
import { clearScores, clearPersonalBests } from '@/services/records-management'
import { saveSettings } from '@/services/settings-management'
import type { VuetySelectionOption } from '@/vueties/components/shared.vm'
import VuetyForm from '@vueties/components/form/VuetyForm.vue'
import VuetyFormSection from '@vueties/components/form/VuetyFormSection.vue'
import VuetyButtonFormRow from '@vueties/components/form/rows/VuetyButtonFormRow.vue'
import VuetySegmentedButtonFormRow from '@vueties/components/form/rows/VuetySegmentedButtonFormRow.vue'
import VuetyNavigationalView from '@/vueties/views/VuetyNavigationalView.vue'
import { languageSelection, localizedString, localizedStringInLanguage } from '@/utils/localization.utils'
import { closeNavBarItem } from '@/vueties/components/shared/view-models'
import { version } from '@/../package.json'
import { storeToRefs } from 'pinia'

const game = useGameStore()
const { settings } = storeToRefs(game)
const records = useRecordsStore()

const languageOptions: VuetySelectionOption<Language>[] = languageSelection.map(l => { 
  return { title: localizedStringInLanguage('language-name', l), value: l } 
})

onBeforeUnmount(() => {
  saveSettings()
})
</script>

<template>
  <VuetyNavigationalView
    :nav-bar-items="[closeNavBarItem('/')]"
    :title="localizedString('title-settings')"
  >
    <main>
      <VuetyForm>
        <VuetyFormSection :title="localizedString('title-language')">
          <VuetySegmentedButtonFormRow
            :choice="settings.language"
            :options="languageOptions"
            @select="(lang) => settings.language = lang"
          />
        </VuetyFormSection>
        
        <div style="height: 2rem"></div>
        
        <VuetyFormSection :footnote="localizedString('text-clear-scores')">
          <VuetyButtonFormRow 
            :label="localizedString('label-clear-scores')" 
            :isDestructive="true"
            :class="{ disabled: !records.hasAnyDailyScore }"
            @click="clearScores()"
          />
        </VuetyFormSection>
        
        <VuetyFormSection :footnote="localizedString('text-clear-records')">
          <VuetyButtonFormRow 
            :label="localizedString('label-clear-records')" 
            :isDestructive="true"
            :class="{ disabled: !records.hasAnyPersonalBest }"
            @click="clearPersonalBests()"
          />
        </VuetyFormSection>
      </VuetyForm>
      <span class='version'>v{{ version }}</span>
    </main>
  </VuetyNavigationalView>
</template>

<style scoped lang="scss">
@use '@vueties/utils/vuetystrap' as vs;

main {
  margin-bottom: 1rem;
  text-align: center;
  
  .version {
    @extend %caption;
    @include vs.color-attribute('color', vs.$tertiary-body-color);
  }
}
</style>
