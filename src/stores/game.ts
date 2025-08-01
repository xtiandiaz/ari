import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Language, OperationModality, allOperators } from '@/enums'
import type { Settings } from '@/models'
import { retrieveSavedSettings } from '@/services/settings-management'

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
