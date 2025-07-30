import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Operation, Operator } from '@/models/math'
import { OperationModality } from '@/models/game'
import type { Level, OperatorScore } from '@/models/records'
import useGameStore from '@/stores/game'
import { retrieveDailyRecords } from '@/services/records-management'
import { fillInDailyRecords } from '@/utils/records.utils'
import { modalitiesInPlayabilityOrder } from '@/utils/game.utils'
import '@/assets/tungsten/extensions/array.extensions'

export default defineStore('records', () => {  
  const settings = useGameStore()
  const dailyRecords = ref(fillInDailyRecords(retrieveDailyRecords()))
  
  const levels = computed<Level[]>(() => modalitiesInPlayabilityOrder.map(modality => {
    const operatorScores = dailyRecords.value.operatorScores.filter(os => os.modality === modality)
    const value = Math.ceil(operatorScores.reduce((acc, os) => acc + os.value, 0) / settings.levelScoreWeight)
    const best = Math.max(
      Math.ceil(operatorScores.reduce((acc, os) => acc + os.best, 0) / settings.levelScoreWeight),
      value
    )
    
    return { best, modality, operatorScores, value }
  }))
  
  const hasAnyDailyScore = computed(
    () => dailyRecords.value.operatorScores.findIndex(os => os.value > 0) !== -1
  )
  const hasAnyHistoricalBestScore = computed(
    () => dailyRecords.value.operatorScores.findIndex(os => os.best > os.value) !== -1
  )
  
  function getOperatorScore(operator: Operator, modality: OperationModality): OperatorScore {
    return {
      ...dailyRecords.value.operatorScores.find(os => os.operator === operator && os.modality === modality)!
    }
  }
  
  function registerOperationScore(operation: Operation) {
    const operationScore = 1
    const operatorScore = dailyRecords.value.operatorScores
      .find(os => os.operator === operation.operator && os.modality == operation.modality)!
      
    operatorScore.value += operationScore
    operatorScore.best = Math.max(operatorScore.best, operatorScore.value)
  }
  
  return {
    dailyRecords,
    hasAnyHistoricalBestScore,
    hasAnyDailyScore,
    levels,
    
    getOperatorScore,
    registerOperationScore,
  }
})
