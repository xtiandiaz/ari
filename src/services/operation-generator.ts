import { Operator, type Operation } from "@/models/math";
import settingsStore from '@/stores/settings'
import statsStore from '@/stores/stats'
import { calculateLevelForOperator } from "@/utils/stats.utils";
import { getRandomInteger, getRandomWeightedChoice } from "@/assets/tungsten/randomness";

function getRandomWeightedOperator(): Operator {
  const settings = settingsStore()
  const stats = statsStore()
  
  const weights = (() => {
    const accPoints = settings.playableOperators.map(o => stats.getOperatorDailyStats(o)?.score ?? 1)
    const maxPoints = accPoints.reduce((max, cur) => cur > max ? cur : max, accPoints[0])
    
    return accPoints.map(p => maxPoints / p)
  })()
  
  return getRandomWeightedChoice(settings.playableOperators, weights)
}

function generateRandomOperandsForOperator(operator: Operator): number[] {
  const stats = statsStore()
  const score = stats.getOperatorDailyStats(operator)?.score ?? 0
  const fixedScore = Math.max(1, score)
  
  switch (operator) {
    case Operator.Addition:
      return (() => {
        const rangeMin = Math.max(1, Math.pow(score / 2, 2))
        const rangeMax = Math.max(11, Math.pow(score / 2, 3))
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()
    case Operator.Division:
      return (() => {
        const rangeMin = Math.max(2, score)
        const rangeMax = Math.max(11, score / 2 * Math.log2(fixedScore))
        
        const divisor = getRandomInteger(rangeMin, rangeMax)
        const dividend = getRandomInteger(rangeMin, rangeMax)
        
        return [dividend * divisor, divisor]
      })()
    case Operator.Multiplication:
      return (() => {  
        const rangeMin = Math.max(2, score)
        const rangeMax = Math.max(11, score / 2 * Math.log2(fixedScore))
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()
    case Operator.Subtraction:
      return (() => {
        const rangeMin = Math.max(2, Math.pow(score / 2, 2))
        const rangeMax = Math.max(11, Math.pow(score / 2, 3))
        
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
  const operator = getRandomWeightedOperator() //getRandomOperator()
  const operands = generateRandomOperandsForOperator(operator)
  
  return {
    operands,
    operator,
    result: getResult(operator, operands)
  }
}
