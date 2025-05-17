export enum Operator {
  Addition = "Addition", 
  Division = "Division",
  Multiplication = "Multiplication",
  Subtraction = "Subtraction"
}

export interface Operation {
  operands: number[]
  operator: Operator
}
