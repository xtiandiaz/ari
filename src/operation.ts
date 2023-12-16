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

    if (operands.length < 2) {
      throw new Error('[Operation] Insufficient operands')
    }

    if (operands.length != (operators.length + 1)) {
      throw new Error('[Operation] Unbalanced elements')
    }

    this.operands = operands
    this.operators = operators
    this.result = Operation.calculate(operands, operators)
  }

  get rawValue(): number {
    return this.result.rawValue
  }

  get isNegative(): boolean {
    return this.rawValue < 0
  }

  get textRepresentation(): string {
    let rprtn = this._statementRepresentation(
      this._operandRepresentation(this.operands[0], undefined, this.operators[0]), 
      undefined
    )
    for (let i = 0; i < this.operators.length; i++) {
      const lhsOpr = this.operators[i]
      const opnd = this.operands[i + 1]
      const rhsOpr = i < (this.operators.length - 1) ? this.operators[i + 1] : undefined
      rprtn += this._statementRepresentation(
        this._operandRepresentation(opnd, lhsOpr, rhsOpr),
        lhsOpr
      )
    }
    return rprtn
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

    // console.log(squashedOperands, sweepOperators, result)
    return result.simplified()
  }

  private _operandRepresentation(opnd: Operand, lhsOpr?: Operator, rhsOpr?: Operator): string {
    let shouldEnclose = false
    switch (opnd.kind) {
      case OperandKind.Operation:
        shouldEnclose = !(lhsOpr === undefined || lhsOpr === Operator.Addition) ||
          (rhsOpr !== undefined && [Operator.Multiplication, Operator.Division].includes(rhsOpr!))
        break
      default:
        shouldEnclose = lhsOpr === Operator.Subtraction && opnd.isNegative
        break
    }
    return shouldEnclose ? `(${opnd.textRepresentation})` : opnd.textRepresentation
  }
  
  private _statementRepresentation(opndRprtn: string, lhsOpr?: Operator): string {
    let simplOpndRprtn = opndRprtn
    
    switch (opndRprtn.substring(0, 1)) {
      case '-':
        if (lhsOpr === Operator.Addition) {
          simplOpndRprtn = opndRprtn.substring(1)
          lhsOpr = Operator.Subtraction
        }
        break
    }
    console.log(opndRprtn, '->', simplOpndRprtn)
    
    const prefix = lhsOpr !== undefined ? ` ${lhsOpr} ` : ''
    return prefix + simplOpndRprtn
  }
}
