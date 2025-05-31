import type { RawDailyScores, DailyScores } from '@/models/scores'
import { LocalStorageItemKey } from '@/models/persistence'
import scoresStore from '@/stores/scores'
import { retrieve, save } from '@/assets/tungsten/local-storage'
import '@/assets/tungsten/extensions/date.extensions'

export function retrieveActiveDailyScores(): DailyScores {
  const rawDailyScores = retrieve(LocalStorageItemKey.DailyScores) as RawDailyScores
  if (!rawDailyScores) {
    return {
      date: Date.today(),
      operatorsScores: []
    }
  }
  
  const savedDate = new Date(rawDailyScores.date)
  const isStale = (new Date()).getDaysFrom(savedDate) >= 1
  
  if (isStale) {
    rawDailyScores.operatorsScores.forEach(os => os.score = 0)
  }
  
  return {
    date: isStale ? Date.today() : savedDate,
    operatorsScores: rawDailyScores.operatorsScores
  }
}

export function saveScores() {
  const scores = scoresStore()
  
  scores.dailyScores.date = Date.today()
  
  save(LocalStorageItemKey.DailyScores, scores.dailyScores)
}

export function clearScores() {
  const scores = scoresStore()
  
  scores.dailyScores.operatorsScores.forEach(os => os.score = 0)
  
  saveScores()
}

export function clearScoreIfNeeded(): boolean {
  const scores = scoresStore()
  const isStale = (new Date()).getDaysFrom(scores.dailyScores.date) >= 1
  
  if (isStale) {
    clearScores()
  }
  
  return isStale
}

export function clearRecords() {
  const scores = scoresStore()
  
  scores.dailyScores.operatorsScores.forEach(os => os.record = Math.max(0, os.score))
  
  saveScores()
}
