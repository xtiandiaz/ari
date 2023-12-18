import { Operand, OperandKind, Integer, Fraction } from './operands'
import { Operation } from './operation'
import Operator from './operator'

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
  }).join()
}

function integerString(int: Integer, parenthesized: boolean): string {
  parenthesized ||= int.baseRawValue < 0 && int.exponent > 1
  
  return `${parenthesized ? `(${int.base})` : `${int.base}`}${exponentString(int.exponent)}`
}

function fractionString(frac: Fraction, parenthesized: boolean): string {
  parenthesized ||= frac.baseRawValue < 0 && frac.exponent > 1
  const fracStr = `${frac.baseNumerator}/${frac.baseDenominator}`
  
  return `${parenthesized ? `(${fracStr})` : `${fracStr}`}${exponentString(frac.exponent)}`
}

function operationSegmentString(opnd: Operand, lhsOpr?: Operator, rhsOpr?: Operator): string {
  let shouldParenthesize = false
  switch (opnd.kind) {
    case OperandKind.Operation:
      shouldParenthesize = !(lhsOpr === undefined || lhsOpr === Operator.Addition) ||
        (rhsOpr !== undefined && [Operator.Multiplication, Operator.Division].includes(rhsOpr!))
      break
    default:
      shouldParenthesize = lhsOpr === Operator.Subtraction && opnd.baseRawValue < 0
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
  
  console.log(str)
  
  return `${lhsOpr !== undefined ? ` ${lhsOpr} ` : ''}${str}`
}

export function operandString(opnd: Operand, parenthesized: boolean = false): string {
  switch (opnd.kind) {
    case OperandKind.Integer:
      return integerString(<Integer>opnd, parenthesized)
    case OperandKind.Fraction:
      return fractionString(<Fraction>opnd, parenthesized)
    case OperandKind.Operation:
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
