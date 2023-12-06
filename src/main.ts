import * as io from './io'
import { Log } from './log'
import { State } from './state'
import Operation from './operation'
import Operator from './operator'
import { Operand, Integer } from './operands'
import { Range } from './types'

const log = new Log()
const state = new State(log)

const operators = Object.values(Operator)
// const operators = [Operator.Addition, Operator.Subtraction, Operator.Multiplication]

function randomSign(): number {
  return Math.random() > 0.5 ? 1 : -1
}
function randomOperand(range: Range): Integer {
  return new Integer((range.min + Math.floor(Math.random() * (range.max - range.min))) * randomSign())
}
function randomOperator(): Operator {
  return operators[Math.floor(Math.random() * operators.length)]
}
function randomOperation(): Operation {
  // const operators = [...Array(2).keys()].map((_) => randomOperator())
  const operators = [Operator.Subtraction, Operator.Division]
  const operandRange = new Range(1, Math.round(100 * state.difficulty))
  // const operands = [randomOperand(operandRange)]
  //   .concat(operators.map((_) => randomOperand(operandRange)))
  const operands = [7, -1, 1].map(n => new Integer(n))
  // console.log(operands.length, operators.length)
  
  return new Operation(operands, operators)
}

(async () => {
  let operation = randomOperation()
  let isRetry = false
  
  function resume() {
    operation = randomOperation()
    isRetry = false
  }
  
  while(true) {
    try {
      const result = await io.askForInput(
        `${operation.textRepresentation} = `, 
        (str) => {
          // if (str.length == 0) {
          //   throw new Error()
          // }
          // return Number(str)
          return str
        }
      )
      
      if (result == operation.result.textRepresentation) {
        log.correctAnswer(operation, isRetry)
        resume()
      } else {
        log.mistake(operation)
        isRetry = true
      }
    } catch {
      continue
    }
  }
})()
