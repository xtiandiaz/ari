import * as io from './console/io'
import log from './console/log'
import GameReducer from './game/reducer'
import * as stringify from './stringifier'

async function main() {
  log.debugMode = process.env.npm_config_debug !== undefined
  
  const reducer = new GameReducer()
  
  log.health(reducer.state.health)
  
  while(!reducer.state.isOver) {
    try {
      const inputResult = await io.askForInput(
        `${stringify.operationString(reducer.state.stage)} = `, 
        (str) => {
          if (str.length == 0) {
            throw new Error()
          }
          return str
        }
      )
      
      if (reducer.evaluate(inputResult)) {
        log.correctAnswer(reducer.state.score, reducer.state.isRetry)
      } else {
        log.mistake(reducer.state.score, reducer.state.isOver)
        log.health(reducer.state.health)
      }
    } catch(error) {
      log.error(error)
      continue
    }
  }
  
  io.close()
}

await main()
