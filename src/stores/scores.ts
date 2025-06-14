import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { allOperators, type Operator } from '@/models/math'
import type { DailyScores, OperatorScores } from '@/models/scores'
import settingsStore from '@/stores/settings'
import { retrieveActiveDailyScores } from '@/services/scores-management'
import { calculateLevel, createBlankOperatorScores } from '@/utils/score.utils'
import '@/assets/tungsten/extensions/date.extensions'
import '@/assets/tungsten/extensions/array.extensions'

function supplementSavedDailyScores(dailyScores: DailyScores): DailyScores {
  for (const operator of allOperators) {
    if (dailyScores.operatorsScores.findIndex(os => os.operator === operator) === -1) {
      dailyScores.operatorsScores.push(createBlankOperatorScores(operator))
    }
  }
  return dailyScores
}

export default defineStore('scores', () => {
  const settings = settingsStore()
  
  const dailyScores = ref(supplementSavedDailyScores(retrieveActiveDailyScores()))
  const playableOperatorsScores = computed(() => settings.playableOperators.map(os => getOperatorDailyScores(os)))
  const hasAnyDailyScore = computed(() => dailyScores.value.operatorsScores.findIndex(os => os.score > 0) !== -1)
  
  const todayLevel = computed(() => calculateLevel(playableOperatorsScores.value))
  const recordLevel = computed(() => dailyScores.value.recordLevel)
  const isTodayLevelNewRecord = ref(false)
  
  function getOperatorDailyScores(operator: Operator): OperatorScores {
    return dailyScores.value.operatorsScores.find(os => os.operator === operator)!
  }
  
  function addOperatorScore(operator: Operator) {
    const operatorStats = getOperatorDailyScores(operator)
    
    operatorStats.score++
    operatorStats.record = Math.max(operatorStats.score, operatorStats.record ?? 0)
    
    const newLevel = todayLevel.value
    isTodayLevelNewRecord.value = newLevel > (recordLevel.value ?? 1)
    dailyScores.value.recordLevel = Math.max(newLevel, recordLevel.value ?? 1)
  }
  
  return {
    dailyScores,
    hasAnyDailyScore,
    playableOperatorsScores,
    todayLevel,
    
    recordLevel,
    isTodayLevelNewRecord,
    
    addOperatorScore,
    getOperatorDailyScores
  }
})
