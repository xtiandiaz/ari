import type { Operand } from './operands'
import type Operator from './operator'
import * as stringify from './stringifier'

export class OperandError extends Error {
  static unsupportedExponent(exponent: number): OperandError {
    return new OperandError(`[Operand] Invalid exponent ${exponent}`)
  }
}

export class OperationError extends Error {
  static insufficientOperands = new OperationError('[Operation] Insufficient operands')
  static unbalancedElements = new OperationError('[Operation] Unbalanced elements')
  static divisionByZero = new OperationError('[Operation] Division by zero')
  
  static notImplemented(lhsOpnd: Operand, opr: Operator, rhsOpnd: Operand): OperationError {
    return new OperationError(
      `${stringify.operandString(lhsOpnd)} not implemented for '${opr}' operation with ${stringify.operandString(rhsOpnd)}`
    )
  }
}
