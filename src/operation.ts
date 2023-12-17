import { Operand, OperandKind } from './operands'
import Operator from './operator'

export class OperationError extends Error {
  static insufficientOperands = new OperationError('[Operation] Insufficient operands')
  static unbalancedElements = new OperationError('[Operation] Unbalanced elements')
  static divisionByZero = new OperationError('[Operation] Division by zero')
  
  static notImplemented(lhsOpnd: Operand, opr: Operator, rhsOpnd: Operand): OperationError {
    return new OperationError(
      `${lhsOpnd.textRepresentation} not implemented for '${opr}' operation with ${rhsOpnd.textRepresentation}`
    )
  }
}

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

  get isBaseNegative(): boolean {
    return this.rawValue < 0
  }

  textRepresentation(parenthesized: boolean): string {
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
    
    return parenthesized ? `(${rprtn})` : rprtn
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
    let shouldParenthesize = false
    switch (opnd.kind) {
      case OperandKind.Operation:
        shouldParenthesize = !(lhsOpr === undefined || lhsOpr === Operator.Addition) ||
          (rhsOpr !== undefined && [Operator.Multiplication, Operator.Division].includes(rhsOpr!))
        break
      default:
        shouldParenthesize = lhsOpr === Operator.Subtraction && opnd.isBaseNegative
        break
    }
    return opnd.textRepresentation(shouldParenthesize)
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
    // console.log(opndRprtn, '->', simplOpndRprtn)
    
    const prefix = lhsOpr !== undefined ? ` ${lhsOpr} ` : ''
    return prefix + simplOpndRprtn
  }
}
