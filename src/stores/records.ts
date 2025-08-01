import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Operator, OperationModality, allModalitiesInPlayabilityOrder } from '@/enums'
import type { Operation, Level, OperatorScore } from '@/models'
import { retrieveDailyRecords, retrievePersonalBests } from '@/services/records-management'
import { calculateLevel, fillInDailyRecords, fillInPersonalBests } from '@/utils/records.utils'
import '@/assets/tungsten/extensions/array.extensions'

export default defineStore('records', () => {  
  const dailyRecords = ref(fillInDailyRecords(retrieveDailyRecords()))
  const personalBests = ref(fillInPersonalBests(retrievePersonalBests(), dailyRecords.value))
  
  const levels = computed<Level[]>(() => allModalitiesInPlayabilityOrder.map(modality => {    
    return calculateLevel(dailyRecords.value.operatorScores, modality)
  }))
  
  const hasAnyDailyScore = computed(
    () => dailyRecords.value.operatorScores.findIndex(os => os.value > 0) !== -1
  )
  const hasAnyBestLevel = computed(() => {
    const _levels = levels.value
    
    return personalBests.value.levels.findIndex(
      pbl => pbl.value > _levels.find(l => l.modality === pbl.modality)!.value
    ) !== -1
  })
  
  function _getOperatorScore(operator: Operator, modality: OperationModality): OperatorScore {
    return dailyRecords.value.operatorScores.find(os => os.operator === operator && os.modality === modality)!
  }
  
  function getOperatorScore(operator: Operator, modality: OperationModality): OperatorScore {
    return { ..._getOperatorScore(operator, modality) }
  }
  
  function registerOperationScore(operation: Operation) {
    const operatorScore = _getOperatorScore(operation.operator, operation.modality)
    operatorScore.value += 1
    
    const personalBestScore = personalBests.value.operatorScores.find(
      pbos => pbos.operator === operation.operator && pbos.modality === operation.modality
    )!
    personalBestScore.value = Math.max(personalBestScore.value, operatorScore.value)
    
    const level = levels.value.find(l => l.modality === operation.modality)!
    const personalBestLevel = personalBests.value.levels.find(pbl => pbl.modality === operation.modality)!
    personalBestLevel.value = Math.max(personalBestLevel.value, level.value)
  }
  
  return {
    dailyRecords,
    hasAnyPersonalBest: hasAnyBestLevel,
    hasAnyDailyScore,
    levels,
    personalBests,
    
    getOperatorScore,
    registerOperationScore,
  }
})
