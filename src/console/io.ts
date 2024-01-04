import * as readline from 'readline'
import { OperatorColor } from '../aritmethic/operator'
import * as utils from '../utils'
import { Score } from '../game/state'

export enum Color {
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

const rli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function write(...str: string[]): void {
  rli.write(`${str.join('  ')}\n`)
}

export function ask<T>(query: string, convert: (input: string) => T): Promise<T> {
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

export function colorString(str: string, color: Color): string {
  return `\x1b[${color}${str}\x1b[0m`
}

export function writeHealth(val: number): void {
  write(colorString([...Array(Math.floor(val)).keys()].map(_ => '❤️').join(' '), Color.Red))
}

export function writeScore(val: Score, prefix?: string, includePoints: boolean = false): void {
  write(
    colorString(`${prefix ?? ''}${val.hits}/${val.hits + val.misses} ✔️`, Color.Green),
    includePoints ? colorString(`${val.points} pts`, Color.White) : ''
  )
}

export function writeOfCorrectAnswer(score: Score, isRetry: boolean): void {
  if (isRetry) {
    write(colorString(`Good!`, Color.Yellow))
  } else {
    writeScore(score, 'Perfect! ')
  }
}

export function writeOfMistake(clue?: string): void {
  write(colorString('Not there yet... Try again!', Color.Magenta))
  
  if (clue) {
    write(colorString(`(Psst! ${clue})`, Color.Gray))
  }
}

export function writeOfGameOver(score: Score, correctResult: string): void {
  write(colorString(`= ${correctResult}`, Color.Yellow))
  write(colorString('\nGAME OVER', Color.Magenta))
  writeScore(score, undefined, true)
}

export function writeInfo(msg: string, color?: Color): void {
  write(color ? colorString(msg, color) : msg)
}

export function writeOfError(err: Error): void {
  write(colorString(err.message, Color.Red))
}

export function colorOperationString(str: string): string {
  const outputOprColor = (oprColor: OperatorColor) => {
    switch (oprColor) {
      case OperatorColor.LightBlue:
        return Color.CyanBold
      case OperatorColor.Pink:
        return Color.RedBold
      case OperatorColor.Purple:
        return Color.MagentaBold
      case OperatorColor.Blue:
        return Color.BlueBold
    }
  }
  return utils.colorOperationString(
    str, 
    (opr) => {
      return colorString(opr.symbol, outputOprColor(opr.color))
    },
    (othStr) => {
      return colorString(othStr, Color.White)
    }
  )
}

export function close(): void {
  rli.close()
}
