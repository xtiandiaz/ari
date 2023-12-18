import * as io from './io'
import log from './log'
import { State } from './state'
import * as factory from './factory'
import * as stringify from './stringifier'


async function main() {
  log.debugMode = process.env.npm_config_debug !== undefined
  
  const state = new State(log)
  
  let operation = factory.operation(state.difficulty)
  let isRetry = false
  
  function resume() {
    operation = factory.operation(state.difficulty)
    isRetry = false
  }
  
  while(true) {
    try {
      const result = await io.askForInput(
        `${stringify.operationString(operation)} = `, 
        (str) => {
          if (str.length == 0) {
            throw new Error()
          }
          return str
        }
      )
      
      if (result === stringify.operandString(operation.result)) {
        log.correctAnswer(operation, isRetry)
        resume()
      } else {
        log.mistake(operation)
        isRetry = true
      }
    } catch(error) {
      log.error(error)
      continue
    }
  }
}

await main()
