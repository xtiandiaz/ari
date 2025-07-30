import type { RawDailyRecords, DailyRecords } from '@/models/records'
import useRecordsStore from '@/stores/records'
import { retrieve, save } from '@/assets/tungsten/local-storage'
import '@/assets/tungsten/extensions/date.extensions'

const dailyRecordsKey = 'daily-records'

export function retrieveDailyRecords(): DailyRecords {
  const rawDailyRecords = retrieve(dailyRecordsKey) as RawDailyRecords
  if (!rawDailyRecords) {
    return {
      date: Date.today(),
      operatorScores: [],
    }
  }
  
  const savedDate = new Date(rawDailyRecords.date)
  const isStale = (new Date()).getDaysFrom(savedDate) >= 1
  
  if (isStale) {
    rawDailyRecords.operatorScores = undefined
  }
  
  return {
    date: isStale ? Date.today() : savedDate,
    operatorScores: rawDailyRecords.operatorScores ?? [],
  }
}

export function saveScores() {
  const dailyRecords = useRecordsStore().dailyRecords
  
  dailyRecords.date = Date.today()
  
  save(dailyRecordsKey, dailyRecords)
}

export function clearScores() {
  const dailyRecords = useRecordsStore().dailyRecords
  
  dailyRecords.operatorScores.forEach(os => os.value = 0)
  
  saveScores()
}

export function clearScoresIfNeeded(): boolean {
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
