import { ref } from 'vue'
import { defineStore } from 'pinia'
import { allOperators } from '@/models/math'
import type { Settings } from '@/models/settings'
import { retrieveSavedSettings } from '@/services/settings-management'
import { Language } from '@/models/localization'
import { OperationModality } from '@/models/game'

const defaultSettings: Settings = {
  language: Language.English,
  modality: OperationModality.Visual
}

export default defineStore('game', () => {
  const settings = ref(retrieveSavedSettings() ?? defaultSettings)
  
  const playableOperators = allOperators
  const levelScoreWeight = 10
  
  return {
    settings,
    levelScoreWeight,
    playableOperators,
  }
})
