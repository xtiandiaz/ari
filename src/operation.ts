import { Operand, OperandKind } from './operands'
import Operator from './operator'
import { OperationError } from './errors'

export class Operation extends Operand {
  readonly id: number
  operands: Operand[]
  operators: Operator[]
  result: Operand

  private static _id = 0

  constructor(operands: Operand[], operators: Operator[]) {
    super(OperandKind.Operation, 1)
    
    this.id = Operation._id++

    if (operands.length < 2) {
      throw OperationError.insufficientOperands
    }

    if (operands.length != (operators.length + 1)) {
      throw OperationError.unbalancedElements
    }

    this.operands = operands
    this.operators = operators
    this.result = Operation.calculate(operands, operators)
  }

  get rawValue(): number {
    return this.result.rawValue
  }
  
  get baseRawValue(): number {
    return this.rawValue
  }

  operated(opr: Operator, rhsOpnd: Operand): Operand {
    return this.result.operated(opr, rhsOpnd)
  }

  simplified(): Operand {
    return this.result
  }

  static calculate(opnds: Operand[], oprs: Operator[]): Operand {
    let squashedOpnds: Operand[] = []
    let sweepOprs: Operator[] = []
    let squash = opnds[0]

    for (let i = 0; i < oprs.length; i++) {
      const opr = oprs[i]
      const rhsOpnd = opnds[i + 1]
      switch (opr) {
        case Operator.Multiplication:
        case Operator.Division:
          squash = squash.operated(opr, rhsOpnd.simplified())
          continue
        case Operator.Addition:
        case Operator.Subtraction:
          squashedOpnds.push(squash)
          sweepOprs.push(opr)
          squash = rhsOpnd.simplified()
          continue
      }
    }

    squashedOpnds.push(squash)

    let result = squashedOpnds[0]
    for (let i = 0; i < sweepOprs.length; i++) {
      result = result.operated(sweepOprs[i], squashedOpnds[i + 1].simplified())
    }

    return result.simplified()
  }
}
