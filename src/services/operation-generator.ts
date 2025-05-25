import { Operator, type Operation } from "@/models/math";
import settingsStore from '@/stores/settings'
import scoreStore from '@/stores/score'
import { getRandomInteger, getRandomWeightedChoice } from "@/assets/tungsten/randomness";

function getRandomWeightedOperator(): Operator {
  const settings = settingsStore()
  const score = scoreStore()
  
  const weights = (() => {
    const playableOperatorsScores = settings.playableOperators.map(o => score.getOperatorDailyScore(o)?.score ?? 0)
    const maxScore = playableOperatorsScores.reduce((max, cur) => cur > max ? cur : max, playableOperatorsScores[0])
    
    return playableOperatorsScores.map(os => 1 + maxScore / Math.max(os, 1))
  })()
  
  return getRandomWeightedChoice(settings.playableOperators, weights)
}

function generateRandomOperandsForOperator(operator: Operator): number[] {
  const score = scoreStore()
  const operaatorScore = score.getOperatorDailyScore(operator)?.score ?? 0
  const fixedScore = Math.max(1, operaatorScore)
  
  switch (operator) {
    case Operator.Addition:
      return (() => {
        const rangeMin = Math.max(1, Math.pow(operaatorScore, 2))
        const rangeMax = Math.max(51, Math.pow(operaatorScore, 3))
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()
    case Operator.Division:
      return (() => {
        const rangeMin = Math.max(2, operaatorScore)
        const rangeMax = Math.max(11, operaatorScore * Math.log2(fixedScore))
        
        const divisor = getRandomInteger(rangeMin, rangeMax)
        const dividend = getRandomInteger(rangeMin, rangeMax)
        
        return [dividend * divisor, divisor]
      })()
    case Operator.Multiplication:
      return (() => {  
        const rangeMin = Math.max(2, operaatorScore)
        const rangeMax = Math.max(11, operaatorScore * Math.log2(fixedScore))
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()
    case Operator.Subtraction:
      return (() => {
        const rangeMin = Math.max(2, Math.pow(operaatorScore, 2))
        const rangeMax = Math.max(52, Math.pow(operaatorScore, 3))
        
        const minuend = getRandomInteger(rangeMin, rangeMax)
        const subtrahend = getRandomInteger(1, minuend - 1)
        
        return [minuend, subtrahend]
      })()
  }
}

function getResult(operator: Operator, operands: number[]): number {
  switch (operator) {
    case Operator.Addition:
      return operands[0] + operands[1]
    case Operator.Division:
      return operands[0] / operands[1]
    case Operator.Multiplication:
      return operands[0] * operands[1]
    case Operator.Subtraction:
      return operands[0] - operands[1]
  }
}


export function generateRandomOperation(): Operation {
  const operator = getRandomWeightedOperator()
  const operands = generateRandomOperandsForOperator(operator)
  
  return {
    operands,
    operator,
    result: getResult(operator, operands)
  }
}
