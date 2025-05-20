import { Operator, allOperators } from '@/models/math'
import statsStore from '@/stores/stats'

export const levelWeight = 3

export function calculateLevelForOperator(operator: Operator): number {
  const stats = statsStore()
  
  return Math.floor((stats.getOperatorDailyStats(operator)?.solutionCount ?? 0) / levelWeight)
}

export function calculateOverallLevel(): number {
  return Math.floor(
    allOperators.map(o => calculateLevelForOperator(o)).reduce((acc, ol) => acc + ol, 0) / allOperators.length
  )
}
