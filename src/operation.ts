import { Operand, OperandKind, Integer } from './operands'
import Operator from './operator'

export default class Operation implements Operand {
  readonly id: number
  readonly kind = OperandKind.Operation
  operands: Operand[]
  operators: Operator[]
  result: Operand
  
  private static _id = 0
  
  constructor(operands: Operand[], operators: Operator[]) {
    this.id = Operation._id++
    
    if (operands.length != (operators.length + 1)) {
      throw new Error('[Operation] Unbalanced elements')
    }
    
    const [rOperands, rOperators] = Operation._retouch(operands, operators)
    this.operands = rOperands
    this.operators = rOperators
    this.result = Operation.calculate(rOperands, rOperators)
  }
  
  get rawValue(): number {
    return this.result.rawValue
  }
  
  get textRepresentation(): string {
    let representation = `${this.operands[0].textRepresentation}`
    for (let i = 0; i < this.operators.length; i++) {
      representation += ` ${this.operators[i]} ${this._operandTextRepresentation(this.operands[i + 1], this.operators[i])}`
    }
    return representation
  }
  
  operated(opr: Operator, rhs: Operand): Operand {
    return this.result.operated(opr, rhs)
  }
  
  simplified(): Operand {
    return this
  }
  
  static calculate(operands: Operand[], operators: Operator[]): Operand {
    let squashedOperands: Operand[] = []
    let sweepOperators: Operator[] = []
    let squash = operands[0]
    
    for (let i = 0; i < operators.length; i++) {
      const operator = operators[i]
      const rhs = operands[i + 1]
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
    
    // console.log(squashedOperands, sweepOperators, result)
    
    return result.simplified()
  }
  
  private static _retouch(operands: Operand[], operators: Operator[]): [Operand[], Operator[]] {
    let altOperands = operands
    let altOperators = operators
    
    for (let i = 0; i < operators.length; i++) {
      let operand = operands[i + 1]
      if (operand.kind === OperandKind.Operation) {
        continue
      }
      let operator = operators[i]
      if (operand.rawValue < 0 && operator === Operator.Addition) {
        operand = operand.operated(Operator.Multiplication, new Integer(-1))
        operator = Operator.Subtraction
      }
      
      altOperands[i + 1] = operand
      altOperators[i] = operator
    }
    
    return [altOperands, altOperators]
  }
  
  private _operandTextRepresentation(operand: Operand, prelude: Operator): string {
    let shouldEnclose = false
    switch (operand.kind) {
      case OperandKind.Operation:
        shouldEnclose = prelude !== Operator.Addition
        break
      default:
        shouldEnclose = prelude === Operator.Subtraction && operand.rawValue < 0
        break
    }
    return shouldEnclose ? `(${operand.textRepresentation})` : operand.textRepresentation
  }
}
