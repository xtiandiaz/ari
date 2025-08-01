<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
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
import { languageSelection, localizedString, localizedStringInLanguage } from '@/utils/localization.utils'
import { version } from '@/../package.json'

const route = useRoute()
const settings = useGameStore().settings
const records = useRecordsStore()

const languageOptions: VuetySelectionOption<Language>[] = languageSelection.map(l => { 
  return { title: localizedStringInLanguage('language-name', l), value: l } 
})

watch(() => settings.language, () => {
  route.meta.setTitle(localizedString('title-settings'), false)
}, { immediate: true })

onBeforeUnmount(() => {
  saveSettings()
})
</script>

<template>
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
</template>

<style scoped lang="scss">
@use '@vueties/utils/vuetystrap' as vs;

main {
  text-align: center;
  
  .version {
    @extend %caption;
    @include vs.color-attribute('color', vs.$tertiary-body-color);
  }
}
</style>
