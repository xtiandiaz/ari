import { Operator, type Operation } from "@/models/math";
import settingsStore from '@/stores/settings'
import scoresStore from '@/stores/scores'
import { getRandomInteger, getRandomChoice, getRandomWeightedChoice } from "@/assets/tungsten/randomness";
import { gcd } from "@/assets/tungsten/math";
import { minLevelToPlayOperator } from "@/utils/score.utils";

function getRandomWeightedOperator(): Operator {
  const settings = settingsStore()
  const scores = scoresStore()
  const overallLevel = scores.todayLevel
  const readyToPlayOperators = settings.playableOperators.filter(o => overallLevel >= minLevelToPlayOperator(o))
  
  const weights = (() => {
    const operatorsScores = readyToPlayOperators.map(o => scores.getOperatorDailyScores(o)?.score ?? 0)
    const maxScore = operatorsScores.reduce((max, cur) => cur > max ? cur : max, operatorsScores[0])
    
    return operatorsScores.map(os => 1 + maxScore / Math.max(os, 1))
  })()
  
  return getRandomWeightedChoice(readyToPlayOperators, weights)
}

function getRandomPercentAndOperand(operatorScore: number, overallLevel: number): number[] {
  enum PercentFigure {
    PowerOfTwoDivisors,
    MultiplesOfFive
  }
  
  const figure: PercentFigure = getRandomChoice(
    [PercentFigure.PowerOfTwoDivisors, PercentFigure.MultiplesOfFive]
  )
  
  let divisor: number, dividend: number
  
  switch (figure) {
    case PercentFigure.PowerOfTwoDivisors:
      const maxPower = Math.min(Math.floor(overallLevel / 3), 3)
      divisor = Math.pow(2, Math.max(1, getRandomInteger(1, maxPower)))
      const dividendFractions = [
        ...Array.range(1, divisor, 1),
        ...Array.range(divisor + 1, divisor + Math.ceil(overallLevel / 2), 1)
      ]
      
      dividend = getRandomChoice(dividendFractions)
      
      // console.log("maxPower", maxPower, getRandomInteger(1, 0), "dividendFractions", dividendFractions, "divisor", divisor, "dividend", dividend) 
      
      break
      
    case PercentFigure.MultiplesOfFive:
      const multRangeMax = Math.ceil(overallLevel / 2) * 5
      const multRange = multRangeMax <= 20
        ? Array.range(1, Math.min(20, multRangeMax), 1)
        : [...Array.range(1, 20, 1), ...Array.range(21, multRangeMax, 1)]
      const mult = getRandomChoice(multRange)
      const percentage = 5 * mult
      const commonDenominator = gcd(percentage, 100)
      dividend = percentage / commonDenominator
      divisor = 100 / commonDenominator
      
      // console.log("multRangeMax", multRangeMax)
      
      break
    }
    
    const rangeMin = 100 * Math.max(2, Math.pow(overallLevel, 2))
    const rangeMax = rangeMin * Math.max(2, Math.floor(operatorScore / divisor))
    const preOperand = getRandomInteger(rangeMin, rangeMax)
    const operand = preOperand - preOperand % divisor
    
    // console.log(rangeMin, '-', rangeMax, ':', divisor, ':', preOperand, '->', operand)
    
    return [dividend / divisor, operand]
}

function generateRandomOperandsForOperator(operator: Operator): number[] {
  const scores = scoresStore()
  const operatorScore = scores.getOperatorDailyScores(operator)?.score ?? 0
  const overallLevel = scores.todayLevel
  
  switch (operator) {
    case Operator.Addition:
      return (() => {
        const mult = Math.pow(2, Math.floor(operatorScore / 4))
        const rangeMin = Math.max(2, mult * Math.pow(operatorScore, 2))
        const rangeMax = Math.max(11, mult * Math.pow(operatorScore, 3))
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()

    case Operator.Division:
      return (() => {
        const rangeMin = Math.max(2, Math.pow(operatorScore, 4 / 3))
        const rangeMax = Math.max(9, Math.pow(operatorScore, 3 / 2))
        
        const divisor = getRandomInteger(rangeMin, rangeMax)
        const dividend = getRandomInteger(rangeMin, rangeMax)
        
        return [dividend * divisor, divisor]
      })()

    case Operator.Multiplication:
      return (() => {
        const rangeMin = Math.max(2, Math.pow(operatorScore, 4 / 3))
        const rangeMax = Math.max(9, Math.pow(operatorScore, 3 / 2))
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()

    case Operator.Percent:
      return (() => {        
        const percentAndOperand = getRandomPercentAndOperand(operatorScore, overallLevel)
        const percentage = Math.floor(percentAndOperand[0] * 1000) / 10
        
        return [percentAndOperand[1], percentage]
      })()

    case Operator.Subtraction:
      return (() => {
        const mult = Math.pow(2, Math.floor(operatorScore / 4))
        const rangeMin = Math.max(3, mult * Math.pow(operatorScore, 2))
        const rangeMax = Math.max(11, mult * Math.pow(operatorScore, 3))
        
        const minuend = getRandomInteger(rangeMin, rangeMax)
        const subtrahend = Math.max(getRandomInteger(rangeMin / 2, minuend) - 2, 2)
        
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
    case Operator.Percent:
      return operands[0] * operands[1] / 100
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
