import Operator from './operator'
import { Operand, OperandKind, Integer } from './operands'

export function gcd(a: number, b: number) {
  if (b === 0) {
    return a
  }
  return gcd(b, a % b)
}

export function retouch(opnds: Operand[], oprs: Operator[]): [Operand[], Operator[]] {
  let rtchdOpnds = opnds
  let rtchdOperators = oprs

  for (let i = 0; i < oprs.length; i++) {
    let opnd = opnds[i + 1]
    if (opnd.kind === OperandKind.Operation) {
      continue
    }
    let opr = oprs[i]
    if (opnd.rawValue < 0 && opr === Operator.Addition) {
      opnd = opnd.operated(Operator.Multiplication, new Integer(-1))
      opr = Operator.Subtraction
    }

    rtchdOpnds[i + 1] = opnd
    rtchdOperators[i] = opr
  }

  return [rtchdOpnds, rtchdOperators]
}
