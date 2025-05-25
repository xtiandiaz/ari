import type { RawDailyScore, DailyScore } from '@/models/score'
import { LocalStorageItemKey } from '@/models/persistence'
import scoreStore from '@/stores/score'
import { retrieve, save } from '@/assets/tungsten/local-storage'
import '@/assets/tungsten/extensions/date.extensions'

export function retrieveActiveDailyScore(): DailyScore {
  const rawDailyScore = retrieve(LocalStorageItemKey.DailyScore) as RawDailyScore
  if (!rawDailyScore) {
    return {
      date: Date.today(),
      operatorsScores: []
    }
  }
  
  const savedDate = new Date(rawDailyScore.date)
  const isStale = (new Date()).getDaysFrom(savedDate) >= 1
  
  if (isStale) {
    rawDailyScore.operatorsScores.forEach(os => os.score = 0)
  }
  
  return {
    date: isStale ? Date.today() : savedDate,
    operatorsScores: rawDailyScore.operatorsScores
  }
}

export function saveScore() {
  const score = scoreStore()
  
  score.dailyScore.date = Date.today()
  
  save(LocalStorageItemKey.DailyScore, score.dailyScore)
}

export function clearScore() {
  const score = scoreStore()
  
  score.dailyScore.operatorsScores.forEach(os => os.score = 0)
  
  saveScore()
}

export function clearScoreIfNeeded(): boolean {
  const score = scoreStore()
  const isStale = (new Date()).getDaysFrom(score.dailyScore.date) >= 1
  
  if (isStale) {
    clearScore()
  }
  
  return isStale
}

export function resetRecords() {
  const score = scoreStore()
  
  score.dailyScore.operatorsScores.forEach(os => os.record = Math.max(0, os.score))
  
  saveScore()
}
