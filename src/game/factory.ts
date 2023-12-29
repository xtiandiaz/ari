import type { Operand } from '../aritmethic/operand'
import Operator from '../aritmethic/operator'
import SimpleOperand from '../aritmethic/simple-operand'
import Operation from '../aritmethic/operation'
import * as utils from '../utils'

function simpleOperand(difficulty: number): Operand {
  const numMax = Math.round(10 * Math.max(1, difficulty))
  const num = utils.randomIntNumber(2, numMax) * utils.randomSign()
  const denom = 1
  const exp = Math.random() > (1 - Math.min(0.5, 0.05 * Math.round(difficulty)))
    ? utils.randomIntNumber(1, Math.min(5, Math.max(1, Math.floor(numMax / num))))
    : 1
  
  return new SimpleOperand(num, denom, exp)
}

function operationalOperand(difficulty: number, oprSelection: Operator[]): Operation {
  const oprCount = utils.randomIntNumber(1, Math.max(1, Math.min(4, Math.floor(difficulty))))
  const oprs = [...Array(oprCount).keys()].map((_) => utils.randomOperator(oprSelection))
  const opnds = [simpleOperand(difficulty)]
    .concat(oprs.map((_) => simpleOperand(difficulty)))
  const rtchdOOs = utils.fixAndRetouch(opnds, oprs)
  
  return new Operation(rtchdOOs[0], rtchdOOs[1])
}

function operand(difficulty: number): Operand {
  return Math.random() > (1 - Math.min(0.5, 0.05 * Math.round(difficulty)))
    ? operationalOperand(difficulty, [Operator.Addition, Operator.Subtraction])
    : simpleOperand(difficulty)
}

export function operation(difficulty: number): Operation {
  const opndCount = Math.max(2, Math.round(difficulty) + 1)
  const opnds = [...Array(opndCount).keys()].map((_) => operand(difficulty))
  const oprs = [...Array(opndCount - 1)].map(_ => utils.randomOperator())
  const fxdOOs = utils.fixAndRetouch(opnds, oprs)
  
  return new Operation(fxdOOs[0], fxdOOs[1])
}
