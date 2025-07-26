import { allOperators } from '@/models/math'
import { allModalities } from '@/models/game'
import { type DailyRecords } from '@/models/records'

export function fillInDailyRecords(dailyRecords: DailyRecords): DailyRecords {
  allOperators.forEach(operator => {
    allModalities.forEach(modality => {
      const operatorScoreIndex = dailyRecords.operatorScores
        .findIndex(os => os.operator === operator && os.modality === modality)
      
      if (operatorScoreIndex < 0) {
        dailyRecords.operatorScores.push({ modality, operator, value: 0, best: 0 })
      }
    })
  })
  
  return dailyRecords
}
