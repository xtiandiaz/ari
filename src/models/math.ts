import type { OperationModality } from "./game"

export enum Operator {
  Addition = 'addition',
  Division = 'division',
  Multiplication = 'multiplication',
  Percent = 'percent',
  Subtraction = 'subtraction',
}

export const allOperators = [Operator.Addition, Operator.Subtraction, Operator.Multiplication, Operator.Division, Operator.Percent]

export interface Operation {
  modality: OperationModality
  operands: number[]
  operator: Operator
  result: number
}
