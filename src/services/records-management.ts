import type { RawDailyRecords, DailyRecords } from '@/models/records'
import { LocalStorageItemKey } from '@/models/persistence'
import useRecordsStore from '@/stores/records'
import { retrieve, save } from '@/assets/tungsten/local-storage'
import '@/assets/tungsten/extensions/date.extensions'

export function retrieveActiveDailyRecords(): DailyRecords {
  const rawDailyScores = retrieve(LocalStorageItemKey.DailyScores) as RawDailyRecords
  if (!rawDailyScores) {
    return {
      date: Date.today(),
      operatorScores: [],
    }
  }
  
  const savedDate = new Date(rawDailyScores.date)
  const isStale = (new Date()).getDaysFrom(savedDate) >= 1
  
  if (isStale) {
    rawDailyScores.operatorScores = undefined
  }
  
  return {
    date: isStale ? Date.today() : savedDate,
    operatorScores: rawDailyScores.operatorScores ?? [],
  }
}

export function saveScores() {
  const dailyRecords = useRecordsStore().dailyRecords
  
  dailyRecords.date = Date.today()
  
  save(LocalStorageItemKey.DailyScores, dailyRecords)
}

export function clearScores() {
  const dailyRecords = useRecordsStore().dailyRecords
  
  dailyRecords.operatorScores.forEach(os => os.value = 0)
  
  saveScores()
}

export function clearScoreIfNeeded(): boolean {
  const dailyRecords = useRecordsStore().dailyRecords
  
  const isStale = (new Date()).getDaysFrom(dailyRecords.date) >= 1
  
  if (isStale) {
    clearScores()
  }
  
  return isStale
}

export function clearPersonalBests() {
  const dailyRecords = useRecordsStore().dailyRecords
  
  dailyRecords.operatorScores.forEach(os => os.best = os.value)
  
  saveScores()
}
