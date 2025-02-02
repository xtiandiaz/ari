import * as io from './console/io'
import * as stringify from './stringifier'
import * as utils from './utils'
import GameReducer from './game/reducer'
import { AriErrorCode, AriError } from './errors'

async function main() {
  const reducer = new GameReducer()

  io.writeHealth(reducer.state.health)

  while (!reducer.state.isOver) {
    try {      
      const inputResult = await io.ask(
        `${io.colorOperationString(stringify.operationString(reducer.state.stage))} = `,
        (str) => {
          switch (str) {
            case "answer":
            case "debug":
            case "skip":
              throw new AriError(AriErrorCode.Cheating, str)
            default:
              return utils.simpleOperandFromString(str)
          }
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
      let ariError: (AriError | undefined) = error as AriError
      
      switch (ariError.code) {
        case AriErrorCode.Cheating:
          switch (ariError.message) {
            case "answer":
              io.writeInfo(
                stringify.operandString(reducer.state.stage.result), 
                io.Color.Gray
              )
              break
            case "debug":
              console.debug(JSON.stringify(reducer.state.stage, null, 2))
              break
            case "skip":
              reducer.resume()
              break
          }
          break
        default:
          const msg = utils.altErrorMessage(error)
          if (msg) {
            io.writeInfo(msg, io.Color.Red)
          } else {
            io.writeOfError(error)
          }
          break
      }
      continue
    }
  }

  io.close()
}

await main()
