import * as io from './io'
import { Log } from './log'
import { State } from './state'
import * as factory from './factory'

const log = new Log()
const state = new State(log)

async function main() {
  let operation = factory.operation(state.difficulty)
  let isRetry = false
  
  function resume() {
    operation = factory.operation(state.difficulty)
    isRetry = false
  }
  
  while(true) {
    try {
      const result = await io.askForInput(
        `${operation.textRepresentation} = `, 
        (str) => {
          if (str.length == 0) {
            throw new Error()
          }
          return str
        }
      )
      
      if (result === operation.result.textRepresentation) {
        log.correctAnswer(operation, isRetry)
        resume()
      } else {
        log.mistake(operation)
        isRetry = true
      }
    } catch(error) {
      console.log(error)
      continue
    }
  }
}

await main()
