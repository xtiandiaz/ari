export enum Operator {
  Addition = 'Addition',
  Division = 'Division',
  Multiplication = 'Multiplication',
  Percent = 'Percent',
  Subtraction = 'Subtraction',
}

export const allOperators = [Operator.Addition, Operator.Subtraction, Operator.Multiplication, Operator.Division, Operator.Percent]

export interface Operation {
  operands: number[]
  operator: Operator
  result: number
}
