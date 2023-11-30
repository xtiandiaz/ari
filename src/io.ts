import * as readline from 'readline'

const rli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export enum OutputColor {
  Red = '31m',
  Green = '32m',
  Yellow = '33m',
}

export function outputFormat(color: OutputColor): string {
  return `\x1b[${color}%s\x1b[0m`
}

export function askForInput<T>(query: string, convert: (input: string) => T): Promise<T> {
  return new Promise((resolve, reject) => {
    rli.question(query, (input) => {
      try {
        resolve(convert(input))
      } catch(error) {
        reject(error)
      }
    })
  })
}
