export enum Operator {
  Addition = 'Addition',
  Division = 'Division',
  Multiplication = 'Multiplication',
  Subtraction = 'Subtraction',
}

export const allOperators = [Operator.Addition, Operator.Subtraction, Operator.Multiplication, Operator.Division]

export interface Operation {
  operands: number[]
  operator: Operator
  result: number
}
