import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Operator } from '@/models/math'
import { LevelKind, type OperatorScores } from '@/models/scores'
import settingsStore from '@/stores/settings'
import { retrieveActiveDailyScores } from '@/services/scores-management'
import { calculateLevel, createBlankOperatorScores } from '@/utils/score.utils'
import '@/assets/tungsten/extensions/date.extensions'
import '@/assets/tungsten/extensions/array.extensions'

export default defineStore('score', () => {
  const settings = settingsStore()
  
  const dailyScores = ref(retrieveActiveDailyScores())
  const playableOperatorsScores = computed(() => settings.playableOperators.map(os => getOperatorDailyScores(os)))
  const dailyTotalOperatorsScore = computed(() => playableOperatorsScores.value.reduce((acc, os) => acc + os.score, 0))
  
  const todayLevel = computed(() => calculateLevel(LevelKind.Daily, playableOperatorsScores.value))
  const recordLevel = computed(() => calculateLevel(LevelKind.Record, playableOperatorsScores.value))
  
  function getOperatorDailyScores(operator: Operator): OperatorScores {
    const operatorScores = dailyScores.value.operatorsScores.find(os => os.operator === operator)
    if (operatorScores) {
      return operatorScores
    }
    
    const blankOperatorScores = createBlankOperatorScores(operator)
    
    dailyScores.value.operatorsScores.push(blankOperatorScores)
    
    return blankOperatorScores
  }
  
  function addOperatorScore(operator: Operator) {
    const operatorStats = getOperatorDailyScores(operator)
    if (operatorStats) {
      operatorStats.score++
      operatorStats.record = Math.max(operatorStats.score, operatorStats.record)
    } else {
      dailyScores.value.operatorsScores.push({
        operator: operator,
        score: 1,
        record: 1
      })
    }
  }
  
  return {
    dailyScores,
    dailyTotalOperatorsScore,
    playableOperatorsScores,
    recordLevel,
    todayLevel,
    
    addOperatorScore,
    getOperatorDailyScores
  }
})
