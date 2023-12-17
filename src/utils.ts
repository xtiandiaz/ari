import Operator from './operator'
import { Operand, OperandKind, Integer } from './operands'
import { Operation } from './operation'

const allOperators = Object.values(Operator)

export function randomSign(): number {
  return Math.random() < 0.5 ? -1 : 1
}

export function randomOperator(oprSelection?: Operator[]): Operator {
  const selection = oprSelection ?? allOperators
  return selection[Math.floor(Math.random() * selection.length)]
}

export function randomIntNumber(min: number, max: number): number {
  min = Math.floor(min)
  max = Math.floor(max)
  return min + Math.round(Math.random() * (max - min))
}

export function gcd(a: number, b: number) {
  if (b === 0) {
    return a
  }
  return gcd(b, a % b)
}

export function fixAndRetouch(opnds: Operand[], oprs: Operator[]): [Operand[], Operator[]] {
  let fxdOpnds = opnds
  let fxdOprs = oprs

  for (let i = 0; i < oprs.length; i++) {
    const lhsOpr = i > 0 ? oprs[i - 1] : undefined
    let opnd = opnds[i + 1]
    let rhsOpr = oprs[i]
    
    switch (opnd.kind) {
      case OperandKind.Operation:
        if (lhsOpr == Operator.Division && opnd.rawValue == 0) {
          const rndOpr = randomOperator([Operator.Addition, Operator.Subtraction])
          const rndOpnd = new Integer(randomIntNumber(1, 10))
          const _opnd = <Operation>opnd
          opnd = new Operation(_opnd.operands.concat([rndOpnd]), _opnd.operators.concat([rndOpr]))
        }
        continue
      default:
        if (opnd.rawValue < 0 && rhsOpr == Operator.Addition) {
          opnd = opnd.operated(Operator.Multiplication, new Integer(-1))
          rhsOpr = Operator.Subtraction
        }
        break
    }
    
    fxdOpnds[i + 1] = opnd
    fxdOprs[i] = rhsOpr
  }

  return [fxdOpnds, fxdOprs]
}

export function exponentString(power: number): string {
  return [...Math.floor(power).toString()].map(digit => {
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
