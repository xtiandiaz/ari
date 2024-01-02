import type SimpleOperand from './aritmethic/simple-operand'
import type Operator from './aritmethic/operator'
import { operandString } from './stringifier'

export class OperandError extends Error {
  static divisionByZero = new OperandError('[Operand] Division by zero')
  static malformedStringRepresentation = new OperandError('[Operand] Malformed string representation')
  
  static unsupportedExponent(exponent: number): OperandError {
    return new OperandError(`[Operand] Invalid exponent ${exponent}`)
  }
}

export class OperationError extends Error {
  static insufficientOperands = new OperationError('[Operation] Insufficient operands')
  static unbalancedElements = new OperationError('[Operation] Unbalanced elements')
  
  static notImplemented(lhsOpnd: SimpleOperand, opr: Operator, rhsOpnd: SimpleOperand): OperationError {
    return new OperationError(
      `${operandString(lhsOpnd)} not implemented for '${opr}' operation with ${operandString(rhsOpnd)}`
    )
  }
}

export class ProbabilityError extends Error {
  static nullTotalWeight = new ProbabilityError('[Probability] Null total weight')
  static overflow = new ProbabilityError('[Probability] Value overflow')
  
  static unbalance<T>(selection: T[], weights: number[]): ProbabilityError {
    return new ProbabilityError(
      `[Probability] Selection/weight shortfall and/or unbalance (${selection.length}, ${weights.length})`
    )
  }
}
