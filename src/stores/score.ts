import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Operator } from '@/models/math'
import type { DailyScore, OperatorScore } from '@/models/score'
import { retrieveActiveDailyScore } from '@/services/score-management'
import '@/assets/tungsten/extensions/date.extensions'

export default defineStore('score', () => {
  const dailyScore = ref(retrieveActiveDailyScore())
  const dailyTotalScore = computed(() => dailyScore.value.operatorsScores.reduce((acc, os) => acc + os.score, 0))
  
  function getOperatorDailyScore(operator: Operator): OperatorScore | undefined {
    return dailyScore.value.operatorsScores.find(os => os.operator === operator)
  }
  
  function addOperatorScore(operator: Operator) {
    const operatorStats = getOperatorDailyScore(operator)
    if (operatorStats) {
      operatorStats.score++
      operatorStats.record = Math.max(operatorStats.score, operatorStats.record)
    } else {
      dailyScore.value.operatorsScores.push({
        operator: operator,
        score: 1,
        record: 1
      })
    }
  }
  
  return {
    dailyScore,
    dailyTotalScore,
    
    addOperatorScore,
    getOperatorDailyScore,
  }
})
