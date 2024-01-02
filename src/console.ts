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
  LightRed = '1;31m',
  Green = '32m',
  Yellow = '33m',
  Blue = '34m',
  LightBlue = '1;34m',
  Magenta = '35m',
  LightMagenta = '1;35m',
  Cyan = '36m',
  LightCyan = '1;36m',
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
        return OutputColor.LightCyan
      case OperatorColor.Pink:
        return OutputColor.LightRed
      case OperatorColor.Purple:
        return OutputColor.LightMagenta
      case OperatorColor.Blue:
        return OutputColor.LightBlue
    }
  }
  return utils.colorOperators(
    str, 
    (opr) => {
      return colorOutput(opr.symbol, outputOprColor(opr.color))
    },
    (othStr) => {
      return colorOutput(othStr, OutputColor.White)
    }
  )
}
