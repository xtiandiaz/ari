import * as io from './console/io'
import log from './console/log'
import GameReducer from './game/reducer'
import * as stringify from './stringifier'
import * as utils from './utils'

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
            throw new Error() // Maybe ask for skipping...
          }
          return utils.simpleOperandFromString(str)
        }
      )
      
      if (reducer.evaluate(inputResult)) {
        log.correctAnswer(reducer.state.score, reducer.state.isRetry)
        reducer.resume()
      } else {
        if (reducer.state.isOver) {
          log.gameOver(reducer.state.score, stringify.operandString(reducer.state.stage.result))
        } else {
          log.mistake(stringify.clueString(reducer.state.clue))
          log.health(reducer.state.health)
        }
      }
    } catch(error) {
      const msg = utils.altErrorMessage(error)
      if (msg) {
        log.info(msg, io.OutputColor.Red)
      } else {
        log.error(error)
      }
      continue
    }
  }
  
  io.close()
}

await main()
