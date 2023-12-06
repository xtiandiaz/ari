import { Operand, Integer } from './operands'
import { Fraction } from './Fraction'
import Operator from './operator'

export default class Operation {
  readonly id: number
  operands: Operand[]
  operators: Operator[]
    
  private static _id = 0
  
  constructor(operands: Operand[], operators: Operator[]) {
    this.id = Operation._id++
    
    if (operands.length != (operators.length + 1)) {
      throw new Error()
    }
    
    this.operands = operands
    this.operators = operators
  }
  
  get result(): Operand {
    let squashedOperands: Operand[] = []
    let sweepOperators: Operator[] = []
    let squash = this.operands[0]
    
    for (let i = 0; i < this.operators.length; i++) {
      const operator = this.operators[i]
      const rhs = this.operands[i + 1]
      switch (operator) {
        case Operator.Multiplication:
        case Operator.Division:
          squash = squash.operated(operator, rhs)
          continue
        case Operator.Addition:
        case Operator.Subtraction:
          squashedOperands.push(squash)
          sweepOperators.push(operator)
          squash = rhs
          continue
        }
    }
    
    squashedOperands.push(squash)
    
    let result = squashedOperands[0]
    for (let i = 0; i < sweepOperators.length; i++) {
      result = result.operated(sweepOperators[i], squashedOperands[i + 1])
    }
    
    console.log(squashedOperands, sweepOperators, result)
    
    return result
  }
  
  get textRepresentation(): string {
    let representation = `${this.operands[0].textRepresentation}`
    for (let i = 0; i < this.operators.length; i++) {
      representation += ` ${this.operators[i]} ${this.operands[i + 1].textRepresentation}`
    }
    return representation
  }
}
