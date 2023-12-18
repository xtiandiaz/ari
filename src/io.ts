import * as readline from 'readline'
import say from 'say'
import { Operand } from './operands'
import Operator from './operator'

const rli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export enum OutputColor {
  Red = '31m',
  Green = '32m',
  Yellow = '33m',
}

export function colorize(output: string, color: OutputColor): string {
  return `\x1b[${color}${output}\x1b[0m`
}

export function operandText(operand: Operand, isForSpeech: boolean): string {
  return `${operand.rawValue < 0 ? (isForSpeech ? 'negative' : '−') : ''}${Math.abs(operand.rawValue)}`
}

function operatorSpeechText(operator: Operator): string {
  switch (operator) {
  case Operator.Addition:
    return "plus"
  case Operator.Subtraction:
    return "minus"
  case Operator.Multiplication:
    return "multiplied by"
  case Operator.Division:
    return "divided by"
  }
}

export function askForInput<T>(
  query: string,
  convert: (input: string) => T,
  speechQuery?: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (speechQuery !== undefined) {
      say.speak(speechQuery, undefined, 1.0)
    }
    
    rli.question(query, (input) => {
      try {
        resolve(convert(input))
      } catch(error) {
        reject(error)
      }
      say.stop()
    })
  })
}
