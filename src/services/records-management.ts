import type { RawDailyRecords, DailyRecords, PersonalBests } from '@/models'
import useRecordsStore from '@/stores/records'
import { retrieve, save } from '@/assets/tungsten/local-storage'
import '@/assets/tungsten/extensions/date.extensions'

const dailyRecordsKey = 'daily-records'
const personalBestsKey = 'personal-bests'

export function retrieveDailyRecords(): DailyRecords {
  const rawDailyRecords = retrieve< RawDailyRecords>(dailyRecordsKey)
  if (!rawDailyRecords) {
    return {
      date: Date.today(),
      operatorScores: []
    }
  }
  
  const savedDate = new Date(rawDailyRecords.date)
  const isStale = (new Date()).getDaysFrom(savedDate) >= 1
  
  if (isStale) {
    rawDailyRecords.operatorScores?.forEach(os => os.value = 0) 
  }
  
  return {
    date: isStale ? Date.today() : savedDate,
    operatorScores: rawDailyRecords.operatorScores ?? []
  }
}

export function retrievePersonalBests(): PersonalBests {
  const personalBests = retrieve<PersonalBests>(personalBestsKey)
  if (!personalBests) {
    return {
      levels: [],
      operatorScores: []
    }
  }
  
  return personalBests
}

export function saveRecords() {
  const records = useRecordsStore()
  
  records.dailyRecords.date = Date.today()
  
  save(dailyRecordsKey, records.dailyRecords)
  save(personalBestsKey, records.personalBests)
}

export function clearScores() {
  const dailyRecords = useRecordsStore().dailyRecords
  
  dailyRecords.operatorScores.forEach(os => os.value = 0)
  
  saveRecords()
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
  const records = useRecordsStore()
  
  records.personalBests.levels = records.levels
  records.personalBests.operatorScores = records.dailyRecords.operatorScores
  
  saveRecords()
}
