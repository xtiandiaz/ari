import { Operation } from '../aritmethic/operation'
import Operator from '../aritmethic/operator'
import { Operand, Integer } from '../aritmethic/operands'
import * as utils from '../utils'
import log from '../console/log'

function _elementalOperand(baseMin: number, baseMax: number, exponentMax?: number): Operand {
  const base = Math.max(1, utils.randomIntNumber(baseMin, baseMax)) * utils.randomSign()
  const exponent = (() => {
    if (exponentMax !== undefined) {
      return utils.randomIntNumber(1, exponentMax)
    }
    return 1
  })()
  
  return new Integer(base, exponent)
}

function elementalOperand(difficulty: number): Operand {
  const baseMax = Math.round(10 * Math.max(1, difficulty))
  const exponentMax = Math.random() > (1 - Math.min(0.5, 0.05 * Math.round(difficulty)))
    ? Math.max(2, Math.min(3, Math.round(difficulty)))
    : undefined
  
  return _elementalOperand(2, baseMax, exponentMax)
}

function operationalOperand(difficulty: number, oprSelection: Operator[]): Operation {
  const oprCount = utils.randomIntNumber(1, Math.max(1, Math.min(4, Math.floor(difficulty))))
  const oprs = [...Array(oprCount).keys()].map((_) => utils.randomOperator(oprSelection))
  const opnds = [elementalOperand(difficulty)]
    .concat(oprs.map((_) => elementalOperand(difficulty)))
  const rtchdOOs = utils.fixAndRetouch(opnds, oprs)
  
  return new Operation(rtchdOOs[0], rtchdOOs[1])
}

function operand(difficulty: number): Operand {
  return Math.random() > (1 - Math.min(0.5, 0.05 * Math.round(difficulty)))
    ? operationalOperand(difficulty, [Operator.Addition, Operator.Subtraction])
    : elementalOperand(difficulty)
}

export function operation(difficulty: number): Operation {
  const opndCount = Math.max(2, Math.round(difficulty) + 1)
  const opnds = [...Array(opndCount).keys()].map((_) => operand(difficulty))
  const oprs = [...Array(opndCount - 1)].map(_ => utils.randomOperator())
  const fxdOOs = utils.fixAndRetouch(opnds, oprs)
  log.debug(`difficulty: ${utils.round(difficulty, 1)}`, fxdOOs)
  
  return new Operation(fxdOOs[0], fxdOOs[1])
}
