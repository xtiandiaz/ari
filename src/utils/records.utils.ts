import { OperationModality, allOperators, allModalitiesInPlayabilityOrder } from '@/enums'
import type { DailyRecords, PersonalBests, OperatorScore, Level } from '@/models'
import useGameStore from '@/stores/game'

export function calculateLevel(operatorScores: OperatorScore[], modality: OperationModality): Level {
  const game = useGameStore()
  const operatorScoresInModality = operatorScores.filter(os => os.modality === modality)
  
  return {
    modality,
    value: Math.ceil(operatorScoresInModality.reduce((acc, os) => acc + os.value, 0) / game.levelScoreWeight)
  }
}

export function fillInDailyRecords(dailyRecords: DailyRecords): DailyRecords {
  allOperators.forEach(operator => {
    allModalitiesInPlayabilityOrder.forEach(modality => {
      const operatorScoreIndex = dailyRecords.operatorScores
        .findIndex(os => os.operator === operator && os.modality === modality)
      
      if (operatorScoreIndex < 0) {
        dailyRecords.operatorScores.push({ modality, operator, value: 0 })
      }
    })
  })
  
  return dailyRecords
}

export function fillInPersonalBests(personalBests: PersonalBests, dailyRecords: DailyRecords): PersonalBests {
  dailyRecords.operatorScores.forEach(os => {
    const personalBest = personalBests.operatorScores.find(
      pbos => pbos.operator === os.operator && pbos.modality === os.modality
    )
    if (personalBest) {
      personalBest.value = Math.max(personalBest.value, os.value)
    } else {
      personalBests.operatorScores.push(os)
    }
  })
  
  allModalitiesInPlayabilityOrder.forEach(modality => {
    const personalBestLevel = personalBests.levels.find(pbl => pbl.modality === modality)
    const dailyLevel = calculateLevel(dailyRecords.operatorScores, modality)
    
    if (personalBestLevel) {
      personalBestLevel.value = Math.max(personalBestLevel.value, dailyLevel.value)
    } else {
      personalBests.levels.push(dailyLevel)
    }
  })
  
  return personalBests
}
