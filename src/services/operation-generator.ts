import { Operator, type Operation } from "@/models/math";
import settingsStore from '@/stores/settings'
import scoresStore from '@/stores/scores'
import { getRandomInteger, getRandomChoice, getRandomWeightedChoice } from "@/assets/tungsten/randomness";
import { gcd } from "@/assets/tungsten/math";
import { levelScoreWeight } from "@/utils/score.utils";

function getRandomWeightedOperator(): Operator {
  const settings = settingsStore()
  const scores = scoresStore()
  
  const weights = (() => {
    const operatorsScores = settings.playableOperators.map(o => scores.getOperatorDailyScores(o)?.score ?? 0)
    const maxScore = operatorsScores.reduce((max, cur) => cur > max ? cur : max, operatorsScores[0])
    
    return operatorsScores.map(os => 1 + maxScore / Math.max(os, 1))
  })()
  
  return getRandomWeightedChoice(settings.playableOperators, weights)
}

function getRandomPercentAndOperand(operatorScore: number): number[] {
  enum PercentFigure {
    PowerOfTwoDivisors,
    MultiplesOfFive
  }
  
  const relativeLevel = Math.max(1, Math.ceil(operatorScore / levelScoreWeight))
  const figure: PercentFigure = getRandomChoice([
    PercentFigure.PowerOfTwoDivisors, 
    PercentFigure.MultiplesOfFive
  ])
  
  let divisor: number, dividend: number
  
  switch (figure) {
    case PercentFigure.PowerOfTwoDivisors:
      const maxPower = Math.min(relativeLevel, 3)
      
      divisor = Math.pow(2, Math.max(1, getRandomInteger(1, maxPower)))
      
      if (divisor === 2) {
        dividend = 1
      } else {
        const dividendFractions = [
          ...Array.range(1, divisor, 1), 
          ...Array.range(divisor + 1, divisor + relativeLevel, 1)
        ]
        
        dividend = getRandomChoice(dividendFractions)
        
        // console.log("maxPower", maxPower, "dividendFractions", dividendFractions)
      }
      break
      
    case PercentFigure.MultiplesOfFive:
      const multRangeMax = relativeLevel * 5
      const multRange = multRangeMax <= 20
        ? Array.range(1, Math.min(20, multRangeMax), 1)
        : [...Array.range(1, 20, 1), ...Array.range(21, multRangeMax, 1)]
      const mult = getRandomChoice(multRange)
      const percentage = 5 * mult
      const commonDenominator = gcd(percentage, 100)
      
      dividend = percentage / commonDenominator
      divisor = 100 / commonDenominator
      
      // console.log("multRangeMax", multRangeMax, "mult", mult, "percentage", percentage)
      break
    }
    
    const rangeMin = Math.max(10 * divisor / dividend, Math.pow(operatorScore, 3))
    const rangeMax = rangeMin * Math.max(2, Math.log2(operatorScore))
    const preOperand = getRandomInteger(rangeMin, rangeMax)
    const operand = preOperand - preOperand % divisor
    
    // console.log(rangeMin, '-', rangeMax, ':', `${dividend}/${divisor}`, ':', preOperand, '->', operand)
    
    return [dividend / divisor, operand]
}

function generateRandomOperandsForOperator(operator: Operator): number[] {
  const scores = scoresStore()
  const operatorScore = 50//scores.getOperatorDailyScores(operator)?.score ?? 0
  
  switch (operator) {
    case Operator.Addition:
      return (() => {
        const mult = Math.pow(2, Math.floor(operatorScore / 4))
        const rangeMin = Math.max(2, mult * Math.pow(operatorScore, 2))
        const rangeMax = Math.max(19, mult * Math.pow(operatorScore, 3))
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()

    case Operator.Division:
      return (() => {
        const rangeMin = Math.max(2, Math.pow(operatorScore, 4 / 3))
        const rangeMax = Math.max(9, Math.pow(operatorScore, 5 / 3))
        
        const divisor = getRandomInteger(rangeMin, rangeMax)
        const dividend = getRandomInteger(rangeMin, rangeMax)
        
        return [dividend * divisor, divisor]
      })()

    case Operator.Multiplication:
      return (() => {
        const rangeMin = Math.max(2, Math.pow(operatorScore, 4 / 3))
        const rangeMax = Math.max(9, Math.pow(operatorScore, 5 / 3))
        
        return [getRandomInteger(rangeMin, rangeMax), getRandomInteger(rangeMin, rangeMax)]
      })()

    case Operator.Percent:
      return (() => {        
        const percentAndOperand = getRandomPercentAndOperand(operatorScore)
        const percentage = Math.floor(percentAndOperand[0] * 1000) / 10
        
        return [percentAndOperand[1], percentage]
      })()

    case Operator.Subtraction:
      return (() => {
        const mult = Math.pow(2, Math.floor(operatorScore / 4))
        const rangeMin = Math.max(8, mult * Math.pow(operatorScore, 2))
        const rangeMax = Math.max(19, mult * Math.pow(operatorScore, 3))
        
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
