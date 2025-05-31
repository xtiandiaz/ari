import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { allOperators, type Operator } from '@/models/math'
import { LevelKind, type OperatorScores } from '@/models/scores'
import settingsStore from '@/stores/settings'
import { retrieveActiveDailyScores } from '@/services/scores-management'
import { calculateLevel, createBlankOperatorScores } from '@/utils/score.utils'
import '@/assets/tungsten/extensions/date.extensions'
import '@/assets/tungsten/extensions/array.extensions'

export default defineStore('scores', () => {
  const settings = settingsStore()
  
  const savedDailyScores = retrieveActiveDailyScores()
  for (const operator of allOperators) {
    if (savedDailyScores.operatorsScores.findIndex(os => os.operator === operator) === -1) {
      savedDailyScores.operatorsScores.push(createBlankOperatorScores(operator))
    }
  }
  
  const dailyScores = ref(savedDailyScores)
  const playableOperatorsScores = computed(() => settings.playableOperators.map(os => getOperatorDailyScores(os)))
  const hasAnyDailyScore = computed(() => dailyScores.value.operatorsScores.findIndex(os => os.score > 0) !== -1)
  
  const todayLevel = computed(() => calculateLevel(LevelKind.Daily, playableOperatorsScores.value))
  const recordLevel = computed(() => calculateLevel(LevelKind.Record, playableOperatorsScores.value))
  
  function getOperatorDailyScores(operator: Operator): OperatorScores {
    return dailyScores.value.operatorsScores.find(os => os.operator === operator)!
  }
  
  function addOperatorScore(operator: Operator) {
    const operatorStats = getOperatorDailyScores(operator)
    
    operatorStats.score++
    operatorStats.record = Math.max(operatorStats.score, operatorStats.record)
  }
  
  return {
    dailyScores,
    hasAnyDailyScore,
    playableOperatorsScores,
    recordLevel,
    todayLevel,
    
    addOperatorScore,
    getOperatorDailyScores
  }
})
