import type { RawDailyScore, DailyScore } from '@/models/score'
import { LocalStorageItemKey } from '@/models/persistence'
import scoreStore from '@/stores/score'
import { retrieve, save } from '@/assets/tungsten/local-storage'
import '@/assets/tungsten/extensions/date.extensions'

function retrieveSavedDailyScore(): DailyScore | undefined {
  const rawDailyScore = retrieve(LocalStorageItemKey.DailyScore) as RawDailyScore
  if (!rawDailyScore) {
    return undefined
  }
  
  return {
    date: new Date(rawDailyScore.date),
    operatorsScores: rawDailyScore.operatorsScores
  }
}

export function retrieveActiveDailyScore(): DailyScore | undefined {
  const savedDailyScore = retrieveSavedDailyScore()
  
  if (savedDailyScore && (new Date()).getDaysFrom(savedDailyScore.date) >= 1) {
    return undefined
  }
  
  return savedDailyScore
}

export function saveScore() {
  const score = scoreStore()
  
  save(LocalStorageItemKey.DailyScore, score.dailyScore)
}

export function clearScore() {
  const score = scoreStore()
  
  score.resetOperatorScores()
  
  saveScore()
}

export function clearScoreIfNeeded(): boolean {
  const score = scoreStore()
  
  const dateDifference = (new Date()).getDaysFrom(score.dailyScore.date)
  if (dateDifference < 1) {
    return false
  }
  
  clearScore()
  
  return true
}

export function resetRecords() {
  const score = scoreStore()
  
  score.resetOperatorRecords()
  
  saveScore()
}
