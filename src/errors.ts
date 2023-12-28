import type { Operand } from './aritmethic/operand'
import type Operator from './aritmethic/operator'
import { operandString } from './stringifier'

export class OperandError extends Error {
  static malformedStringRepresentation = new OperandError('[Operand] Malformed string representation')
  
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
      `${operandString(lhsOpnd)} not implemented for '${opr}' operation with ${operandString(rhsOpnd)}`
    )
  }
}
