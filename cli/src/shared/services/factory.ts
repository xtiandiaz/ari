import type { Operand } from '../models/operand'
import Operator from '../models/operator'
import SimpleOperand from '../models/simple-operand'
import Operation from '../models/operation'
import * as utils from './utilities'

function simpleOperand(difficulty: number): Operand {
  const numMax = Math.round(10 * Math.max(1, difficulty))
  const num = utils.randomIntNumber(2, numMax)
  // const denom = utils.randomChoice(
  //   [utils.randomIntNumber(1, 10), 1],
  //   [utils.clamp(0.025 * difficulty, 0.025, 0.25)]
  // )
  const denom = 1
  const exp = utils.randomChoice(
    [utils.randomIntNumber(1, utils.clamp(Math.floor(numMax / num), 1, 5)), 1],
    [utils.clamp(0.05 * difficulty, 0.05, 0.5)]
  )
  return new SimpleOperand(num, denom, exp)
}

function compoundOperand(difficulty: number, operators: Operator[]): Operation {
  const oprCount = utils.randomIntNumber(1, utils.clamp(Math.floor(difficulty), 1, 4))
  const oprs = [...Array(oprCount).keys()].map((_) => utils.randomOperator(operators))
  const opnds = [simpleOperand(difficulty)]
    .concat(oprs.map((_) => simpleOperand(difficulty)))
  const rtchdOOs = utils.fixAndRetouch(opnds, oprs)
  
  return new Operation(rtchdOOs[0], rtchdOOs[1])
}

function operand(difficulty: number): Operand {
  return utils.randomChoice(
    [
      compoundOperand(difficulty, [Operator.addition, Operator.subtraction]), 
      simpleOperand(difficulty)
    ],
    [utils.clamp(0.05 * difficulty, 0.05, 0.5)]
  )
}

export function operation(
  difficulty: number, 
  operators: Operator[] = [Operator.addition, Operator.subtraction, Operator.multiplication, Operator.division]
): Operation {
  const opndCount = Math.max(2, Math.round(difficulty) + 1)
  const opnds = [...Array(opndCount).keys()].map((_) => operand(difficulty))
  const oprs = [...Array(opndCount - 1)].map(_ => utils.randomOperator(operators, [0.4]))
  const fxdOOs = utils.fixAndRetouch(opnds, oprs)
  
  return new Operation(fxdOOs[0], fxdOOs[1])
}
