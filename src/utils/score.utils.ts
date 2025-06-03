import type { Operator } from '@/models/math'
import { type OperatorScores } from '@/models/scores'
import '@/assets/tungsten/extensions/array.extensions'

export const levelScoreWeight = 3

export function createBlankOperatorScores(operator: Operator): OperatorScores {
  return {
    operator,
    score: 0, 
    record: 0
  }
}

export function calculateOperatorsAverageValue(
  scores: OperatorScores[], 
  valueSelector: (o: OperatorScores) => number
): number {
  return scores.reduce((acc, os) => acc + valueSelector(os), 0) / scores.length
}

export function calculateLevel(operatorsScores: OperatorScores[]): number {
  return Math.max(
    1, 
    Math.floor(calculateOperatorsAverageValue(operatorsScores, (os) => os.score) / levelScoreWeight)
  )
}
