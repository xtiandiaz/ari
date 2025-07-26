import { defineStore } from 'pinia'
import { Language } from '@/models/localization'
import { allOperators, Operator } from '@/models/math'

export default defineStore('settings', () => {
  const language = Language.English
  
  const playableOperators = allOperators
  const levelScoreWeight = 10
  
  return {
    language,
    levelScoreWeight,
    playableOperators,
  }
})
