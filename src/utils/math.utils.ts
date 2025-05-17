import { Operator, type Operation } from "@/models/math";
import { randomChoice, randomInteger } from "@/assets/tungsten/randomness";

export const randomOperandsForOperator = (operator: Operator): number[] => {
  switch (operator) {
    case Operator.Addition:
      return [randomInteger(10, 1000), randomInteger(10, 1000)]
    case Operator.Division:
      const divisor = randomInteger(2, 100)
      const dividend = randomInteger(2, 100)
      return [dividend * divisor, divisor]
    case Operator.Multiplication:
      return [randomInteger(2, 100), randomInteger(2, 100)]
    case Operator.Subtraction:
      const minuend = randomInteger(10, 1000)
      const subtrahend = randomInteger(1, minuend)
      return [minuend, subtrahend]
  }
}

export const randomOperator = (): Operator => {
  return randomChoice([Operator.Addition, Operator.Division, Operator.Multiplication, Operator.Subtraction])
}

export const randomOperation = (): Operation => {
  const operator = randomOperator()
  
  return {
    operands: randomOperandsForOperator(operator),
    operator
  }
}

export const operationResult = (operation: Operation): number => {
  switch (operation.operator) {
    case Operator.Addition:
      return operation.operands[0] + operation.operands[1]
    case Operator.Division:
      return operation.operands[0] / operation.operands[1]
    case Operator.Multiplication:
      return operation.operands[0] * operation.operands[1]
    case Operator.Subtraction:
      return operation.operands[0] - operation.operands[1]
  }
}
