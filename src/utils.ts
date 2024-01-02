import Operator from './aritmethic/operator'
import { Operand, OperandKind } from './aritmethic/operand'
import SimpleOperand from './aritmethic/simple-operand'
import Operation from './aritmethic/operation'
import { OperandError } from './errors'

export function round(num: number, fracDigits: number): number {
  return Number(num.toFixed(fracDigits))
}

export function gcd(a: number, b: number) {
  if (b === 0) {
    return a
  }
  return gcd(b, a % b)
}

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

export function fixAndRetouch(opnds: Operand[], oprs: Operator[]): [Operand[], Operator[]] {
  let fxdOpnds = opnds
  let fxdOprs = oprs

  for (let i = 0; i < oprs.length; i++) {
    const lhsOpr = i > 0 ? oprs[i - 1] : undefined
    let opnd = opnds[i + 1]
    let rhsOpr = oprs[i]
    
    switch (opnd.kind) {
      case OperandKind.Compound:
        if (lhsOpr == Operator.division && opnd.rawValue == 0) {
          const rndOpr = randomOperator([Operator.addition, Operator.subtraction])
          const rndOpnd = new SimpleOperand(randomIntNumber(1, 10))
          const _opnd = <Operation>opnd
          opnd = new Operation(_opnd.operands.concat([rndOpnd]), _opnd.operators.concat([rndOpr]))
        }
        continue
      case OperandKind.Simple:
        if (opnd.rawValue < 0 && rhsOpr == Operator.addition) {
          const sOpnd = <SimpleOperand>opnd
          opnd = new SimpleOperand(sOpnd.numerator * -1, sOpnd.denominator, sOpnd.exponent)
          rhsOpr = Operator.subtraction
        }
        break
    }
    
    fxdOpnds[i + 1] = opnd
    fxdOprs[i] = rhsOpr
  }

  return [fxdOpnds, fxdOprs]
}

export function altErrorMessage(err: Error): string | undefined {
  switch (err) {
    case OperandError.malformedStringRepresentation:
      return 'Hmm?'
    default:
      return undefined
  }
}

export function simpleOperandFromString(str: string): SimpleOperand {
  if (!/^-?[0-9]+(\/[0-9]+)?$/.test(str)) {
    throw OperandError.malformedStringRepresentation
  }
  
  const parts = str.split('/').map((sn) => Number(sn))
  return new SimpleOperand(parts[0], parts.length > 1 ? parts[1] : undefined)
}

export function colorOperators(optnStr: string, coloring: (opr: Operator) => string): string {
  const parts = optnStr.split(' ')
  let coloredParts: string[] = []
  
  for (let p of parts) {
    switch (p) {
      case Operator.addition.symbol:
        p = coloring(Operator.addition)
        break
      case Operator.subtraction.symbol:
        p = coloring(Operator.subtraction)
        break
      case Operator.multiplication.symbol:
        p = coloring(Operator.multiplication)
        break
      case Operator.division.symbol:
        p = coloring(Operator.division)
        break
    }
    coloredParts.push(p)
  }
  return coloredParts.join(' ')
}
