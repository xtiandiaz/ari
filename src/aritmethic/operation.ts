import Operator from './operator'
import { Operand, OperandKind } from './operand'
import SimpleOperand from './simple-operand'
import { AriErrorCode, AriError } from '../errors'

export default class Operation implements Operand {
  readonly id: number
  readonly kind = OperandKind.Compound
  
  operands: Operand[]
  operators: Operator[]
  result: SimpleOperand

  private static _id = 0

  constructor(operands: Operand[], operators: Operator[]) {    
    this.id = Operation._id++

    if (operands.length < 2) {
      throw new AriError(AriErrorCode.ElementShortfall, `insufficient operands ${operands}`)
    }
    if (operands.length != (operators.length + 1)) {
      throw new AriError(AriErrorCode.ElementUnbalance, `operands: ${operands}, operators: ${operators}`)
    }

    this.operands = operands
    this.operators = operators
    this.result = Operation.calculate(operands, operators)
  }

  get rawValue(): number {
    return this.result.rawValue
  }

  operated(opr: Operator, rhsOpnd: Operand): Operand {
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
        case Operator.multiplication:
        case Operator.division:
          squash = squash.operated(opr, rhsOpnd)
          continue
        case Operator.addition:
        case Operator.subtraction:
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

    return (<SimpleOperand>result).simplified()
  }
}
