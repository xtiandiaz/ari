import type { RawDailyStats, DailyStats, Records } from '@/models/stats'
import { LocalStorageItemKey } from '@/models/persistence'
import statsStore from '@/stores/stats'
import { retrieve, save } from '@/assets/tungsten/local-storage'
import '@/assets/tungsten/extensions/date.extensions'

function retrieveSavedDailyStats(): DailyStats | undefined {
  const rawStats = retrieve(LocalStorageItemKey.DailyStats) as RawDailyStats
  if (!rawStats) {
    return undefined
  }
  
  return {
    date: new Date(rawStats.date),
    operatorsStats: rawStats.operatorsStats
  }
}

export function retrieveActiveDailyStats(): DailyStats | undefined {
  const savedDailyStats = retrieveSavedDailyStats()
  
  if (savedDailyStats && (new Date()).getDaysFrom(savedDailyStats.date) >= 1) {
    return undefined
  }
  
  return savedDailyStats
}

export function retrieveSavedRecords(): Records | undefined {
  return retrieve(LocalStorageItemKey.Records) as Records
}

export function saveScore() {
  const stats = statsStore()
  
  save(LocalStorageItemKey.DailyStats, stats.dailyStats)
}

export function saveRecords() {
  const stats = statsStore()
  
  save(LocalStorageItemKey.Records, stats.records)
}

export function clearScore() {
  const stats = statsStore()
  
  stats.dailyStats = {
    date: Date.today(),
    operatorsStats: []
  }
  
  saveScore()
}

export function clearScoreIfNeeded(): boolean {
  const stats = statsStore()
  
  const dateDifference = (new Date()).getDaysFrom(stats.dailyStats.date)
  if (dateDifference < 1) {
    return false
  }
  
  clearScore()
  
  return true
}

export function clearRecords() {
  const stats = statsStore()
  
  stats.records = {
    operatorsRecords: []
  }
  
  saveRecords()
}
