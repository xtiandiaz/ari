import { Operator, OperationModality, allModalities } from "@/enums";
import type { Operation } from "@/models";
import useGameStore from '@/stores/game'
import useRecordsStore from '@/stores/records'
import { 
  getRandomInteger, 
  getRandomChoice, 
  getRandomWeightedChoice 
} from "@/assets/tungsten/randomness";
import { gcd } from "@/assets/tungsten/math";

function getRandomWeightedOperator(modality?: OperationModality): [Operator, OperationModality] {
  const records = useRecordsStore()
  
  const modalities = modality ? [modality] : allModalities
  const scores = records.dailyRecords.operatorScores.filter(os => modalities.includes(os.modality))
  const maxScore = scores.reduce((max, os) => os.value > max.value ? os : max, scores[0])
  const weights = scores.map(s => 1 + maxScore.value / Math.max(s.value, 1))
  // console.log(Array.zip(scores.map(s => `${s.operator}:${s.modality}`), weights))
  
  const choice = getRandomWeightedChoice(scores, weights)
  
  return [ choice.operator, choice.modality ]
}

function getRandomPercentAndOperand(operatorScore: number): number[] {
  enum PercentFigure {
    PowerOfTwoDivisors,
    MultiplesOfFive
  }
  
  const settings = useGameStore()
  const relativeLevel = Math.max(1, Math.ceil(operatorScore / settings.levelScoreWeight))
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

function generateRandomOperandsForOperator(operator: Operator, modality: OperationModality): number[] {
  const records = useRecordsStore()
  const operatorScore = records.getOperatorScore(operator, modality).value
  
  switch (operator) {
    case Operator.Addition:
      return (() => {
        const mult = modality == OperationModality.Visual ? Math.pow(2, Math.floor(operatorScore / 4)) : 1
        const rangeMin = Math.max(2, mult * Math.pow(operatorScore, 2))
        const rangeMax = Math.max(19, mult * Math.pow(operatorScore, 3))
        
        return [
          getRandomInteger(rangeMin, rangeMax), 
          getRandomInteger(rangeMin, rangeMax)
        ]
      })()
      
    case Operator.Subtraction:
      return (() => {
        const mult = modality == OperationModality.Visual ? Math.pow(2, Math.floor(operatorScore / 4)) : 1
        const rangeMin = Math.max(8, mult * Math.pow(operatorScore, 2))
        const rangeMax = Math.max(19, mult * Math.pow(operatorScore, 3))
        
        const minuend = getRandomInteger(rangeMin, rangeMax)
        const subtrahend = Math.max(getRandomInteger(rangeMin / 2, minuend) - 2, 2)
        
        return [minuend, subtrahend]
      })()
      
    case Operator.Multiplication:
      return (() => {
        const rangeMin = Math.max(2, Math.pow(operatorScore, 4 / 3))
        const rangeMax = Math.max(9, Math.pow(operatorScore, 5 / 3))
        
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

    case Operator.Percent:
      return (() => {        
        const percentAndOperand = getRandomPercentAndOperand(operatorScore)
        const percentage = Math.floor(percentAndOperand[0] * 1000) / 10
        
        return [percentAndOperand[1], percentage]
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

export function generateRandomOperation(selectedModality?: OperationModality): Operation {
  const om = getRandomWeightedOperator(selectedModality)
  const operands = generateRandomOperandsForOperator(om[0], om[1])
  
  return {
    modality: om[1],
    operands,
    operator: om[0],
    result: getResult(om[0], operands)
  }
}
