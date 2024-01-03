import * as readline from 'readline'
import * as utils from './utils'
import { OperatorColor } from './aritmethic/operator'

const rli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export function askForInput<T>(query: string, convert: (input: string) => T): Promise<T> {
  return new Promise((rslv, rjct) => {    
    rli.question(query, (input) => {
      try {
        rslv(convert(input))
      } catch(error) {
        rjct(error)
      }
    })
  })
}

export function closeInput(): void {
  rli.close()
}

export enum OutputColor {
  Red = '31m',
  RedBold = '1;31m',
  Green = '32m',
  Yellow = '33m',
  Blue = '34m',
  BlueBold = '1;34m',
  Magenta = '35m',
  MagentaBold = '1;35m',
  Cyan = '36m',
  CyanBold = '1;36m',
  White = '37m',
  Gray = '90m'
}

export function colorOutput(str: string, color: OutputColor): string {
  return `\x1b[${color}${str}\x1b[0m`
}

export function colorOperationOutput(str: string): string {
  const outputOprColor = (oprColor: OperatorColor) => {
    switch (oprColor) {
      case OperatorColor.LightBlue:
        return OutputColor.CyanBold
      case OperatorColor.Pink:
        return OutputColor.RedBold
      case OperatorColor.Purple:
        return OutputColor.MagentaBold
      case OperatorColor.Blue:
        return OutputColor.BlueBold
    }
  }
  return utils.colorOperation(
    str, 
    (opr) => {
      return colorOutput(opr.symbol, outputOprColor(opr.color))
    },
    (othStr) => {
      return colorOutput(othStr, OutputColor.White)
    }
  )
}
