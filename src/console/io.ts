import * as readline from 'readline'
import say from 'say'
import Operator from '../aritmethic/operator'

const rli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

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

export function close(): void {
  rli.close()
}
