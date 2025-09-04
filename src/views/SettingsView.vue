<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Language, OperationModality } from '@/enums'
import useRecordsStore from '@/stores/records'
import useGameStore from '@/stores/game'
import { clearScores, clearPersonalBests } from '@/services/records-management'
import { saveSettings } from '@/services/settings-management'
import VuetyForm from '@vueties/components/form/VuetyForm.vue'
import VuetyFormSection from '@vueties/components/form/VuetyFormSection.vue'
import VuetyButtonFormRow from '@vueties/components/form/rows/VuetyButtonFormRow.vue'
import VuetySegmentedButtonFormRow from '@vueties/components/form/rows/VuetySegmentedButtonFormRow.vue'
import VuetyNavigationalView from '@/vueties/views/VuetyNavigationalView.vue'
import { closeNavBarItem } from '@/vueties/components/shared/view-models'
import type { VuetySelectionOption } from '@vueties/components/shared/view-models'
import VuetySelectionFormSection from '@/vueties/components/form/VuetySelectionFormSection.vue'
import VuetyRangeSliderFormRow from '@/vueties/components/form/rows/VuetyRangeSliderFormRow.vue'
import { languageSelection, localizedString, localizedStringInLanguage } from '@/utils/localization.utils'
import { modalityIcon } from '@/utils/game.utils'
import { Icon } from '@/assets/design-tokens/iconography'
import { version } from '@/../package.json'

const game = useGameStore()
const { settings } = storeToRefs(game)
const records = useRecordsStore()

const modalityOptions: VuetySelectionOption<OperationModality | undefined>[] = [
  OperationModality.Visual,
  OperationModality.Aural,
  undefined
].map(m => {
  if (m) {
    return { title: localizedString(`modality-${m}`), value: m, icon: modalityIcon(m) }
  } else {
    return { title: localizedString('modality-shuffled'), value: undefined, icon: Icon.ArrowShuffle }
  }
})

const modality = ref([settings.value.modality])

const languageOptions: VuetySelectionOption<Language>[] = languageSelection.map(l => { 
  return { title: localizedStringInLanguage('language-name', l), value: l } 
})

watch(modality, (newValue) => {
  settings.value.modality = newValue.first()
}, { deep: true })

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
        <VuetySelectionFormSection
          v-model="modality"
          :choice-range="{ min: 1, max: 1 }"
          :options="modalityOptions"
          :title="localizedString('title-modality')"
        />
        <VuetyFormSection
          v-if="settings.modality !== OperationModality.Visual"
          :title="localizedString('title-utterance-speed')"
        >
          <VuetyRangeSliderFormRow
            v-model="settings.utteranceSpeed"
            :range="{ min: 0.5, max: 2 }"
            :step="0.1"
            :min-icon="Icon.Tortoise"
            :max-icon="Icon.Hare"
          />
        </VuetyFormSection>
        <VuetyFormSection :title="localizedString('title-language')">
          <VuetySegmentedButtonFormRow
            v-model="settings.language"
            :options="languageOptions"
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
