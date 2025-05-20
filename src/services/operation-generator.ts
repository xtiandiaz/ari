import { Operator, allOperators, type Operation } from "@/models/math";
import statsStore from '@/stores/stats'
import { calculateLevelForOperator } from "@/utils/stats.utils";
import { getRandomChoice, getRandomInteger, getRandomWeightedChoice } from "@/assets/tungsten/randomness";

function getRandomOperator(): Operator {
  return getRandomChoice(allOperators)
}

function getRandomWeightedOperator(): Operator {
  const stats = statsStore()
  const weights = (() => {
    const accPoints = allOperators.map(o => stats.getOperatorDailyStats(o)?.solutionCount ?? 1)
    const maxPoints = accPoints.reduce((max, cur) => cur > max ? cur : max, accPoints[0])
    
    return accPoints.map(p => maxPoints / p)
  })()
  
  return getRandomWeightedChoice(allOperators, weights)
}

function generateRandomOperandsForOperator(operator: Operator, level: number = 0): number[] {
  switch (operator) {
    case Operator.Addition:
      return (() => {
        const rangeMin = Math.max(1, 10 * level)
        const rangeMax = Math.max(50, 100 * level)
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()
    case Operator.Division:
      return (() => {
        const rangeMin = Math.max(2, 3 * level)
        const rangeMax = Math.max(10, 6 * level)
        
        const divisor = getRandomInteger(rangeMin, rangeMax)
        const dividend = getRandomInteger(rangeMin, rangeMax)
        
        return [dividend * divisor, divisor]
      })()
    case Operator.Multiplication:
      return (() => {
        const rangeMin = Math.max(2, 3 * level)
        const rangeMax = Math.max(10, 6 * level)
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()
    case Operator.Subtraction:
      return (() => {
        const rangeMin = Math.max(1, 10 * level)
        const rangeMax = Math.max(50, 100 * level)
        
        const minuend = getRandomInteger(rangeMin, rangeMax)
        const subtrahend = getRandomInteger(1, minuend)
        
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
  const operatorLevel = calculateLevelForOperator(operator)
  const operands = generateRandomOperandsForOperator(operator, operatorLevel)
  
  return {
    operands,
    operator,
    result: getResult(operator, operands)
  }
}
