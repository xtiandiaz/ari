import Operator from './aritmethic/operator'
import { Operand, OperandKind } from './aritmethic/operand'
import SimpleOperand from './aritmethic/simple-operand'
import Operation from './aritmethic/operation'
import { AriErrorCode, AriError } from './errors'

export function round(num: number, fractionDigits: number): number {
  return Number(num.toFixed(fractionDigits))
}

export function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(num, max))
}

export function gcd(a: number, b: number) {
  if (b == 0) {
    return a
  }
  return gcd(b, a % b)
}

export function randomChoice<T>(selection: T[], probs: number[] = []): T {
  const totalProb = probs.reduce((acc, curVal) => acc + curVal, 0)
  if (totalProb > 1) {
    throw new AriError(AriErrorCode.MeasureOutOfRange, 'probability > 1')
  }
  if (probs.length < selection.length) {
    const diff = selection.length - probs.length
    const probShare = (1 - totalProb) / diff
    probs = probs.concat([...Array(diff).keys()].map((_) => probShare))
  }
  const choices = selection
    .map((c, i) => { return { el: c, prob: probs[i] } })
    .sort((a, b) => a.prob - b.prob)
  const randProb = Math.random()
  const choiceIdx = choices.findIndex((c) => randProb <= c.prob)
  // console.log(choices, randProb, choiceIdx)
  
  return choices[choiceIdx >= 0 ? choiceIdx : choices.length - 1].el
}

export function probability(weight: number, totalWeight: number, min: number = 0, max: number = 1): number {
  min = clamp(min, 0, 1)
  max = clamp(max, min, 1)
  weight = Math.max(0, weight)
  totalWeight = clamp(totalWeight, 1, Math.max(weight, totalWeight))
  
  return clamp((max - min) * weight / totalWeight, 0, 1)
}

export function randomWeightedChoice<T>(selection: T[], weights: number[]): T {
  if (selection.length < 2 || weights.length != selection.length) {
    throw new AriError(AriErrorCode.ElementUnbalance, `selection: ${selection}, weights: ${weights}`)
  }
  const totalWeight = weights.reduce((acc, curVal) => acc + curVal, 0)
  if (totalWeight <= 0) {
    throw new AriError(AriErrorCode.MeasureOutOfRange, `total weight ${totalWeight} <= 0`)
  }
  return randomChoice(selection, weights.map((w) => probability(w, totalWeight)))
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
        break
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

export function altErrorMessage(err: AriError): string | undefined {
  switch (err.code) {
    case AriErrorCode.MalformedStringRepresentation:
      return 'Hmm?'
    default:
      return undefined
  }
}

export function simpleOperandFromString(str: string): SimpleOperand {
  if (!/^-?[0-9]+(\/[0-9]+)?$/.test(str)) {
    throw new AriError(AriErrorCode.MalformedStringRepresentation, str)
  }
  
  const parts = str.split('/').map((sn) => Number(sn))
  return new SimpleOperand(parts[0], parts.length > 1 ? parts[1] : undefined)
}

export function colorOperation(
  optnStr: string, 
  colorOpr: (opr: Operator) => string,
  colorOthrEl: (othrStr: string) => string
): string {
  return optnStr.split(' ').map((p) => {
    const opr = (() => {
      switch (p) {
        case Operator.addition.symbol:
          return Operator.addition
        case Operator.subtraction.symbol:
          return Operator.subtraction
        case Operator.multiplication.symbol:
          return Operator.multiplication
        case Operator.division.symbol:
          return Operator.division
        default:
          return undefined
      }
    })()
    return { p: p, opr: opr }
  })
  .map((ip) => ip.opr ? colorOpr(ip.opr) : colorOthrEl(ip.p))
  .join(' ')
}
