import type { Operand } from './aritmethic/operand'
import type SimpleOperand from './aritmethic/simple-operand'
import type Operation from './aritmethic/operation'
import Operator from './aritmethic/operator'
import { OperandKind } from './aritmethic/operand'
import { SolutionClue } from './game/state'

function exponentString(exponent: number): string {
  if (exponent == 1) {
    return ''
  }
  
  return [...Math.floor(exponent).toString()].map(digit => {
    switch (digit) {
      case '0': return '⁰'
      case '1': return '¹'
      case '2': return '²'
      case '3': return '³'
      case '4': return '⁴'
      case '5': return '⁵'
      case '6': return '⁶'
      case '7': return '⁷'
      case '8': return '⁸'
      case '9': return '⁹'
    }
  }).join('')
}

function simpleOperandString(frac: SimpleOperand, parenthesized: boolean): string {
  parenthesized ||= frac.numerator < 0 && frac.exponent > 1
  
  const fracStr = frac.denominator !== 1 
    ? `${frac.numerator}/${frac.denominator}`
    : `${frac.numerator}`
  
  return `${parenthesized ? `(${fracStr})` : `${fracStr}`}${exponentString(frac.exponent)}`
}

function operationSegmentString(opnd: Operand, lhsOpr?: Operator, rhsOpr?: Operator): string {
  let shouldParenthesize = false
  switch (opnd.kind) {
    case OperandKind.Compound:
      shouldParenthesize = !(lhsOpr === undefined || lhsOpr === Operator.Addition) ||
        (rhsOpr !== undefined && [Operator.Multiplication, Operator.Division].includes(rhsOpr!))
      break
    case OperandKind.Simple:
      shouldParenthesize = lhsOpr === Operator.Subtraction && (<SimpleOperand>opnd).numerator < 0
      break
  }
  
  let str = operandString(opnd, shouldParenthesize)
  
  switch (str.substring(0, 1)) {
    case Operator.Subtraction:
      if (lhsOpr === Operator.Addition) {
        str = str.substring(1)
        lhsOpr = Operator.Subtraction
      }
      break
  }
  
  return `${lhsOpr !== undefined ? ` ${lhsOpr} ` : ''}${str}`
}

export function operandString(opnd: Operand, parenthesized: boolean = false): string {
  switch (opnd.kind) {
    case OperandKind.Simple:
      return simpleOperandString(<SimpleOperand>opnd, parenthesized)
    case OperandKind.Compound:
      return operationString(<Operation>opnd, parenthesized)
  }
}

export function operationString(optn: Operation, parenthesized: boolean = false): string {
  let str = operationSegmentString(optn.operands[0], undefined, optn.operators[0])
  
  for (let i = 0; i < optn.operators.length; i++) {
    const lhsOpr = optn.operators[i]
    const opnd = optn.operands[i + 1]
    const rhsOpr = i < (optn.operators.length - 1) ? optn.operators[i + 1] : undefined
    
    str += operationSegmentString(opnd, lhsOpr, rhsOpr)
  }
  
  return parenthesized ? `(${str})` : str
}

export function clueString(clue?: SolutionClue): string | undefined {
  switch (clue) {
    case SolutionClue.checkSign:
      return 'Check the sign...'
    case SolutionClue.simplify:
      return 'Simplify to the simplest fractional...'
    default:
      return undefined
  }
}
