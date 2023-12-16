import { Operation } from './operation'
import Operator from './operator'
import { Operand, Integer } from './operands'
import * as utils from './utils'

function randomElementalOperand(min: number, max: number): Operand {
  const n = Math.max(1, utils.randomIntNumber(min, max))
  return new Integer(n * utils.randomSign())
}

function randomOperationalOperand(difficulty: number, oprSelection: Operator[]): Operation {
  const oprCount = Math.max(1, Math.min(5, Math.floor(difficulty)))
  const oprs = [...Array(oprCount).keys()].map((_) => utils.randomOperator(oprSelection))
  const opndMax = Math.floor(20 * difficulty)
  const opnds = [randomElementalOperand(1, opndMax)]
    .concat(oprs.map((_) => randomElementalOperand(1, opndMax)))
  // console.log(operands.length, operators.length)
  const rtchdOOs = utils.fixAndRetouch(opnds, oprs)
  
  return new Operation(rtchdOOs[0], rtchdOOs[1])
}

function randomOperand(difficulty: number): Operand {
  return Math.random() > (1 - Math.min(0.5, 0.1 * Math.ceil(difficulty)))
    ? randomOperationalOperand(difficulty, [Operator.Addition, Operator.Subtraction])
    : randomElementalOperand(1, Math.floor(30 * difficulty))
}

export function operation(difficulty: number): Operation {
  const opndCount = Math.max(2, Math.ceil(difficulty) + 1)
  const opnds = [...Array(opndCount).keys()].map((_) => randomOperand(difficulty))
  const oprs = [...Array(opndCount - 1)].map(_ => utils.randomOperator())
  const rtchdOOs = utils.fixAndRetouch(opnds, oprs)
  // console.log(rtchdOOs[0], rtchdOOs[1])
  
  return new Operation(rtchdOOs[0], rtchdOOs[1])
}
