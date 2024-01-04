import * as io from './console/io'
import * as stringify from './stringifier'
import * as utils from './utils'
import GameReducer from './game/reducer'

async function main() {
  const reducer = new GameReducer()

  io.writeHealth(reducer.state.health)

  while (!reducer.state.isOver) {
    try {
      // console.debug(reducer.state.stage)
      
      const inputResult = await io.ask(
        `${io.colorOperationString(stringify.operationString(reducer.state.stage))} = `,
        (str) => {
          if (str.length == 0) {
            throw new Error() // Maybe ask for skipping...
          }
          return utils.simpleOperandFromString(str)
        }
      )

      if (reducer.evaluate(inputResult)) {
        io.writeOfCorrectAnswer(reducer.state.score, reducer.state.isRetry)
        reducer.resume()
      } else {
        if (reducer.state.isOver) {
          io.writeOfGameOver(
            reducer.state.score,
            stringify.operandString(reducer.state.stage.result)
          )
        } else {
          io.writeOfMistake(stringify.clueString(reducer.state.clue))
          io.writeHealth(reducer.state.health)
        }
      }
    } catch (error) {
      const msg = utils.altErrorMessage(error)
      if (msg) {
        io.writeInfo(msg, io.Color.Red)
      } else {
        io.writeOfError(error)
      }
      continue
    }
  }

  io.close()
}

await main()
