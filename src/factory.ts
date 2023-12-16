import Operation from './operation'
import Operator from './operator'
import { Operand, Integer } from './operands'
import { Range } from './types'
import * as utils from './utils'

const allOperators = Object.values(Operator)
// const operators = [Operator.Addition, Operator.Subtraction, Operator.Multiplication]

function randomSign(): number {
  return Math.random() > 0.5 ? 1 : -1
}

function randomOperator(oprSelection?: Operator[]): Operator {
  const selection = oprSelection ?? allOperators
  return selection[Math.floor(Math.random() * selection.length)]
}

function randomElementalOperand(range: Range): Operand {
  return new Integer((range.min + Math.floor(Math.random() * (range.max - range.min))) * randomSign())
}

function randomOperationOperand(difficulty: number, oprSelection: Operator[]): Operation {
  const oprCount = Math.max(1, Math.min(3, Math.ceil(difficulty)))
  const oprs = [...Array(oprCount).keys()].map((_) => randomOperator(oprSelection))
  const opndRange = new Range(1, Math.floor(20 * difficulty))
  const opnds = [randomElementalOperand(opndRange)]
    .concat(oprs.map((_) => randomElementalOperand(opndRange)))
  // console.log(operands.length, operators.length)
  const rtchdOOs = utils.retouch(opnds, oprs)
  
  return new Operation(rtchdOOs[0], rtchdOOs[1])
}

function randomOperand(difficulty: number): Operand {
  return Math.random() > (1 - Math.min(0.5, 0.1 * Math.ceil(difficulty)))
    ? randomOperationOperand(difficulty, [Operator.Addition, Operator.Subtraction])
    : randomElementalOperand(new Range(1, Math.floor(30 * difficulty)))
}

export function operation(difficulty: number): Operation {
  const opndCount = Math.max(2, Math.ceil(difficulty) + 1)
  const opnds = [...Array(opndCount).keys()].map((_) => randomOperand(difficulty))
  const oprs = [...Array(opndCount - 1)].map(_ => randomOperator())
  const rtchdOOs = utils.retouch(opnds, oprs)
  console.log(rtchdOOs[0], rtchdOOs[1])
  
  return new Operation(rtchdOOs[0], rtchdOOs[1])
}
