import { Operand, SimpleOperand, OperandKind } from './operand'
import Operator from './operator'
import { OperationError } from '../errors'

export class Operation extends Operand {
  readonly id: number
  operands: Operand[]
  operators: Operator[]
  result: SimpleOperand

  private static _id = 0

  constructor(operands: Operand[], operators: Operator[]) {
    super(OperandKind.Compound, 1)
    
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

  operated(opr: Operator, rhsOpnd: Operand): SimpleOperand {
    return this.result.operated(opr, rhsOpnd)
  }

  static calculate(opnds: Operand[], oprs: Operator[]): SimpleOperand {
    let squashedOpnds: Operand[] = []
    let sweepOprs: Operator[] = []
    let squash = opnds[0]

    for (let i = 0; i < oprs.length; i++) {
      const opr = oprs[i]
      const rhsOpnd = opnds[i + 1]
      switch (opr) {
        case Operator.Multiplication:
        case Operator.Division:
          squash = squash.operated(opr, rhsOpnd)
          continue
        case Operator.Addition:
        case Operator.Subtraction:
          squashedOpnds.push(squash)
          sweepOprs.push(opr)
          squash = rhsOpnd
          continue
      }
    }

    squashedOpnds.push(squash)

    let result = squashedOpnds[0]
    for (let i = 0; i < sweepOprs.length; i++) {
      result = result.operated(sweepOprs[i], squashedOpnds[i + 1])
    }

    return <SimpleOperand>result
  }
}
