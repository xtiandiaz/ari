import * as console from "./console"
import * as stringify from "./stringifier"
import * as utils from "./utils"
import Log from "./log"
import GameReducer from "./game/reducer"

async function main() {
  const log = new Log(process.env.npm_config_debug !== undefined)
  const reducer = new GameReducer()

  log.health(reducer.state.health)

  while (!reducer.state.isOver) {
    try {
      log.debug(reducer.state.stage)
      
      const inputResult = await console.askForInput(
        `${console.colorOperationOutput(stringify.operationString(reducer.state.stage))} = `,
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
          log.gameOver(
            reducer.state.score,
            stringify.operandString(reducer.state.stage.result)
          )
        } else {
          log.mistake(stringify.clueString(reducer.state.clue))
          log.health(reducer.state.health)
        }
      }
    } catch (error) {
      const msg = utils.altErrorMessage(error)
      if (msg) {
        log.info(msg, console.OutputColor.Red)
      } else {
        log.error(error)
      }
      continue
    }
  }

  console.closeInput()
}

await main()
