import { Operator, allOperators, type Operation } from "@/models/math";
import { calculateLevelForOperator } from "@/utils/stats.utils";
import { getRandomChoice, getRandomInteger } from "@/assets/tungsten/randomness";

function getRandomOperator(): Operator {
  return getRandomChoice(allOperators)
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
        const rangeMin = Math.max(2, 2 * level)
        const rangeMax = Math.max(10, 5 * level)
        
        const divisor = getRandomInteger(rangeMin, rangeMax)
        const dividend = getRandomInteger(rangeMin, rangeMax)
        
        return [dividend * divisor, divisor]
      })()
    case Operator.Multiplication:
      return (() => {
        const rangeMin = Math.max(1, 2 * level)
        const rangeMax = Math.max(10, 5 * level)
        
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
  const operator = getRandomOperator()
  const operatorLevel = calculateLevelForOperator(operator)
  const operands = generateRandomOperandsForOperator(operator, operatorLevel)
  
  return {
    operands,
    operator,
    result: getResult(operator, operands)
  }
}
