import { Operator, type Operation } from "@/models/math";
import settingsStore from '@/stores/settings'
import scoreStore from '@/stores/score'
import { levelWeight } from "@/utils/score.utils";
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
  const operatorScore = score.getOperatorDailyScore(operator)?.score ?? 0
  const fixedOperatorScore = Math.max(1, operatorScore)
  
  switch (operator) {
    case Operator.Addition:
      return (() => {
        const mult = Math.pow(2, Math.floor(operatorScore / 5))
        const rangeMin = Math.max(2, mult * Math.pow(operatorScore, 2))
        const rangeMax = Math.max(99, mult * Math.pow(operatorScore, 3))
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()
    case Operator.Division:
      return (() => {
        const rangeMin = Math.max(2, operatorScore)
        const rangeMax = Math.max(11, operatorScore * Math.log2(fixedOperatorScore))
        
        const divisor = getRandomInteger(rangeMin, rangeMax)
        const dividend = getRandomInteger(rangeMin, rangeMax)
        
        return [dividend * divisor, divisor]
      })()
    case Operator.Multiplication:
      return (() => {  
        const rangeMin = Math.max(2, operatorScore)
        const rangeMax = Math.max(11, operatorScore * Math.log2(fixedOperatorScore))
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()
    case Operator.Subtraction:
      return (() => {
        const mult = Math.pow(2, Math.floor(operatorScore / 5))
        const rangeMin = Math.max(2, mult * Math.pow(operatorScore, 2))
        const rangeMax = Math.max(99, mult * Math.pow(operatorScore, 3))
        
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
