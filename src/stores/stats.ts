import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { OperatorStats, OperatorRecords } from '@/models/stats'
import type { Operator } from '@/models/math'
import { retrieveActiveDailyStats, retrieveSavedRecords } from '@/services/stats-management'
import '@/assets/tungsten/extensions/date.extensions'

export default defineStore('stats', () => {
  const dailyStats = ref(retrieveActiveDailyStats() ?? {
    date: Date.today(),
    operatorsStats: []
  })
  const dailyTotalScore = computed(() => dailyStats.value.operatorsStats.reduce((acc, os) => acc + os.score, 0))
  
  const records = ref(retrieveSavedRecords() ?? {
    operatorsRecords: []
  })
  
  function getOperatorDailyStats(operator: Operator): OperatorStats | undefined {
    return dailyStats.value.operatorsStats.find(os => os.operator === operator)
  }
  
  function getOperatorRecords(operator: Operator): OperatorRecords | undefined {
    return records.value.operatorsRecords.find(or => or.operator === operator)
  }
  
  function addScore(operator: Operator) {
    const operatorStats = getOperatorDailyStats(operator)
    if (operatorStats) {
      operatorStats.score++
      operatorStats.record = Math.max(operatorStats.score, operatorStats.record)
    } else {
      dailyStats.value.operatorsStats.push({
        operator: operator,
        score: 1,
        record: 1
      })
    }
    
    const operatorRecords = getOperatorRecords(operator)
    const updatedOperatorStats = getOperatorDailyStats(operator)!
    if (operatorRecords) {
      operatorRecords.maxSolutionCount = Math.max(updatedOperatorStats.score, operatorRecords.maxSolutionCount)
    } else {
      records.value.operatorsRecords.push({
        maxSolutionCount: updatedOperatorStats.score,
        operator: operator
      })
    }
  }
  
  return {
    dailyStats,
    dailyTotalScore,
    records,
    
    getOperatorDailyStats,
    addScore,
  }
})
