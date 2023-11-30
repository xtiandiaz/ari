import say from 'say'
import * as io from './io'
import { Log } from './log'
import { State } from './state'
import { Operation, Operator } from './operation'
import { Range } from './types'

const log = new Log()
const state = new State(log)

const operators = Object.values(Operator)

function randomSign(): number {
  return Math.random() > 0.5 ? 1 : -1
}
function randomOperand(range: Range): number {
  return (range.min + Math.floor(Math.random() * (range.max - range.min))) * randomSign()
}
function randomOperation(): Operation {
  const operator = operators[Math.floor(Math.random() * operators.length)]
  const operandRange = new Range(1, Math.round(100 * state.difficulty))
  let lhs: number
  let rhs: number
  
  switch (operator) {
    case Operator.Addition:
    case Operator.Multiplication:
    case Operator.Subtraction:
      lhs = randomOperand(operandRange)
      rhs = randomOperand(operandRange)
      break
    case Operator.Division:
      rhs = randomOperand(operandRange)
      lhs = rhs * randomOperand(operandRange.dividedBy(2).rounded())
      break
  }
  
  return new Operation(lhs, operator, rhs)
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
      const result = await io.askForInput(`${operation.text()} = `, (str) => {
        if (str.length == 0) {
          throw new Error()
        }
        return Number(str)
      })
      
      if (result == operation.result) {
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

// say.speak(`${operation.text()}`, undefined, 1.0, (err) => {
//   console.log(`${operation.text(false)} = ${operation.result}`, err)
// })
