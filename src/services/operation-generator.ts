import { Operator, type Operation } from "@/models/math";
import settingsStore from '@/stores/settings'
import scoresStore from '@/stores/scores'
import { getRandomInteger, getRandomChoice, getRandomWeightedChoice } from "@/assets/tungsten/randomness";
import { gcd } from "@/assets/tungsten/math";

function getRandomWeightedOperator(): Operator {
  const settings = settingsStore()
  const score = scoresStore()
  
  const weights = (() => {
    const playableOperatorsScores = settings.playableOperators.map(o => score.getOperatorDailyScores(o)?.score ?? 0)
    const maxScore = playableOperatorsScores.reduce((max, cur) => cur > max ? cur : max, playableOperatorsScores[0])
    
    return playableOperatorsScores.map(os => 1 + maxScore / Math.max(os, 1))
  })()
  
  return getRandomWeightedChoice(settings.playableOperators, weights)
}

function getRandomPercentAndOperand(operatorScore: number, overallLevel: number): number[] {
  enum PercentFigure {
    PowerOfTwoDivisors,
    MultiplesOfFive
  }
  
  const figure: PercentFigure = getRandomChoice(
    [PercentFigure.PowerOfTwoDivisors, PercentFigure.MultiplesOfFive]
  )
  
  let divisor: number, dividend: number, preOperand: number
  
  switch (figure) {
    case PercentFigure.PowerOfTwoDivisors:
      divisor = Math.pow(2, Math.max(1, Math.min(3, getRandomInteger(1, overallLevel))))
      const dividendFractions = [
        ...Array.range(1, divisor, 1),
        ...Array.range(divisor + 1, divisor + overallLevel, 1)
      ]
      dividend = getRandomChoice(dividendFractions)
      
      preOperand = (() => {
        const rangeMin = Math.max(2, operatorScore)
        const rangeMax = Math.max(50, Math.pow(operatorScore, 2))
        
        return getRandomInteger(rangeMin, rangeMax)
      })()
      break

    case PercentFigure.MultiplesOfFive:
      const multRangeMax = overallLevel * 5
      const multRange = multRangeMax < 21 
        ? Array.range(1, Math.min(20, multRangeMax), 1)
        : [...Array.range(1, 20, 1), ...Array.range(21, multRangeMax, 1)]
      const mult = getRandomChoice(multRange)
      const percentage = 5 * mult
      const commonDenominator = gcd(percentage, 100)
      dividend = percentage / commonDenominator
      divisor = 100 / commonDenominator
        
      preOperand = (() => {
        const rangeMin = Math.max(2, operatorScore / 2)
        const rangeMax = Math.max(11, operatorScore)
        
        return getRandomInteger(rangeMin, rangeMax)
      })()
      break
    }
    
    return [dividend / divisor, preOperand * dividend * divisor]
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
        const rangeMax = Math.max(100, mult * Math.pow(operatorScore, 3))
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()

    case Operator.Division:
      return (() => {
        const rangeMax = Math.max(16, Math.pow(operatorScore, 3 / 2))
        const rangeMin = Math.max(2, rangeMax / 2)
        
        const divisor = getRandomInteger(rangeMin, rangeMax)
        const dividend = getRandomInteger(rangeMin, rangeMax)
        
        return [dividend * divisor, divisor]
      })()

    case Operator.Multiplication:
      return (() => {  
        const rangeMax = Math.max(16, Math.pow(operatorScore, 3 / 2))
        const rangeMin = Math.max(2, rangeMax / 2)
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()

    case Operator.Percent:
      return (() => {        
        const percentAndOperand = getRandomPercentAndOperand(operatorScore, overallLevel)
        
        return [percentAndOperand[1], percentAndOperand[0] * 100]
      })()

    case Operator.Subtraction:
      return (() => {
        const mult = Math.pow(2, Math.floor(operatorScore / 4))
        const rangeMin = Math.max(3, mult * Math.pow(operatorScore, 2))
        const rangeMax = Math.max(100, mult * Math.pow(operatorScore, 3))
        
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
